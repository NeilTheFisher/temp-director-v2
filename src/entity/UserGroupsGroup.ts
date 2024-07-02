import { Column, Entity, Index } from "typeorm";

@Index("IDX_84ff6a520aee2bf2512c01cf46", ["userId"], {})
@Index("IDX_8abdfe8f9d78a4f5e821dbf620", ["groupId"], {})
@Entity("user_groups_group")
export class UserGroupsGroup {
  @Column("int", { primary: true, name: "userId", unsigned: true })
  userId: number;

  @Column("int", { primary: true, name: "groupId", unsigned: true })
  groupId: number;
}
