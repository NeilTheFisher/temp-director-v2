import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm"
import { User } from "./User"

@Entity("roles_user_group")
export class UserGroupRoles {
  @PrimaryColumn({ type: "int", width: 20, unsigned: true })
  user_id: number

  @Column({ type: "int", width: 20, unsigned: true, nullable: true })
  group_id: number | null

  @PrimaryColumn({ type: "int", width: 20, unsigned: true })
  role_id: number

  @ManyToMany(() => User, (user) => user.roles)
  users: User[]
}
