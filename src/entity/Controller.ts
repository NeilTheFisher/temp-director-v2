import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Action } from "./Action";
import { Group } from "./Group";

@Index("controller_group_id_foreign", ["groupId"], {})
@Entity("controller")
export class Controller {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("tinyint", { name: "paired", width: 1, default: () => 0 })
  paired: boolean;

  @Column("tinyint", { name: "active", width: 1, default: () => 1 })
  active: boolean;

  @Column("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => Action, (action) => action.controller)
  actions: Action[];

  @ManyToOne(() => Group, (group) => group.controllers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
