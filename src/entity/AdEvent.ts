import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, Column } from "typeorm"
import { Ad } from "./Ad"
import { Event } from "./Event"

@Index("ad_event_ad_id_foreign", ["adId"], {})
@Index("ad_event_event_id_foreign", ["eventId"], {})
@Entity("ad_event")
export class AdEvent {
  @PrimaryColumn("bigint", { name: "ad_id", unsigned: true })
  adId: number

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number

  @Column("int", { name: "order", nullable: true })
  order: number|null

  @ManyToOne(() => Ad, (ad) => ad.adEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "ad_id", referencedColumnName: "id" }])
  ad: Ad

  @ManyToOne(() => Event, (event) => event.eventAds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event
}
