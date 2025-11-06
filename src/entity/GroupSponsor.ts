import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Sponsor } from "./Sponsor"
import { Group } from "./Group"

@Index("sponsor_group_sponsor_id_foreign", ["sponsorId"], {})
@Index("sponsor_group_group_id_foreign", ["groupId"], {})
@Entity("device_event")
export class GroupSponsor {
  @PrimaryColumn("bigint", { name: "sponsor_id", unsigned: true })
  sponsorId: number

  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number

  @ManyToOne(() => Sponsor, (sponsor) => sponsor.groupSponsors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "sponsor_id", referencedColumnName: "id" }])
  sponsor: Sponsor

  @ManyToOne(() => Group, (group) => group.groupSponsors, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group
}
