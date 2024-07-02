import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GroupStream } from "./GroupStream";
import { EventGroup } from "./EventGroup";
import { MediaContent } from "./MediaContent";
import { AddressListGroup } from "./AddressListGroup";
import { DeviceGroup } from "./DeviceGroup";
import { Controller } from "./Controller";
import { ProPublisher } from "./ProPublisher";
import { GroupTemplate } from "./GroupTemplate";
import { Role } from "./Role";
import { User as User2, type User } from "./User";

@Entity("group")
export class Group {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("int", { name: "created_at", default: () => "UNIX_TIMESTAMP()" })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => "UNIX_TIMESTAMP()" })
  updatedAt: number;

  @Column("tinyint", { name: "is_public", nullable: true, width: 1, default: 0 })
  isPublic: boolean | null;

  @Column("bigint", { name: "owner_id", nullable: true, unsigned: true })
  ownerId: number | null;

  @Column("char", { name: "image_uid", nullable: true, length: 36 })
  imageUid: string | null;

  @Column("varchar", { name: "image_url", nullable: true, length: 191 })
  imageUrl: string | null;

  @OneToMany(() => GroupStream, (groupStream) => groupStream.group)
  groupStreams: GroupStream[];

  @OneToMany(() => EventGroup, (eventGroup) => eventGroup.group)
  eventGroups: EventGroup[];

  @OneToMany(() => MediaContent, (mediaContent) => mediaContent.group)
  mediaContents: MediaContent[];

  @OneToMany(
    () => AddressListGroup,
    (addressListGroup) => addressListGroup.group
  )
  addressListGroups: AddressListGroup[];

  @OneToMany(() => DeviceGroup, (deviceGroup) => deviceGroup.group)
  deviceGroups: DeviceGroup[];

  @OneToMany(() => Controller, (controller) => controller.group)
  controllers: Controller[];

  @OneToMany(() => ProPublisher, (proPublisher) => proPublisher.group)
  proPublishers: ProPublisher[];

  @OneToMany(() => GroupTemplate, (groupTemplate) => groupTemplate.group)
  groupTemplates: GroupTemplate[];

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
