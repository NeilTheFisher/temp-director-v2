import { Column, Entity, JoinColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, PrimaryGeneratedColumn} from "typeorm"
import { AdEvent } from "./AdEvent"
import { Sponsor } from "./Sponsor"
import { Event } from "./Event"

@Entity("ad")
export class Ad {
    public static CUSTOM_AD_LOCATION_INVITATION = "event_invitation"
    public static CUSTOM_AD_LOCATION_EVENT_DETAILS = "event_details"
    public static CUSTOM_AD_LOCATION_BRAND_PANEL = "event_brand_panel"
    public static CUSTOM_AD_LOCATION_IN_STREAM = "event_in_stream"

  static readonly CUSTOM_AD_LOCATION_LIST: Record<string, string> = {
    [Ad.CUSTOM_AD_LOCATION_INVITATION]: "Invitation",
    [Ad.CUSTOM_AD_LOCATION_EVENT_DETAILS]: "Event Details",
    [Ad.CUSTOM_AD_LOCATION_BRAND_PANEL]: "Brand Panel",
    [Ad.CUSTOM_AD_LOCATION_IN_STREAM]: "In Stream",
  }

  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("varchar", { name: "location", length: 191 })
  location: string

  @Column("varchar", { name: "name", length: 191 })
  name: string

  @Column("varchar", { name: "url", length: 191, nullable: true })
  url: string | null

  @Column("varchar", { name: "media_url", length: 191, nullable: true })
  mediaUrl: string | null

  @Column("bigint", { name: "sponsor_id", nullable: true, unsigned: true })
  sponsorId: number | null

  @Column("int", { name: "created_at", default: () => "UNIX_TIMESTAMP()" })
  createdAt: number

  @Column("int", { name: "updated_at", default: () => "UNIX_TIMESTAMP()" })
  updatedAt: number

  @OneToMany(() => AdEvent, (adEvent) => adEvent.event)
  adEvents: AdEvent[]

  @ManyToMany(() => Event, (event) => event.ads)
  @JoinTable({
    name: "ad_event", // your pivot table name
    joinColumn: { name: "ad_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "event_id", referencedColumnName: "id" },
  })
    events: Event[]

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.ads, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "sponsor_id", referencedColumnName: "id" }])
  sponsor: Sponsor
}
