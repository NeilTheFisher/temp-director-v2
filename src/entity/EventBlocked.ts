import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("event_blocked_event_id_index", ["eventId"], {})
@Entity("event_blocked")
export class EventBlocked {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null;

  @ManyToOne(() => Event, (event) => event.usersBlocked, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
