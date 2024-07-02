import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm"
import { User } from "./User"

@Entity("roles_user_group")
export class UserGroupRoles {
  @PrimaryColumn({ name: "user_id", type: "int", width: 20, unsigned: true })
  userId: number

  @Column({ name: "group_id", type: "int", width: 20, unsigned: true, nullable: true })
  groupId: number | null

  @PrimaryColumn({ name: "role_id", type: "int", width: 20, unsigned: true })
  roleId: number

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
