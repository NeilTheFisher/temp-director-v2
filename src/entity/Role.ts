import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Group } from "./Group"
import { User } from "./User"

@Entity("roles")
export class Role {
	@PrimaryGeneratedColumn({ type: "int", unsigned: true })
		id: number

	@Column({ type: "varchar", length: 191, unique: true })
		name: string

	@ManyToMany(() => User, (user) => user.roles)
		users: User[]

	@ManyToMany(() => Group, (group) => group.roles)
		groups: Group[]

	public static ROLE_ADMIN = "admin"
	public static ROLE_SUPER_ADMIN = "super-admin"
}
