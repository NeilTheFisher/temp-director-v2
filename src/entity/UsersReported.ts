import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity("users_reported_by_users")
export class UsersReported {
	@PrimaryGeneratedColumn({ type: "int", unsigned: true })
		id: number

	@Column({ type: "int", width: 20, unsigned: true })
		user_id: number

	@Column({ type: "varchar", length: 191, unique: true })
		reported: string

	@Column({ type: "timestamp", nullable: true })
		date: Date | null

	@ManyToOne(() => User, (user: User) => user.usersReported)
	@JoinColumn({ name: "user_id", referencedColumnName: "id" }) // Define the foreign key
		user: User
}
