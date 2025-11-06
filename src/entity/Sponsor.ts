import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"
import { Ad } from "./Ad"
import { Group } from "./Group"
import { GroupSponsor } from "./GroupSponsor"
import { EventSponsor } from "./EventSponsor"

@Entity("sponsor")
export class Sponsor {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("varchar", { name: "name", length: 191 })
  name: string

  @Column("varchar", { name: "type", length: 191 })
  type: string

  @Column("varchar", { name: "status", length: 191 })
  status: string

  @Column("text", { name: "image_url", nullable: true })
  imageUrl: string | null

  @Column("longtext", { name: "settings", nullable: true })
  settings: string | null

  @Column("tinyint", { name: "assign_to_all", nullable: true, width: 1, default: 0 })
  assignToAll: boolean | null

  @Column("int", { name: "created_at", default: () => "UNIX_TIMESTAMP()" })
  createdAt: number

  @Column("int", { name: "updated_at", default: () => "UNIX_TIMESTAMP()" })
  updatedAt: number

  @OneToMany(() => Ad, (ad) => ad.sponsor)
  ads: Ad[]

  @OneToMany(() => GroupSponsor, (groupSponsor) => groupSponsor.sponsor)
  groupSponsors: GroupSponsor[]

  @OneToMany(() => EventSponsor, (eventSponsor) => eventSponsor.sponsor)
  eventSponsors: EventSponsor[]

  @ManyToMany(() => Group, (group) => group.sponsors)
  @JoinTable({
    name: "sponsor_group", // your pivot table name
    joinColumn: { name: "sponsor_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "group_id", referencedColumnName: "id" },
  })
  groups: Group[]
}
