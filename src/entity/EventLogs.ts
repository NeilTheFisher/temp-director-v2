import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("event_logs_event_id_foreign", ["eventId"], {})
@Entity("event_logs")
export class EventLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "action", length: 191 })
  action: string;

  @Column("longtext", { name: "info", nullable: true })
  info: string | null;

  @Column("int", { name: "date" })
  date: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "user_name", nullable: true, length: 191 })
  userName: string | null;

  @ManyToOne(() => Event, (event) => event.eventLogs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
