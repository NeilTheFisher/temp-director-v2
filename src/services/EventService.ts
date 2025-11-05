import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { In, Brackets, SelectQueryBuilder } from "typeorm"
import { Event } from "../entity/Event"
import { Group } from "../entity/Group"
import { Invite } from "../entity/Invite"
import { Setting } from "../entity/Setting"
import { EventStream } from "../entity/EventStream"
import { EventSimulation } from "../entity/EventSimulation"
import { Stream } from "../entity/Stream"
import { Request } from "express"
import RedisService from "./RedisService"
import { OdienceEventCollection } from "../resources/OdienceEventResource"

const EVENT_STATUS_LIVE = "live"
const EVENT_STATUS_RE_STREAM = "re-stream"
const EVENT_STATUS_ON_DEMAND = "on-demand"
const EVENT_STATUS_DRAFT = "draft"
const EVENT_STATUS_ENDED = "ended"
const EVENT_STATUS_UPCOMING = "upcoming"
const EVENT_STATUS_DEACTIVATED = "deactivated"

export class EventService {
  private eventRepository: Repository<Event>
  private streamRepository: Repository<Stream>
  private groupRepository: Repository<Group>
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()
  constructor() {
    this.eventRepository = AppDataSource.getRepository(Event)
    this.streamRepository = AppDataSource.getRepository(Stream)
    this.groupRepository = AppDataSource.getRepository(Group)
  }

  type(ev:EventStream, stream: Stream[]) : number {
    if (ev.stream) return ev.stream.recordedType
    const s = stream.find((e:Stream) => ev.streamId == e.id)
    console.log("s", s)
    return s ? s.recordedType : -1
  }

  label(event : Event, stream: Stream[]) : string {
    const now = new Date().valueOf() / 1000
    if (!event.active) return EVENT_STATUS_DEACTIVATED
    if (event.isDraft)  return EVENT_STATUS_DRAFT
    if (event.duration && event.date && event.date + event.duration <= now)
      return EVENT_STATUS_ENDED
    if (event.eventStreams.length == 0) return EVENT_STATUS_DRAFT
    const event_stream : EventStream[] = event.eventStreams || []
    const event_simulations : EventSimulation[] = event.eventSimulations || []

    if (event.date && event.date <= now && (event.duration == null || event.date + event.duration > now))
    {
      if(event_stream.length === 0 && event_simulations.length > 0)
        return EVENT_STATUS_LIVE
      if (undefined != event_stream.find((e:EventStream) => this.type(e, stream) == 0))
        return EVENT_STATUS_LIVE
      if (event.restream || undefined != event_stream.find((e:EventStream) => this.type(e, stream) == 1) ) //nvr live
        return EVENT_STATUS_RE_STREAM
      if (undefined != event_stream.find((e:EventStream) =>this.type(e, stream) == 2))  //nvr live or resteam
        return EVENT_STATUS_ON_DEMAND
    }
    if (event.date && event.date > now)
      return EVENT_STATUS_UPCOMING

    return EVENT_STATUS_DEACTIVATED
  }

  hasRicoh(streams: Stream[])
  {
    return streams.some(stream => stream.code && stream.code.trim() !== "")
  }

  calcDis(lat1: number, lon1: number, lat2: number, lon2: number) : number {
    return 6371*2000*Math.asin(Math.pow(Math.sin((lat1-lat2)*Math.PI/360),2) +
        Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)) *
        Math.pow(Math.sin((lon1-lon2)*Math.PI/360),2)
  }

  async getEvents(req: Request, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}): Promise<any> {
    try {

      const cacheKey =  `{user:${userInfo.msisdn}}:coordinates` // todo
      const cachedData = await this.redisClient.get(cacheKey)
      const dateNow = Math.floor(Date.now() / 1000)
      const searchInitTimestamp = Number(req.query["date"] ?? 0)
      const isWeb = Boolean(parseInt((req.query["web"] as string) ?? "0", 10))
      const searchLocation = req.query["location"] ?? ""
      const searchCategory = req.query["category"] ?? ""
      const dateStr = searchInitTimestamp
        ? new Date(searchInitTimestamp * 1000).toISOString().slice(0, 10) // YYYY-MM-DD
        : null
      const events = await this.eventRepository
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.invites", "invite")
        .leftJoinAndSelect("event.eventStreams", "streams")
        .leftJoinAndSelect("event.eventSimulations", "simulations")
        .leftJoinAndSelect("event.group", "group")
        .leftJoinAndSelect("event.owner", "owner")
        .leftJoinAndSelect(
          "event.settings",
          "settings",
          "settings.key = :key AND settings.configurable_type = :type AND settings.configurable_id = event.id",
          { key: Setting.EVENT_SETTINGS, type: "App\\Models\\Event" }
        )
        .where("event.isDraft = :isDraft", { isDraft: false })
        .where("event.active = :active", { active: true })
        .where("event.category = :category", { category: searchCategory })
        .where("event.location LIKE :location", { location: `%${searchLocation}%` })
        .andWhere(new Brackets(qb => {
          qb.where(new Brackets(subQ => {
            subQ.where("(event.date + event.duration) >= :dateNow", { dateNow })
              .orWhere("event.duration IS NULL")

            if (dateStr) {
              subQ.andWhere("DATE(FROM_UNIXTIME(event.dateStr)) = :dateStr", { dateStr })
            }
          }))
        }))
        .andWhere(new Brackets(qb => {
          qb.where((qb2: SelectQueryBuilder<Event>) => {
            const sub1 = qb2.subQuery()
              .select("1")
              .from("event_stream", "es")
              .where("es.event_id = event.id")
              .getQuery()
            return `EXISTS ${sub1}`
          })
            .orWhere((qb2: SelectQueryBuilder<Event>) => {
              const sub2 = qb2.subQuery()
                .select("1")
                .from("event_simulation", "sim")
                .where("sim.event_id = event.id")
                .getQuery()
              return `EXISTS ${sub2}`
            })
        }))
        .getMany()
      const now = new Date().valueOf() / 1000
      const result = events.filter( (event:Event) => {
        if (!event.isPublic) {
          if(userInfo.orgIds.includes(event.groupId || 0) || event.ownerId === userInfo.userId || userInfo.isSuperAdmin){
            return true
          }
          const invites = event.invites || []
          console.log("invites:", invites)
          const found = invites.find((i: Invite) =>
            i.recipient === userInfo.msisdn || userInfo.emails.includes(i.recipient)
          )
          if (!found) return false
        }
        console.log("allow", event.name)
        return true
      })

      //* so far eventStreams didn't load stream from foreign table
      const ids : number[] = []
      for (const event of result) {
        for (const stream of event.eventStreams) {
          ids.push(stream.streamId)
        }
      }
      const streams = await this.streamRepository.find({
        where: {
          id: In(ids)
        },
        relations: ["streamUrls"], // <-- load the related URLs
      })
      //*/

      result.forEach( (x:any) => {
        if (x.invitationsOnly) {
          x.invitation_accepted = true
          if (x.location) {  //&& event.locationLock
            console.log("latitude:", x.latitude)
            console.log("longitude:", x.longitude)
            if (cachedData) {
              console.log("cachedData", cachedData)
              const loc = cachedData.split(",")
              if (loc.length >= 2) {
                const dis = this.calcDis(parseFloat(x.latitude!), parseFloat(x.longitude!), parseFloat(loc[0]), parseFloat(loc[1]))
                console.log("dis:", dis)
                x.invitation_accepted = false
              }
            }
          }
        }
        delete x.invites
        for (const e in x) if (null == x[e]) delete x[e]
        x.label = this.label(x as Event, streams)
        x.is_live = EVENT_STATUS_LIVE == x.label
        x.is_upcoming = EVENT_STATUS_UPCOMING == x.label
        x.is_past = !x.is_draft && x.date && x.duration && x.date + x.duration <= now
        x.hasRicoh = this.hasRicoh(streams)
        x.downloadUrls = Array.from(
          new Set(
            streams.flatMap(stream =>
              stream.streamUrls
                .map(url => url.downloadUrl)
                .filter(u => u) // remove null/undefined/empty strings
            )
          )
        )
        //x.ads_count todo need change Event.ts
      })
      const filteredEvents = OdienceEventCollection(result, isWeb, userInfo)
      return { total_events : result.length, per_page: result.length, current_page: 1, events: filteredEvents}
    } catch (error) {
      console.log(error)
      return null
    }
  }
}