import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_messages")
export class KpiMessages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "message_id", length: 191 })
  messageId: string;

  @Column("varchar", { name: "status", nullable: true, length: 191 })
  status: string | null;

  @Column("varchar", { name: "sender", nullable: true, length: 191 })
  sender: string | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("int", { name: "event_id" })
  eventId: number;
}
