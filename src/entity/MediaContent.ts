import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";
import { Group } from "./Group";

@Index("media_content_event_id_foreign", ["eventId"], {})
@Index("media_content_group_id_foreign", ["groupId"], {})
@Entity("media_content")
export class MediaContent {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "slot" })
  slot: number;

  @Column("varchar", { name: "media_type", nullable: true, length: 191 })
  mediaType: string | null;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @Column("varchar", { name: "media_url", nullable: true, length: 191 })
  mediaUrl: string | null;

  @Column("varchar", { name: "preview_url", nullable: true, length: 191 })
  previewUrl: string | null;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @Column("varchar", { name: "date", nullable: true, length: 191 })
  date: string | null;

  @ManyToOne(() => Event, (event) => event.mediaContents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Group, (group) => group.mediaContents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
