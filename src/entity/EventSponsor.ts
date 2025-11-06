import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Sponsor } from "./Sponsor"
import { Event } from "./Event"

@Index("sponsor_event_sponsor_id_foreign", ["sponsorId"], {})
@Index("sponsor_event_event_id_foreign", ["eventId"], {})
@Entity("sponsor_event")
export class EventSponsor {
  @PrimaryColumn("bigint", { name: "sponsor_id", unsigned: true })
  sponsorId: number

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.eventSponsors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "sponsor_id", referencedColumnName: "id" }])
  sponsor: Sponsor

  @ManyToOne(() => Event, (event) => event.deviceEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event
}
