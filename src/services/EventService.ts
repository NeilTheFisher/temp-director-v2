import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Brackets, SelectQueryBuilder } from "typeorm"
import { Event } from "../entity/Event"
import { Setting } from "../entity/Setting"
import { Request } from "express"
import RedisService from "./RedisService"
import { OdienceEventCollection } from "../resources/OdienceEventResource"
import { OdienceSimpleEventCollection } from "../resources/OdienceSimpleEventResource"
import { WebEventCollection } from "../resources/WebEventResource"
import { isIpAllowed } from "../utils/utils"

export class EventService {
  private eventRepository: Repository<Event>
  private redisService = RedisService.getInstance()
  private redisClient = this.redisService.getClient()
  private dataSource = AppDataSource
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
    const recipients = new Set(invites.map(i => i.recipient))
    if (recipients.has(userInfo.msisdn)) return true
    return userInfo.emails.some(email => recipients.has(email))
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

  async getEvents(req: Request, userInfo: {userId: number, msisdn: string, isSuperAdmin: boolean, emails: string[], orgIds: number[]}, boolPartial = false, boolWebApi = false): Promise<any> {
    try {
      console.log(userInfo)
      const startTime = Date.now()
      const dateNow = Math.floor(Date.now() / 1000)
      const searchInitTimestamp = Number(req.query["date"] ?? 0)
      const isWeb = Boolean(parseInt((req.query["web"] as string) ?? "0", 10))
      const searchLocation = req.query["location"] ?? ""
      const searchCategory = req.query["category"] ?? ""
      const searchEventId = req.query["id"]
      const clientIp = typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"].split(",")[0].trim() // Get the first IP in case of a list
        : req.connection.remoteAddress || ""
      const dateStr = searchInitTimestamp
        ? new Date(searchInitTimestamp * 1000).toISOString().slice(0, 10) // YYYY-MM-DD
        : null
      const mainQuery = this.eventRepository
        .createQueryBuilder("event")
        .where("event.isDraft = :isDraft", { isDraft: false })
        .andWhere("event.active = :active", { active: true })

      if (searchCategory) {
        mainQuery.andWhere("event.category = :category", { category: searchCategory })
      }

      if (searchLocation) {
        mainQuery.andWhere("event.location LIKE :location", { location: `%${searchLocation}%` })
      }

      if(searchEventId)
      {
        mainQuery.andWhere("event.id = :id", { id: searchEventId })
      }

      mainQuery.andWhere(new Brackets(qb => {
        qb.where(new Brackets(subQ => {
          subQ.where("(event.date + event.duration) >= :dateNow", { dateNow })
            .orWhere("event.duration IS NULL")

          if (dateStr) {
            subQ.andWhere("DATE(FROM_UNIXTIME(event.dateStr)) = :dateStr", { dateStr })
          }
        }))
      }))

      mainQuery.andWhere(new Brackets(qb => {
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

      if(boolWebApi)
      {
        mainQuery.andWhere("event.isPublic = :isPublic", { isPublic: true })
      }
      else
      {
        mainQuery.andWhere(
          new Brackets((qb) => {
          // If SuperAdmin, can see all events (no restrictions)
            if (userInfo.isSuperAdmin) {
              console.log("SUPER ADMIN")
              qb.where("1=1") // always true
              return
            }

            // Non-superadmin logic
            qb.where("event.isPublic = true") // Public events

            qb.orWhere(
              new Brackets((qb2) => {
                qb2.where("event.isPublic = false").andWhere(
                  new Brackets((qb3) => {
                  // User is owner
                    qb3.where("event.ownerId = :userId", { userId: userInfo.userId })

                    // User is in orgs
                    if (userInfo.orgIds && userInfo.orgIds.length > 0) {
                      qb3.orWhere("event.groupId IN (:...orgIds)", { orgIds: userInfo.orgIds })
                    }

                    // User is invited
                    const recipients = [userInfo.msisdn]
                    if (userInfo.emails && userInfo.emails.length > 0) {
                      recipients.push(...userInfo.emails)
                    }

                    qb3.orWhere(
                      `EXISTS (
                SELECT 1 FROM invite i
                WHERE i.event_id = event.id
                AND i.recipient IN (:...recipients)
              )`,
                      { recipients }
                    )
                  })
                )
              })
            )
          })
        )
      }
      // ONLY join group and owner in main query (smallest relations)
      mainQuery
        .leftJoinAndSelect("event.group", "group")
        .leftJoinAndSelect("event.owner", "owner")
        .orderBy("event.date", "ASC")

      const startMain = Date.now()
      const events =  await mainQuery.getMany()
      console.log(`Main query: ${Date.now() - startMain}ms, Events: ${events.length}`)
      if (events.length === 0) {
        if(boolWebApi)
        {
          return {data: []}
        }
        else
        {
          return { total_events : 0, per_page: 0, current_page: 0, events: []}
        }

      }
      const eventIds = events.map(e => e.id)
      // STEP 2: Load all other data in parallel
      const startParallel = Date.now()

      const [
        invites,
        streams,
        streamUrls,
        simulations,
        ads,
        settings,
        userRemovedData,
        userOpenedData,
        userRequestsData,
        userRegisteredData,
        userInterestedData,
        userBlockedData
      ] = await Promise.all([
        // Invites
        this.dataSource
          .createQueryBuilder()
          .select(["invite.event_id as eventId", "invite.recipient as recipient"])
          .from("invite", "invite")
          .where("invite.event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        // Streams (with recordedType for getLabel)
        this.dataSource
          .createQueryBuilder()
          .select(["s.id", "es.event_id as eventId", "s.recorded_type as recordedType", "s.code"])
          .from("event_stream", "es")
          .innerJoin("stream", "s", "s.id = es.stream_id")
          .where("es.event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        // Stream URLs
        this.dataSource
          .createQueryBuilder()
          .select(["su.download_url as downloadUrl", "es.event_id as eventId"])
          .from("stream_url", "su")
          .innerJoin("stream", "s", "s.id = su.stream_id")
          .innerJoin("event_stream", "es", "es.stream_id = s.id")
          .where("es.event_id IN (:...eventIds)", { eventIds })
          .andWhere("su.download_url IS NOT NULL")
          .getRawMany(),

        // Simulations
        this.dataSource
          .createQueryBuilder()
          .select(["simulation_id as simulationId", "event_id as eventId"])
          .from("event_simulation", "event_simulation")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        // Ads with sponsors
        this.dataSource
          .createQueryBuilder()
          .select([
            "a.id AS id",
            "a.location AS location",
            "a.name AS name",
            "a.url AS url",
            "a.media_url AS mediaUrl",
            "a.sponsor_id AS sponsorId",
            "s.name AS sponsorName",
            "ae.event_id AS eventId",
            "ae.`order` AS `order`", // ✅ Escape 'order' properly
          ])
          .from("ad_event", "ae")
          .innerJoin("ad", "a", "a.id = ae.ad_id")
          .leftJoin("sponsor", "s", "s.id = a.sponsor_id")
          .where("ae.event_id IN (:...eventIds)", { eventIds })
          .orderBy("ae.event_id", "ASC")
          .addOrderBy("ae.`order`", "ASC")
          .getRawMany(),

        // Settings
        this.dataSource
          .createQueryBuilder()
          .select([
            "setting.id AS id",
            "`setting`.`key` AS `key`",
            "setting.value AS value",
            "setting.configurable_id AS configurableId",
          ])
          .from("setting", "setting")
          .where("`setting`.`key` = :key", { key: Setting.EVENT_SETTINGS })
          .andWhere("`setting`.`configurable_type` = :type", { type: "App\\Models\\Event" })
          .andWhere("`setting`.`configurable_id` IN (:...eventIds)", { eventIds })
          .getRawMany(),

        // User relations - one query each
        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "msisdn"])
          .from("event_removed", "event_removed")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "msisdn"])
          .from("event_opened", "event_opened")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "msisdn"])
          .from("event_requests", "event_requests")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "msisdn"])
          .from("event_registered", "event_registered")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany(),

        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "COUNT(*) as count"])
          .from("event_interested", "event_interested")
          .where("event_id IN (:...eventIds)", { eventIds })
          .groupBy("event_id")
          .getRawMany(),

        this.dataSource
          .createQueryBuilder()
          .select(["event_id as eventId", "msisdn"])
          .from("event_blocked", "event_blocked")
          .where("event_id IN (:...eventIds)", { eventIds })
          .getRawMany()
      ])
      console.log(`Parallel queries: ${Date.now() - startParallel}ms`)

      // STEP 3: Map data back to events
      const startMapping = Date.now()

      // Create lookup maps
      const invitesMap = new Map<number, any[]>()
      invites.forEach((i) => {
        if (!i.eventId) return
        if (!invitesMap.has(i.eventId)) {
          invitesMap.set(i.eventId, [])
        }
        invitesMap.get(i.eventId)!.push({ recipient: i.recipient })
      })

      const streamsMap = new Map<number, any[]>()
      streams.forEach(s => {
        if (!streamsMap.has(s.eventId)) streamsMap.set(s.eventId, [])
            streamsMap.get(s.eventId)!.push({
              id: s.id,
              recordedType: s.recordedType,
              code: s.code
            })
      })

      const streamUrlsMap = new Map<number, Set<string>>()
      streamUrls.forEach(su => {
        if (!streamUrlsMap.has(su.eventId)) streamUrlsMap.set(su.eventId, new Set())
        if (su.downloadUrl) streamUrlsMap.get(su.eventId)!.add(su.downloadUrl)
      })

      const simulationsMap = new Map<number, any[]>()
      simulations.forEach(sim => {
        if (!simulationsMap.has(sim.eventId)) simulationsMap.set(sim.eventId, [])
            simulationsMap.get(sim.eventId)!.push({ simulation_id: sim.simulationId })
      })

      const adsMap = new Map<number, any[]>()
      console.log("ads", ads)
      ads.forEach(ad => {
        if (!adsMap.has(ad.eventId)) adsMap.set(ad.eventId, [])
            adsMap.get(ad.eventId)!.push({
              id: ad.id,
              location: ad.location,
              name: ad.name,
              url: ad.url,
              media_url: ad.mediaUrl,
              order: ad.order,  // Include order
              sponsor: ad.sponsorId ? { id: ad.sponsorId, name: ad.sponsorName } : null
            })
      })
      // The ads are already sorted by the ORDER BY clause in the query

      const settingsMap = new Map(settings.map(s => [s.configurableId, [{
        id: s.id,
        key: s.key,
        value: s.value
      }]]))

      // User data maps
      const createUserMap = (data: any[]) => {
        const map = new Map<number, any[]>()
        data.forEach(item => {
          if (!map.has(item.eventId)) map.set(item.eventId, [])
            map.get(item.eventId)!.push({ msisdn: item.msisdn })
        })
        return map
      }

      const removedMap = createUserMap(userRemovedData)
      const openedMap = createUserMap(userOpenedData)
      const requestsMap = createUserMap(userRequestsData)
      const registeredMap = createUserMap(userRegisteredData)
      const blockedMap = createUserMap(userBlockedData)

      const interestedMap = new Map(
        userInterestedData.map(d => [d.eventId, Array(parseInt(d.count)).fill({ id: 0 })])
      )

      // Apply to events
      events.forEach(event => {
        event.invites = invitesMap.get(event.id) || []
        event.streams = streamsMap.get(event.id) || []
        event.eventSimulations = simulationsMap.get(event.id) || []
        event.settings = settingsMap.get(event.id) || []
        event.usersOpened = openedMap.get(event.id) || []
        event.eventRequests = requestsMap.get(event.id) || []
        event.usersRegistered = registeredMap.get(event.id) || []

        if(!boolPartial)
        {
        // only for full list
          event.usersBlocked = blockedMap.get(event.id) || []
          event.usersInterested = interestedMap.get(event.id) || []
          event.ads = adsMap.get(event.id) || []
          event.downloadUrls = streamUrlsMap.get(event.id) ? Array.from(streamUrlsMap.get(event.id)!) : []
          event.usersRemoved = removedMap.get(event.id) || []
        }

      })

      console.log(`Mapping: ${Date.now() - startMapping}ms`)

      const result = events

      const usersConnectedPromises: Promise<number>[] = []
      const invitationAcceptedPromises: Promise<boolean>[] = []
      for (const event of result) {
        usersConnectedPromises.push(this.getUsersConnected(event.id))
        invitationAcceptedPromises.push(this.getInvitationAccepted(clientIp, event, userInfo))
      }
      const [usersConnectedResults, invitationAcceptedResults] = await Promise.all([
        Promise.all(usersConnectedPromises),
        Promise.all(invitationAcceptedPromises)
      ])

      for (const [i, event] of result.entries()) {
        const e = event as any
        e.usersConnected = usersConnectedResults[i]
        e.invitationAccepted = invitationAcceptedResults[i]

        delete e.invites

        // Clean up null values (more efficient)
        Object.keys(e).forEach(key => {
          if (e[key] === null) delete e[key]
        })
      }
      console.log(`${Date.now() - startTime}ms time took to get events list for user ${userInfo.msisdn}`)
      const filteredEvents = boolPartial
        ? OdienceSimpleEventCollection(result, isWeb, userInfo)
        :  (boolWebApi ? WebEventCollection(result, userInfo) : OdienceEventCollection(result, isWeb, userInfo))
      console.log(`${Date.now() - startTime}ms time took to get events list and build schema for user ${userInfo.msisdn}`)
      if(boolWebApi)
      {
        return {data: filteredEvents}
      }else
      {
        return { total_events : result.length, per_page: result.length, current_page: 1, events: filteredEvents}
      }

    } catch (error) {
      console.log(error)
      if(boolWebApi)
      {
        return {data: [], error: error}
      }
      else
      {
        return { total_events : 0, per_page: 0, current_page: 1, events: [], error: error}
      }
    }
  }
}