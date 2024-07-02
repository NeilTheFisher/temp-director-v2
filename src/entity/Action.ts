import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Controller } from "./Controller";
import { Device } from "./Device";
import { Event } from "./Event";
import { TriggerLogs } from "./TriggerLogs";

@Index("action_event_id_foreign", ["eventId"], {})
@Index("action_controller_id_foreign", ["controllerId"], {})
@Index("action_device_id_foreign", ["deviceId"], {})
@Entity("action")
export class Action {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "trigger", length: 191 })
  trigger: string;

  @Column("longtext", { name: "command", nullable: true })
  command: string | null;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("bigint", { name: "controller_id", unsigned: true })
  controllerId: number;

  @Column("bigint", { name: "device_id", nullable: true, unsigned: true })
  deviceId: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @ManyToOne(() => Controller, (controller) => controller.actions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "controller_id", referencedColumnName: "id" }])
  controller: Controller;

  @ManyToOne(() => Device, (device) => device.actions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: Device;

  @ManyToOne(() => Event, (event) => event.actions, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @OneToMany(() => TriggerLogs, (triggerLogs) => triggerLogs.action)
  triggerLogs: TriggerLogs[];
}
