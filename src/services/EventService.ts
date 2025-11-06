import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Brackets, SelectQueryBuilder } from "typeorm"
import { Event } from "../entity/Event"
import { Invite } from "../entity/Invite"
import { Setting } from "../entity/Setting"
import { Request } from "express"
import RedisService from "./RedisService"
import { OdienceEventCollection } from "../resources/OdienceEventResource"

export class EventService {
  private eventRepository: Repository<Event>
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()
  constructor() {
    this.eventRepository = AppDataSource.getRepository(Event)
  }

  async getUsersConnected(eventId: number): Promise<number> {
    try {
      const key = "{event:" + eventId + "}:users:"
      const usersConnected = await this.redisClient.hGet(key, "users_connected_list")
      return Number(usersConnected)
    } catch (err) {
      console.error("getUsersConnected.Redis error:", (err as Error).message)
    }
    return 0
  }


  calcDis(lat1: number, lon1: number, lat2: number, lon2: number) : number {
    return 6371*2000*Math.asin(Math.pow(Math.sin((lat1-lat2)*Math.PI/360),2) +
        Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)) *
        Math.pow(Math.sin((lon1-lon2)*Math.PI/360),2)
  }

  hasUserInvite(invites: { recipient: string }[], userInfo: {
  userId: number
  msisdn: string
  isSuperAdmin: boolean
  emails: string[]
}): boolean {
    return invites.some(invite =>
      invite.recipient === userInfo.msisdn ||
    userInfo.emails.includes(invite.recipient)
    )
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
      const query = this.eventRepository
        .createQueryBuilder("event")
        .leftJoinAndSelect("event.invites", "invites")
        .leftJoinAndSelect("event.streams", "streams")
        .leftJoinAndSelect("streams.streamUrls", "streamUrls")
        .leftJoinAndSelect("event.eventSimulations", "simulations")
        .leftJoinAndSelect("event.group", "group")
        .leftJoinAndSelect("event.owner", "owner")
        .leftJoinAndSelect("event.usersRemoved", "usersRemoved")
        .leftJoinAndSelect("event.usersOpened", "usersOpened")
        .leftJoinAndSelect("event.eventRequests", "eventRequests")
        .leftJoinAndSelect("event.usersRegistered", "usersRegistered")
        .leftJoinAndSelect("event.usersInterested", "usersInterested")
        .leftJoinAndSelect("event.usersBlocked", "usersBlocked")
        .leftJoinAndSelect("event.ads", "ads")
        .leftJoinAndSelect("ads.sponsor", "adsSponsor")
        .leftJoinAndSelect(
          "event.settings",
          "settings",
          "settings.key = :key AND settings.configurable_type = :type AND settings.configurable_id = event.id",
          { key: Setting.EVENT_SETTINGS, type: "App\\Models\\Event" }
        )
        .where("event.isDraft = :isDraft", { isDraft: false })
        .andWhere("event.active = :active", { active: true })
        // Conditionally add category filter
      if (searchCategory) {
        query.andWhere("event.category = :category", { category: searchCategory })
      }
      // Conditionally add location filter
      if (searchLocation) {
        query.andWhere("event.location LIKE :location", { location: `%${searchLocation}%` })
      }

      query.andWhere(new Brackets(qb => {
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
      const events =  await query.getMany()
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
      //*/
      for (const x of result as any[]) {
        x.usersConnected = await this.getUsersConnected(x.id)
        x.invitationAccepted = this.hasUserInvite(x.invites, userInfo)
        if (x.invitationsOnly && !x.invitationAccepted) {
          x.invitationAccepted = true
          if (x.location) {  //&& event.locationLock
            console.log("latitude:", x.latitude)
            console.log("longitude:", x.longitude)
            if (cachedData) {
              console.log("cachedData", cachedData)
              const loc = cachedData.split(",")
              if (loc.length >= 2) {
                const dis = this.calcDis(parseFloat(x.latitude!), parseFloat(x.longitude!), parseFloat(loc[0]), parseFloat(loc[1]))
                console.log("dis:", dis)
                x.invitationAccepted = false
              }
            }
          }
        }
        delete x.invites
        for (const e in x) if (null == x[e]) delete x[e]
      }
      const filteredEvents = OdienceEventCollection(result, isWeb, userInfo)
      return { total_events : result.length, per_page: result.length, current_page: 1, events: filteredEvents}
    } catch (error) {
      console.log(error)
      return null
    }
  }
}