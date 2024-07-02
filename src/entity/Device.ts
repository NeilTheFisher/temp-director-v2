import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Sip } from "./Sip";
import { Action } from "./Action";
import { DeviceGroup } from "./DeviceGroup";
import { DeviceEvent } from "./DeviceEvent";
import { VideowallMedia } from "./VideowallMedia";
import { Stream } from "./Stream";

@Index("device_code_unique", ["code"], { unique: true })
@Index("device_stream_id_foreign", ["streamId"], {})
@Entity("device")
export class Device {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("tinyint", { name: "active", width: 1, default: () => 1 })
  active: boolean;

  @Column("int", { name: "created_at", default: () => "UNIX_TIMESTAMP()" })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => "UNIX_TIMESTAMP()" })
  updatedAt: number;

  @Column("varchar", {
    name: "code",
    nullable: true,
    unique: true,
    length: 191,
  })
  code: string | null;

  @Column("bigint", { name: "stream_id", nullable: true, unsigned: true })
  streamId: number | null;

  @Column("longblob", { name: "image", nullable: true })
  image: Buffer | null;

  @Column("longblob", { name: "logo", nullable: true })
  logo: Buffer | null;

  @Column("varchar", { name: "category", nullable: true, length: 191 })
  category: string | null;

  @Column("tinyint", { name: "running", width: 1, default: () => 0 })
  running: boolean;

  @OneToMany(() => Sip, (sip) => sip.device)
  sips: Sip[];

  @OneToMany(() => Action, (action) => action.device)
  actions: Action[];

  @OneToMany(() => DeviceGroup, (deviceGroup) => deviceGroup.device)
  deviceGroups: DeviceGroup[];

  @OneToMany(() => DeviceEvent, (deviceEvent) => deviceEvent.device)
  deviceEvents: DeviceEvent[];

  @OneToMany(() => VideowallMedia, (videowallMedia) => videowallMedia.device)
  videowallMedias: VideowallMedia[];

  @ManyToOne(() => Stream, (stream) => stream.devices, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "stream_id", referencedColumnName: "id" }])
  stream: Stream;
}
