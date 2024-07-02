import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Event } from "./Event";

@Index("shopping_feed_event_id_foreign", ["eventId"], {})
@Entity("shopping_feed")
export class ShoppingFeed {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("varchar", { name: "url", length: 191 })
  url: string;

  @Column("varchar", { name: "type", nullable: true, length: 191 })
  type: string | null;

  @Column("longtext", { name: "categories", nullable: true })
  categories: string | null;

  @Column("tinyint", { name: "raw_xml_compressed", width: 1 })
  rawXmlCompressed: boolean;

  @Column("tinyint", { name: "event_xml_compressed", width: 1 })
  eventXmlCompressed: boolean;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("longblob", { name: "raw_xml", nullable: true })
  rawXml: Buffer | null;

  @Column("longblob", { name: "event_xml", nullable: true })
  eventXml: Buffer | null;

  @Column("tinyint", { name: "poll", width: 1, default: () => 0 })
  poll: boolean;

  @ManyToOne(() => Event, (event) => event.shoppingFeeds, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
