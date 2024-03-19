import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm'
import { Group } from './Group'
import { User } from './User'

@Entity('roles')
export class Role {
	@PrimaryColumn({ type: 'int', width: 20, unsigned: true })
		id: number

	@Column({ type: 'varchar', length: 191, unique: true })
		name: string

	@ManyToMany(() => User, (user) => user.roles)
		users: User[]

	@ManyToMany(() => Group, (group) => group.roles)
		groups: Group[]
}
