import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Event } from "./Event";
import { Stream } from "./Stream";

@Index("event_stream_stream_id_foreign", ["streamId"], {})
@Index("event_stream_event_id_foreign", ["eventId"], {})
@Entity("event_stream")
export class EventStream {
  @PrimaryColumn("bigint", { name: "stream_id", unsigned: true })
  streamId: number;

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("tinyint", { name: "enabled", width: 1, default: () => 1 })
  enabled: boolean;

  @ManyToOne(() => Event, (event) => event.eventStreams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Stream, (stream) => stream.eventStreams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "stream_id", referencedColumnName: "id" }])
  stream: Stream;
}
