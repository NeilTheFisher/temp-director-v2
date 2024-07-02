import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceEvent } from "./KpiOdienceEvent";

@Index("kpi_odience_device_msisdn_index", ["msisdn"], {})
@Entity("kpi_odience_device")
export class KpiOdienceDevice {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "odience_version", nullable: true, length: 191 })
  odienceVersion: string | null;

  @Column("varchar", { name: "os_name", nullable: true, length: 191 })
  osName: string | null;

  @Column("varchar", { name: "os_version", nullable: true, length: 191 })
  osVersion: string | null;

  @Column("varchar", { name: "device_model", nullable: true, length: 191 })
  deviceModel: string | null;

  @Column("varchar", { name: "device_make", nullable: true, length: 191 })
  deviceMake: string | null;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @Column("varchar", { name: "device_language", nullable: true, length: 191 })
  deviceLanguage: string | null;

  @OneToMany(() => KpiOdienceEvent, (kpiOdienceEvent) => kpiOdienceEvent.device)
  kpiOdienceEvents: KpiOdienceEvent[];
}
