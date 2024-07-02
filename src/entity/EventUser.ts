import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Index("event_user_user_id_foreign", ["userId"], {})
@Index("event_user_event_id_foreign", ["eventId"], {})
@Entity("event_user")
export class EventUser {
  @PrimaryColumn("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @ManyToOne(() => Event, (event) => event.eventUsers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => User, (user) => user.eventUsers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
