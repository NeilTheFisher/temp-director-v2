import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceUser } from "./KpiOdienceUser";

@Index("kpi_message_sent_msisdn_foreign", ["msisdn"], {})
@Entity("kpi_message_sent")
export class KpiMessageSent {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("int", { name: "date", default: () => 0 })
  date: number;

  @Column("varchar", { name: "status", length: 191 })
  status: string;

  @Column("varchar", { name: "message_id", length: 191 })
  messageId: string;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @Column("varchar", { name: "content", nullable: true, length: 191 })
  content: string | null;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiMessageSents,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "msisdn", referencedColumnName: "msisdn" }])
  msisdn2: KpiOdienceUser;
}
