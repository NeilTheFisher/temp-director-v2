import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("event_flagged_event_id_index", ["eventId"], {})
@Entity("event_flagged")
export class EventFlagged {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("int", { name: "flags", default: () => "'0'" })
  flags: number;

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null;

  @ManyToOne(() => Event, (event) => event.eventFlaggeds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
