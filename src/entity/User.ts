import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Group } from "./Group"
import { Role } from "./Role"
import { UsersBlocked } from "./UsersBlocked"
import { UsersReported } from "./UsersReported"

@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", unsigned: true })
  id: number

  @Column({ type: "varchar", length: 191, unique: true, nullable: true })
  name: string | null

  @Column({ type: "varchar", length: 191, unique: true, nullable: true })
  email: string | null

  @Column({ type: "timestamp", nullable: true })
  email_verified_at: Date | null

  @Column({ type: "varchar", length: 191 })
  password: string

  @Column({ type: "varchar", length: 100 })
  remember_token: string

  @Column({ type: "timestamp", nullable: true })
  created_at: Date | null

  @Column({ type: "timestamp", nullable: true })
  updated_at: Date | null

  @Column({ type: "int", width: 11, nullable: true })
  created_by: number | null

  @Column({ type: "varchar", length: 191, unique: true })
  msisdn: string

  @Column({ type: "varchar", length: 191, nullable: true })
  otp: string | null

  @Column({ type: "timestamp", nullable: true })
  otp_created_at: Date | null

  @Column({ type: "int", width: 20, unsigned: true, nullable: true })
  personal_group_id: number | null

  @Column({ type: "char", length: 36, nullable: true })
  image_uid: string | null

  @Column({ type: "int", width: 11, nullable: true })
  verif_code: number | null

  @Column({ type: "timestamp", nullable: true })
  verif_expir: Date | null

  @Column({ type: "varchar", length: 191, default: "user" })
  type: string

  @Column({ type: "varchar", length: 191, nullable: true })
  timezone: string | null

  @Column({ type: "varchar", length: 191, nullable: true })
  avatar_url: string | null

  @Column({ type: "int", width: 11, default: 1 })
  account_type: number

  @Column({ type: "tinyint", width: 1, default: 0 })
  is_deleted: number

  @Column({ type: "int", width: 11, nullable: true })
  deleted_timestamp: number | null

  // Define Many-to-Many relationship with Group
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

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: "roles_user_group",
    joinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "role_id", referencedColumnName: "id" }],
  })
  roles: Role[]
}
