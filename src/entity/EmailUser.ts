import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Index("email_user_user_id_foreign", ["userId"], {})
@Entity("email_user")
export class EmailUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "email", length: 191 })
  email: string;

  @Column("varchar", { name: "msisdn", length: 191, nullable: true })
  msisdn: string;

  @Column("timestamp", { name: "email_verified_at", nullable: true })
  emailVerifiedAt: Date | null;

  @Column("bigint", { name: "user_id", nullable: true, unsigned: true })
  userId: number | null;

  @ManyToOne(() => User, (user) => user.emails, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
