import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Permission } from "./Permission";

@Index("role_has_permission_role_id_foreign", ["roleId"], {})
@Index("role_has_permission_permission_id_index", ["permissionId"], {})
@Entity("role_has_permission", { schema: "db_spotlight" })
export class RoleHasPermission {
  @Column("bigint", { primary: true, name: "permission_id", unsigned: true })
  permissionId: number;

  @Column("bigint", { primary: true, name: "role_id", unsigned: true })
  roleId: number;

  @ManyToOne(() => Permission, (permission) => permission.roleHasPermissions, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "permission_id", referencedColumnName: "id" }])
  permission: Permission;
}
