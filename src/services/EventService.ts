import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Brackets, SelectQueryBuilder } from "typeorm"
import { Event } from "../entity/Event"
import { Invite } from "../entity/Invite"
import { Setting } from "../entity/Setting"
import { Request } from "express"
import RedisService from "./RedisService"
import { OdienceEventCollection } from "../resources/OdienceEventResource"
import { isIpAllowed } from "../utils/utils"

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


  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) : number {
    return 6371*2000*Math.asin(Math.pow(Math.sin((lat1-lat2)*Math.PI/360),2) +
        Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)) *
        Math.pow(Math.sin((lon1-lon2)*Math.PI/360),2)
  }

  hasUserInvite(invites: { recipient: string }[], userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[]}): boolean {
    return invites.some(invite =>
      invite.recipient === userInfo.msisdn ||
    userInfo.emails.includes(invite.recipient)
    )
  }

  async getInvitationAccepted(clientIp: string, event: Event, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]})
  {
    let invitationAccepted = this.hasUserInvite(event.invites, userInfo)
    const boolLocked = event.locationInfo?.location_lock ?? false
    if(!invitationAccepted  && boolLocked)
    {
      console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Doing location check...`)
      console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Lock is on.`)
      if(event.locationInfo.location_ips)
      {
        console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking ips.`)
        invitationAccepted = isIpAllowed(event.locationInfo.location_ips, clientIp)
        console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. ip check ${invitationAccepted ? "passed" : "failed"}`, {clientIp: clientIp, eventIps: event.locationInfo.location_ips})
      }
      if(!invitationAccepted)
      {
        console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking physical location.`)
        const cacheKey =  `{user:${userInfo.msisdn}}:coordinates`
        const cachedData = await this.redisClient.get(cacheKey)
        const eventLatitude = event.locationInfo.location_latitude || 0
        const eventLongitude = event.locationInfo.location_longitude || 0
        const eventAccessRange = event.locationInfo.location_access_range || 100
        if (cachedData) {
          console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. User coordinates found.`)
          const userLocation = cachedData.split(",")
          if (userLocation.length >= 2) {
            const distance = this.calculateDistance(eventLatitude, eventLongitude, parseFloat(userLocation[0]), parseFloat(userLocation[1]))
            console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking physical location. Current distance ${distance}`)
            if(distance <= eventAccessRange)
            {
              invitationAccepted = true
              console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking physical location. Location check passed with distance ${distance}.`)
            }
            else
            {
              console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking physical location. Location check failed with distance ${distance}.`)
            }
          }
        }else
        {
          console.log(`Event: ${event.id} User ${userInfo.msisdn} is not invited to an event. Checking physical location. User coordinates not found. Location check failed.`)
        }
      }else
      {
        console.log(`Event: ${event.id} User ${userInfo.msisdn}. invitationAccepted: ${invitationAccepted} Location lock is ${boolLocked}.`)
      }
    }
    return invitationAccepted
  }

  async getEvents(req: Request, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}): Promise<any> {
    try {
      const startTime = Date.now()
      const dateNow = Math.floor(Date.now() / 1000)
      const searchInitTimestamp = Number(req.query["date"] ?? 0)
      const isWeb = Boolean(parseInt((req.query["web"] as string) ?? "0", 10))
      const searchLocation = req.query["location"] ?? ""
      const searchCategory = req.query["category"] ?? ""
      const clientIp = typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"].split(",")[0].trim() // Get the first IP in case of a list
        : req.connection.remoteAddress || ""
      const dateStr = searchInitTimestamp
        ? new Date(searchInitTimestamp * 1000).toISOString().slice(0, 10) // YYYY-MM-DD
        : null
      const query = this.eventRepository
        .createQueryBuilder("event")
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
      query.andWhere(
        new Brackets((qb) => {
          // Public events always allowed
          qb.where("event.isPublic = true")

          // Non-public events allowed if user has access
          qb.orWhere(
            new Brackets((qb2) => {
              // User is SuperAdmin
              if (userInfo.isSuperAdmin) {
                qb2.where("1=1") // allow all
              } else {
                qb2.where("event.isPublic = false")
                  .andWhere(
                    new Brackets((qb3) => {
                      // user is group member
                      qb3.where("event.groupId IN (:...orgIds)", { orgIds: userInfo.orgIds || [0] })
                      // or user is owner
                        .orWhere("event.ownerId = :userId", { userId: userInfo.userId })
                      // or user is invited
                        .orWhere((qb4: SelectQueryBuilder<Event>) => {
                          const subQuery = qb4.subQuery()
                            .select("1")
                            .from("invite", "i")
                            .where("i.eventId = event.id")
                            .andWhere("i.recipient = :msisdn", { msisdn: userInfo.msisdn })
                            .orWhere("i.recipient IN (:...emails)", { emails: userInfo.emails || [] })
                            .getQuery()
                          return `EXISTS ${subQuery}`
                        })
                    })
                  )
              }
            })
          )
        })
      )
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
      const result =  await query.getMany()
      //   const result = events.filter( (event:Event) => {
      //     if (!event.isPublic) {
      //       if(userInfo.orgIds.includes(event.groupId || 0) || event.ownerId === userInfo.userId || userInfo.isSuperAdmin){
      //         return true
      //       }
      //       const invites = event.invites || []
      //       console.log("invites:", invites)
      //       const found = invites.find((i: Invite) =>
      //         i.recipient === userInfo.msisdn || userInfo.emails.includes(i.recipient)
      //       )
      //       if (!found) return false
      //     }
      //     console.log("allow", event.name)
      //     return true
      //   })
      //*/
      for (const event of result as any[]) {
        event.usersConnected = await this.getUsersConnected(event.id)
        event.invitationAccepted = this.getInvitationAccepted(clientIp, event, userInfo)
        delete event.invites
        for (const e in event) if (null == event[e]) delete event[e]
      }
      console.log(`${Date.now() - startTime} time took to get events list for user ${userInfo.msisdn}`)
      const filteredEvents = OdienceEventCollection(result, isWeb, userInfo)
      console.log(`${Date.now() - startTime} time took to get events list and build schema for user ${userInfo.msisdn}`)
      return { total_events : result.length, per_page: result.length, current_page: 1, events: filteredEvents}
    } catch (error) {
      console.log(error)
      return null
    }
  }
}