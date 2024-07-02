import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Device } from "./Device";

@Index("videowall_media_device_id_foreign", ["deviceId"], {})
@Entity("videowall_media")
export class VideowallMedia {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "device_id", unsigned: true })
  deviceId: number;

  @Column("varchar", { name: "image_url", length: 191 })
  imageUrl: string;

  @Column("varchar", { name: "item_group_id", nullable: true, length: 191 })
  itemGroupId: string | null;

  @Column("varchar", { name: "image_fit", length: 191 })
  imageFit: string;

  @Column("varchar", { name: "column", length: 191 })
  column: string;

  @Column("int", { name: "rotation", default: () => 0 })
  rotation: number;

  @Column("varchar", {
    name: "media_type",
    length: 191,
    default: () => "image",
  })
  mediaType: string;

  @ManyToOne(() => Device, (device) => device.videowallMedias, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: Device;
}
