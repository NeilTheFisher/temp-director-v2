import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import { Role } from './Role'
import { User } from './User'

@Entity('group')
export class Group {
	@PrimaryColumn({ type: 'int', width: 20, unsigned: true })
		id: number

	@Column({ type: 'varchar', length: 191, unique: true })
		name: string

	@Column({ type: 'int', width: 11, default: () => 'UNIX_TIMESTAMP()' })
		created_at: number

	@Column({ type: 'int', width: 11, default: () => 'UNIX_TIMESTAMP()' })
		updated_at: number

	@Column({ type: 'tinyint', width: 1, default: 0 })
		is_public: number

	@Column({ type: 'int', width: 20, unsigned: true, nullable: true })
		owner_id: number | null

	@Column({ type: 'varchar', length: 191, nullable: true })
		image_url: string | null

	@Column({ type: 'char', length: 36, nullable: true })
		image_uid: string | null

	// Define Many-to-Many relationship with User
	@ManyToMany(() => User, (user: User) => user.groups)
	@JoinTable()
		users: User[]

	@ManyToOne(() => User, (user: User) => user.ownedGroups)
	@JoinColumn({ name: 'owner_id', referencedColumnName: 'id' }) // Define the foreign key
		owner: User

	@ManyToMany(() => Role, (role) => role.groups)
	@JoinTable({
		name: 'roles_user_group',
		joinColumns: [{ name: 'group_id', referencedColumnName: 'id' }],
		inverseJoinColumns: [{ name: 'role_id', referencedColumnName: 'id' }],
	})
		roles: Role[]
}
