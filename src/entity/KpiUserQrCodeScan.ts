import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceUser } from "./KpiOdienceUser";

@Index("kpi_user_qr_code_scan_msisdn_foreign", ["msisdn"], {})
@Entity("kpi_user_qr_code_scan")
export class KpiUserQrCodeScan {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("int", { name: "date", default: () => 0})
  date: number;

  @Column("int", { name: "created_at", default: () => 0})
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiUserQrCodeScans,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "msisdn", referencedColumnName: "msisdn" }])
  msisdn2: KpiOdienceUser;
}
