import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("model_logs_user_id_index", ["userId"], {})
@Index("model_logs_model_id_index", ["modelId"], {})
@Entity("model_logs")
export class ModelLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("bigint", { name: "model_id", nullable: true, unsigned: true })
  modelId: number | null;

  @Column("varchar", { name: "ip", nullable: true, length: 191 })
  ip: string | null;

  @Column("varchar", { name: "action", nullable: true, length: 191 })
  action: string | null;

  @Column("varchar", { name: "model", nullable: true, length: 191 })
  model: string | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("varchar", { name: "info", length: 191 })
  info: string;

  @ManyToOne(() => User, (user) => user.modelLogs, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
