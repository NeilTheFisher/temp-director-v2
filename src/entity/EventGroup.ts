import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Event } from "./Event";
import { Group } from "./Group";

@Index("event_group_group_id_foreign", ["groupId"], {})
@Index("event_group_event_id_foreign", ["eventId"], {})
@Entity("event_group")
export class EventGroup {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @ManyToOne(() => Event, (event) => event.eventGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Group, (group) => group.eventGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
