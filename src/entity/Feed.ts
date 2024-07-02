import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Item } from "./Item";
import { Event } from "./Event";

@Index("feed_event_id_foreign", ["eventId"], {})
@Entity("feed")
export class Feed {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "current_item", nullable: true, length: 191 })
  currentItem: string | null;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @OneToMany(() => Item, (item) => item.feed)
  items: Item[];

  @ManyToOne(() => Event, (event) => event.feeds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
