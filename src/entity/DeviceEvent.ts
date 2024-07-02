import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Device } from "./Device";
import { Event } from "./Event";

@Index("device_event_device_id_foreign", ["deviceId"], {})
@Index("device_event_event_id_foreign", ["eventId"], {})
@Entity("device_event")
export class DeviceEvent {
  @PrimaryColumn("bigint", { name: "device_id", unsigned: true })
  deviceId: number;

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @ManyToOne(() => Device, (device) => device.deviceEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: Device;

  @ManyToOne(() => Event, (event) => event.deviceEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
