import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceUser } from "./KpiOdienceUser";

@Index("kpi_user_device_interaction_msisdn_foreign", ["msisdn"], {})
@Entity("kpi_user_device_interaction")
export class KpiUserDeviceInteraction {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("int", { name: "date", default: () => 0})
  date: number;

  @Column("int", { name: "duration", default: () => 0 })
  duration: number;

  @Column("varchar", { name: "device_type", nullable: true, length: 191 })
  deviceType: string | null;

  @Column("varchar", { name: "device_status", nullable: true, length: 191 })
  deviceStatus: string | null;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiUserDeviceInteractions,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "msisdn", referencedColumnName: "msisdn" }])
  msisdn2: KpiOdienceUser;
}
