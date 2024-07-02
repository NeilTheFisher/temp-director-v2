import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Device } from "./Device";

@Index("sip_device_id_foreign", ["deviceId"], {})
@Entity("sip")
export class Sip {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "device_id", unsigned: true })
  deviceId: number;

  @Column("varchar", { name: "sip", length: 191 })
  sip: string;

  @Column("tinyint", { name: "subscribed", width: 1 })
  subscribed: boolean;

  @Column("longtext", { name: "password", nullable: true })
  password: string | null;

  @Column("longtext", { name: "message", nullable: true })
  message: string | null;

  @ManyToOne(() => Device, (device) => device.sips, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: Device;
}
