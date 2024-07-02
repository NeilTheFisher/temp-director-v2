import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("event_registered_event_id_index", ["eventId"], {})
@Entity("event_registered")
export class EventRegistered {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "msisdn", nullable: true, length: 191 })
  msisdn: string | null;

  @Column("int", { name: "price", nullable: true })
  price: number | null;

  @Column("varchar", { name: "ticket_level", nullable: true, length: 191 })
  ticketLevel: string | null;

  @Column("varchar", { name: "ticket_platform", nullable: true, length: 191 })
  ticketPlatform: string | null;

  @Column("varchar", { name: "ticket_currency", nullable: true, length: 191 })
  ticketCurrency: string | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("longtext", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "status", nullable: true, length: 191 })
  status: string | null;

  @ManyToOne(() => Event, (event) => event.eventRegistereds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
