import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GroupStream } from "./GroupStream";
import { EventStream } from "./EventStream";
import { StreamUrl } from "./StreamUrl";
import { ProPublisher } from "./ProPublisher";
import { Device } from "./Device";

@Index("stream_code_unique", ["code"], { unique: true })
@Entity("stream")
export class Stream {
  public static CLASS_NAME = "App\Models\Class"

  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("tinyint", { name: "is_equirectangular", width: 1 })
  isEquirectangular: boolean;

  @Column("tinyint", { name: "is_stereo", width: 1 })
  isStereo: boolean;

  @Column("double", { name: "saturation_mod", precision: 8, scale: 3 })
  saturationMod: number;

  @Column("double", { name: "gamma_mod", precision: 8, scale: 3 })
  gammaMod: number;

  @Column("tinyint", { name: "active", width: 1 })
  active: boolean;

  @Column("double", { name: "rotation", nullable: true, precision: 22 })
  rotation: number | null;

  @Column("tinyint", { name: "is_360", width: 1, default: () => 1 })
  is_360: boolean;

  @Column("varchar", { name: "type", length: 191, default: () => "standard" })
  type: string;

  @Column("varchar", { name: "pre_stream", nullable: true, length: 191 })
  preStream: string | null;

  @Column("varchar", { name: "format", nullable: true, length: 191 })
  format: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("varchar", { name: "preview_url", nullable: true, length: 191 })
  previewUrl: string | null;

  @Column("int", { name: "video_length", default: () => 0 })
  videoLength: number;

  @Column("int", { name: "recorded_type", default: () => 0 })
  recordedType: number;

  @Column("varchar", { name: "status", nullable: true, length: 191 })
  status: string | null;

  @Column("tinyint", { name: "loop", width: 1 })
  loop: boolean;

  @Column("longtext", { name: "stream_url_preview", nullable: true })
  streamUrlPreview: string | null;

  @Column("varchar", {
    name: "code",
    nullable: true,
    unique: true,
    length: 191,
  })
  code: string | null;

  @Column("varchar", { name: "chatbot_id", nullable: true, length: 191 })
  chatbotId: string | null;

  @Column("longtext", { name: "chatbot_payload", nullable: true })
  chatbotPayload: string | null;

  @Column("longtext", { name: "zones", nullable: true })
  zones: string | null;

  @Column("varchar", {
    name: "access_type",
    length: 191,
    default: () => "'default'",
  })
  accessType: string;

  @Column("varchar", { name: "propublisher_uid", nullable: true, length: 191 })
  propublisherUid: string | null;

  @OneToMany(() => GroupStream, (groupStream) => groupStream.stream)
  groupStreams: GroupStream[];

  @OneToMany(() => EventStream, (eventStream) => eventStream.stream)
  eventStreams: EventStream[];

  @OneToMany(() => StreamUrl, (streamUrl) => streamUrl.stream)
  streamUrls: StreamUrl[];

  @ManyToOne(() => ProPublisher, (proPublisher) => proPublisher.streams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "propublisher_uid", referencedColumnName: "uid" }])
  propublisher: ProPublisher;

  @OneToMany(() => Device, (device) => device.stream)
  devices: Device[];
}
