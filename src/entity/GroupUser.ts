import { Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Group } from './Group'
import { User } from './User'

@Entity('group_user')
export class GroupUser {
	@PrimaryColumn()
		user_id: number

	@PrimaryColumn()
		group_id: number

	@ManyToOne(() => User, (user: User) => user.groups)
		user: User

	@ManyToOne(() => Group, (group: Group) => group.users)
		group: Group
}
