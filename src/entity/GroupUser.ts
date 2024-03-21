import { Entity, PrimaryColumn } from "typeorm"

@Entity("group_user")
export class GroupUser {
	@PrimaryColumn()
		user_id: number

	@PrimaryColumn()
		group_id: number
}
