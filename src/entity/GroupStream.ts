import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Group } from "./Group";
import { Stream } from "./Stream";

@Index("group_stream_group_id_foreign", ["groupId"], {})
@Index("group_stream_stream_id_foreign", ["streamId"], {})
@Entity("group_stream")
export class GroupStream {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "stream_id", unsigned: true })
  streamId: number;

  @ManyToOne(() => Group, (group) => group.groupStreams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;

  @ManyToOne(() => Stream, (stream) => stream.groupStreams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "stream_id", referencedColumnName: "id" }])
  stream: Stream;
}
