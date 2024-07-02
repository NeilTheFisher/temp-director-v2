import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";
import { User } from "./User";

@Index("event_requests_user_id_index", ["userId"], {})
@Index("event_requests_event_id_index", ["eventId"], {})
@Entity("event_requests")
export class EventRequests {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "user_id", unsigned: true })
  userId: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "msisdn", nullable: true, length: 191 })
  msisdn: string | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("varchar", {
    name: "status",
    nullable: true,
    length: 191,
    default: () => "pending",
  })
  status: string | null;

  @ManyToOne(() => Event, (event) => event.eventRequests, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => User, (user) => user.eventRequests, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
