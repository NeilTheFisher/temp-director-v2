import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Stream } from "./Stream"
import { MediaContent } from "./MediaContent"
import { AddressList } from "./AddressList"
import { Device } from "./Device"
import { GroupSponsor } from "./GroupSponsor"
import { Controller } from "./Controller"
import { ProPublisher } from "./ProPublisher"
import { GroupTemplate } from "./GroupTemplate"
import { Role } from "./Role"
import { Event } from "./Event"
import { Sponsor } from "./Sponsor"
import { User as User2, type User } from "./User"

@Entity("group")
export class Group {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("varchar", { name: "name", length: 191 })
  name: string

  @Column("int", { name: "created_at", default: () => "UNIX_TIMESTAMP()" })
  createdAt: number

  @Column("int", { name: "updated_at", default: () => "UNIX_TIMESTAMP()" })
  updatedAt: number

  @Column("tinyint", { name: "is_public", nullable: true, width: 1, default: 0 })
  isPublic: boolean | null

  @Column("bigint", { name: "owner_id", nullable: true, unsigned: true })
  ownerId: number | null

  @Column("char", { name: "image_uid", nullable: true, length: 36 })
  imageUid: string | null

  @Column("varchar", { name: "image_url", nullable: true, length: 191 })
  imageUrl: string | null

  @OneToMany(() => Stream, (stream) => stream.group)
  streams: Stream[]

  @OneToMany(() => Event, (groupEvent) => groupEvent.group)
  events: Event[]

  @OneToMany(() => MediaContent, (mediaContent) => mediaContent.group)
  mediaContents: MediaContent[]

  @OneToMany(() => AddressList, (groupList) => groupList.group)
  addressLists: AddressList[]

  @OneToMany(() => Device, (device) => device.group)
  devices: Device[]

  @OneToMany(() => GroupSponsor, (groupSponsor) => groupSponsor.group)
  groupSponsors: GroupSponsor[]

  @ManyToMany(() => Sponsor, (sponsor) => sponsor.groups)
  @JoinTable({
    name: "sponsor_group", // your pivot table name
    joinColumn: { name: "group_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "sponsor_id", referencedColumnName: "id" },
  })
  sponsors: Sponsor[]

  @OneToMany(() => Controller, (controller) => controller.group)
  controllers: Controller[]

  @OneToMany(() => ProPublisher, (proPublisher) => proPublisher.group)
  proPublishers: ProPublisher[]

  @OneToMany(() => GroupTemplate, (groupTemplate) => groupTemplate.group)
  groupTemplates: GroupTemplate[]

  @ManyToMany(() => User2, (user: User) => user.groups)
  @JoinTable()
  users: User[]

  @ManyToOne(() => User2, (user: User) => user.ownedGroups)
  @JoinColumn({ name: "owner_id", referencedColumnName: "id" }) // Define the foreign key
  owner: User

  @ManyToMany(() => Role, (role) => role.groups)
  @JoinTable({
    name: "roles_user_group",
    joinColumns: [{ name: "group_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
  })
  roles: Role[]
}
