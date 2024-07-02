import { PrimaryColumn, Entity } from "typeorm";

@Entity("group_user")
export class GroupUser {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "user_id", unsigned: true })
  userId: number;
}
