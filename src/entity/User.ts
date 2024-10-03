import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EventUser } from "./EventUser";
import { ModelLogs } from "./ModelLogs";
import { SessionLogs } from "./SessionLogs";
import { StreamUrlToken } from "./StreamUrlToken";
import { EventRequests } from "./EventRequests";
import { Group } from "./Group";
import { Role } from "./Role";
import { UsersBlocked } from "./UsersBlocked";
import { UsersReported } from "./UsersReported";
import { EmailUser } from "./EmailUser";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @Column("varchar", { name: "email", nullable: true, length: 191 })
  email: string | null;

  @Column("timestamp", { name: "email_verified_at", nullable: true })
  emailVerifiedAt: Date | null;

  @Column("varchar", { name: "password", length: 191 })
  password: string;

  @Column("varchar", { name: "remember_token", nullable: true, length: 100 })
  rememberToken: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("int", { name: "created_by", nullable: true })
  createdBy: number | null;

  @Column("varchar", { name: "msisdn", nullable: true, length: 191, unique: true})
  msisdn: string;

  @Column("varchar", { name: "otp", nullable: true, length: 191 })
  otp: string | null;

  @Column("timestamp", { name: "otp_created_at", nullable: true })
  otpCreatedAt: Date | null;

  @Column("bigint", {
    name: "personal_group_id",
    nullable: true,
    unsigned: true,
  })
  personalGroupId: number | null;

  @Column("char", { name: "image_uid", nullable: true, length: 36 })
  imageUid: string | null;

  @Column("int", { name: "verif_code", nullable: true })
  verifCode: number | null;

  @Column("timestamp", { name: "verif_expir", nullable: true })
  verifExpir: Date | null;

  @Column("varchar", { name: "type", length: 191, default: () => "user" })
  type: string;

  @Column("varchar", { name: "timezone", nullable: true, length: 191 })
  timezone: string | null;

  @Column("varchar", { name: "avatar_url", nullable: true, length: 191 })
  avatarUrl: string | null;

  @Column("int", { name: "account_type", default: () => "'1'" })
  accountType: number;

  @Column("tinyint", { name: "is_deleted", width: 1, default: () => 0 })
  isDeleted: boolean;

  @Column("int", { name: "deleted_timestamp", nullable: true })
  deletedTimestamp: number | null;

  @OneToMany(() => EventUser, (eventUser) => eventUser.user)
  eventUsers: EventUser[];

  @OneToMany(() => ModelLogs, (modelLogs) => modelLogs.user)
  modelLogs: ModelLogs[];

  @OneToMany(() => SessionLogs, (sessionLogs) => sessionLogs.user)
  sessionLogs: SessionLogs[];

  @OneToMany(() => StreamUrlToken, (streamUrlToken) => streamUrlToken.user)
  streamUrlTokens: StreamUrlToken[];

  @OneToMany(() => EventRequests, (eventRequests) => eventRequests.user)
  eventRequests: EventRequests[];

  @ManyToMany(() => Group, (group: Group) => group.users)
  @JoinTable()
  groups: Group[]

  @OneToMany(() => Group, (group: Group) => group.owner)
  ownedGroups: Group[]

  @ManyToOne(() => Group, (group: Group) => group.id) // Define the many-to-one relationship
  @JoinColumn({ name: "personal_group_id" }) // Define the foreign key
  personalGroup: Group | null

  @OneToMany(() => UsersReported, (usersReported) => usersReported.user)
  usersReported: UsersReported[]

  @OneToMany(() => UsersBlocked, (usersBlocked) => usersBlocked.user)
  usersBlocked: UsersBlocked[]

  @OneToMany(() => UsersBlocked, (usersBlocked) => usersBlocked.blockedByUser)
  usersBlockedBy: UsersBlocked[]

  @OneToMany(() => EmailUser, (email) => email.user)
  emails: EmailUser[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "roles_user_group",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
  })
  roles: Role[]
}
