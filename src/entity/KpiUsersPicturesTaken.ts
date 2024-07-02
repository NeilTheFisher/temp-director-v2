import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_users_pictures_taken")
export class KpiUsersPicturesTaken {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "user_id", length: 191 })
  userId: string;

  @Column("int", { name: "event_id" })
  eventId: number;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;
}
