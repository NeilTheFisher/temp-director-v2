import { Column, Entity, Index } from "typeorm";

@Index("IDX_fe6cce7d479552c17823e267af", ["groupId"], {})
@Index("IDX_55edea38fece215a3b66443a49", ["userId"], {})
@Entity("group_users_user")
export class GroupUsersUser {
  @Column("int", { primary: true, name: "groupId", unsigned: true })
  groupId: number;

  @Column("int", { primary: true, name: "userId", unsigned: true })
  userId: number;
}
