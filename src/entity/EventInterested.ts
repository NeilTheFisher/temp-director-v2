import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Event } from "./Event"

@Index("event_interested_event_id_index", ["eventId"], {})
@Entity("event_interested")
export class EventInterested {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string

  @Column("timestamp", { name: "date", nullable: true })
  date: Date | null

  @ManyToOne(() => Event, (event) => event.usersInterested, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event
}
