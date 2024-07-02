import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("event_poll_event_id_foreign", ["eventId"], {})
@Entity("event_poll")
export class EventPoll {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "item_voted", length: 191 })
  itemVoted: string;

  @Column("varchar", { name: "image_url", length: 191 })
  imageUrl: string;

  @Column("varchar", { name: "bot_id", length: 191 })
  botId: string;

  @ManyToOne(() => Event, (event) => event.eventPolls, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
