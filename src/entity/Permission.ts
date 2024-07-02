import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ModelHasPermission } from "./ModelHasPermission";
import { RoleHasPermission } from "./RoleHasPermission";

@Index("permission_name_index", ["name"], {})
@Entity("permission")
export class Permission {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "guard_name", length: 191 })
  guardName: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(
    () => ModelHasPermission,
    (modelHasPermission) => modelHasPermission.permission
  )
  modelHasPermissions: ModelHasPermission[];

  @OneToMany(
    () => RoleHasPermission,
    (roleHasPermission) => roleHasPermission.permission
  )
  roleHasPermissions: RoleHasPermission[];
}
