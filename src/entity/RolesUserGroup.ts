import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("roles_user_group")
export class RolesUserGroup {
  @PrimaryColumn("bigint", { name: "role_id", unsigned: true })
  roleId: number;

  @PrimaryColumn("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("bigint", { name: "group_id", nullable: true, unsigned: true })
  groupId: number | null;
}
