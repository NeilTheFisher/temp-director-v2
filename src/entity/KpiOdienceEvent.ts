import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceDevice } from "./KpiOdienceDevice";

@Index("kpi_odience_event_device_id_foreign", ["deviceId"], {})
@Entity("kpi_odience_event")
export class KpiOdienceEvent {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("int", { name: "joined_timestamp" })
  joinedTimestamp: number;

  @Column("int", { name: "left_timestamp" })
  leftTimestamp: number;

  @Column("int", { name: "duration", default: () => -1 })
  duration: number;

  @Column("varchar", { name: "stream_state", length: 191 })
  streamState: string;

  @Column("bigint", { name: "device_id", unsigned: true })
  deviceId: number;

  @Column("int", { name: "payment", default: () => "'0'" })
  payment: number;

  @Column("varchar", { name: "location", length: 191 })
  location: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;

  @ManyToOne(
    () => KpiOdienceDevice,
    (kpiOdienceDevice) => kpiOdienceDevice.kpiOdienceEvents,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: KpiOdienceDevice;
}
