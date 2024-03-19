import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { User } from './User'

@Entity('users_blocked_by_users')
export class UsersBlocked {
	@PrimaryColumn({ type: 'int', width: 20, unsigned: true })
		id: number

	@Column({ type: 'int', width: 20, unsigned: true })
		user_id: number

	@Column({ type: 'varchar', length: 191, unique: true })
		blocked: string

	@Column({ type: 'timestamp', nullable: true })
		date: Date | null

	@ManyToOne(() => User, (user: User) => user.usersBlocked)
	@JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Define the foreign key
		user: User

	@ManyToOne(() => User, (user: User) => user.usersBlockedBy)
	@JoinColumn({ name: 'blocked', referencedColumnName: 'msisdn' }) // Define the foreign key
		blockedByUser: User
}
