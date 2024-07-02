import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("session_logs_user_id_index", ["userId"], {})
@Entity("session_logs")
export class SessionLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "ip", nullable: true, length: 191 })
  ip: string | null;

  @Column("varchar", { name: "platform", nullable: true, length: 191 })
  platform: string | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("varchar", { name: "location", nullable: true, length: 191 })
  location: string | null;

  @ManyToOne(() => User, (user) => user.sessionLogs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
