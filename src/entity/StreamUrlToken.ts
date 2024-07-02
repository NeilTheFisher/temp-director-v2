import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("stream_url_token_user_id_index", ["userId"], {})
@Entity("stream_url_token")
export class StreamUrlToken {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "url", length: 191 })
  url: string;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("bigint", { name: "date" })
  date: string;

  @Column("int", { name: "duration", nullable: true })
  duration: number | null;

  @Column("varchar", { name: "token", length: 191 })
  token: string;

  @ManyToOne(() => User, (user) => user.streamUrlTokens, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
