import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_users")
export class KpiUsers {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "user_id", length: 191 })
  userId: string;

  @Column("varchar", { name: "location", nullable: true, length: 191 })
  location: string | null;

  @Column("int", { name: "event_id" })
  eventId: number;

  @Column("bigint", { name: "duration", nullable: true })
  duration: string | null;

  @Column("varchar", { name: "os_name", nullable: true, length: 191 })
  osName: string | null;

  @Column("varchar", { name: "os_version", nullable: true, length: 191 })
  osVersion: string | null;

  @Column("varchar", { name: "device_model", nullable: true, length: 191 })
  deviceModel: string | null;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;
}
