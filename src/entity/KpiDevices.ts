import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("kpi_devices_device_type_index", ["deviceType"], {})
@Index("kpi_devices_device_status_index", ["deviceStatus"], {})
@Index("kpi_devices_event_id_index", ["eventId"], {})
@Entity("kpi_devices")
export class KpiDevices {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "device_type", length: 191 })
  deviceType: string;

  @Column("varchar", { name: "device_status", length: 191 })
  deviceStatus: string;

  @Column("varchar", { name: "user_id", length: 191 })
  userId: string;

  @Column("int", { name: "duration", nullable: true })
  duration: number | null;

  @Column("int", { name: "event_id" })
  eventId: number;

  @Column("int", { name: "date" })
  date: number;
}
