import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users_blocked_by_users")
export class UsersBlockedByUsers {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "blocked", length: 191 })
  blocked: string;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null;
}
