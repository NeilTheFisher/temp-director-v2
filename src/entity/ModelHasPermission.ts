import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Permission } from "./Permission";

@Index(
  "model_has_permission_model_id_model_type_index",
  ["modelId", "modelType"],
  {}
)
@Entity("model_has_permission")
export class ModelHasPermission {
  @Column("bigint", { primary: true, name: "permission_id", unsigned: true })
  permissionId: number;

  @Column("varchar", { primary: true, name: "model_type", length: 191 })
  modelType: string;

  @Column("bigint", { primary: true, name: "model_id", unsigned: true })
  modelId: number;

  @ManyToOne(() => Permission, (permission) => permission.modelHasPermissions, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "permission_id", referencedColumnName: "id" }])
  permission: Permission;
}
