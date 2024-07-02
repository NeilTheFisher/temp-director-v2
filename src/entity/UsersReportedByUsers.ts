import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users_reported_by_users")
export class UsersReportedByUsers {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "reported", length: 191 })
  reported: string;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null;
}
