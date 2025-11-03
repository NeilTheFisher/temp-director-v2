import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { In } from "typeorm"
import { Event } from "../entity/Event"
import { Invite } from "../entity/Invite"
import { EventStream } from "../entity/EventStream"
import { Stream } from "../entity/Stream"
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
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()
  constructor() {
    this.eventRepository = AppDataSource.getRepository(Event)
    this.streamRepository = AppDataSource.getRepository(Stream)
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

    if (event.date && event.date <= now && (event.duration == null || event.date + event.duration > now))
    {
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

  calcDis(lat1: number, lon1: number, lat2: number, lon2: number) : number {
    return 6371*2000*Math.asin(Math.pow(Math.sin((lat1-lat2)*Math.PI/360),2) +
        Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)) *
        Math.pow(Math.sin((lon1-lon2)*Math.PI/360),2)
  }

  async getEvents(userInfo: {userId: number, msisdn: string, emails: string[], orgIds: number[]}): Promise<any> {
    try {
      const cacheKey =  `{user:${userInfo.msisdn}}:coordinates` // todo
      const cachedData = await this.redisClient.get(cacheKey)
      const events = await this.eventRepository.find({
        //select: {id: true,name: true,latitude: true,longitude: true,invites: true,},
        where : {isDraft : false},
        relations: ["invites", "eventStreams"]
      })
      const now = new Date().valueOf() / 1000

      const result = events.filter( (event:Event) => {
        if (!event.isPublic && event.invitationsOnly) {
          if(userInfo.orgIds.includes(event.ownerId)){
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
      result.forEach( (event:Event) => {
        event.eventStreams.forEach((x) => ids.push(x.streamId) )
      })
      const streams = await this.streamRepository.findBy({
        //select: {id: true, recordedType: true},
        id: In(ids)
      })
      console.log("streams", streams)
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
        //x.ads_count todo need change Event.ts
      })
      const filteredEvents = OdienceEventCollection(result)
      return { total_events : result.length, per_page: result.length, current_page: 1, events: filteredEvents}
    } catch (error) {
      console.log(error)
      return null
    }
  }
}