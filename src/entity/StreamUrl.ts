import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stream } from "./Stream";

@Index("stream_url_stream_id_foreign", ["streamId"], {})
@Entity("stream_url")
export class StreamUrl {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "url", length: 191 })
  url: string;

  @Column("varchar", { name: "resolution", length: 191 })
  resolution: string;

  @Column("bigint", { name: "stream_id", unsigned: true })
  streamId: number;

  @Column("tinyint", { name: "is_running", width: 1, default: () => "'1'" })
  isRunning: boolean;

  @Column("longtext", { name: "status", nullable: true })
  status: string | null;

  @Column("varchar", { name: "download_url", nullable: true, length: 191 })
  downloadUrl: string | null;

  @ManyToOne(() => Stream, (stream) => stream.streamUrls, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "stream_id", referencedColumnName: "id" }])
  stream: Stream;
}
