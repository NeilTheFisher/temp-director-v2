import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Feed } from "./Feed";

@Index("item_feed_id_foreign", ["feedId"], {})
@Index(
  "item_configurable_type_configurable_id_index",
  ["configurableType", "configurableId"],
  {}
)
@Entity("item")
export class Item {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "style", length: 191 })
  style: string;

  @Column("bigint", { name: "feed_id", nullable: true, unsigned: true })
  feedId: number | null;

  @Column("longtext", { name: "info", nullable: true })
  info: string | null;

  @Column("varchar", { name: "configurable_type", nullable: true, length: 191 })
  configurableType: string | null;

  @Column("bigint", { name: "configurable_id", nullable: true, unsigned: true })
  configurableId: number | null;

  @Column("varchar", {
    name: "aggregator_instance_id",
    nullable: true,
    length: 191,
  })
  aggregatorInstanceId: string | null;

  @Column("bigint", { name: "event_id", nullable: true, unsigned: true })
  eventId: number | null;

  @ManyToOne(() => Feed, (feed) => feed.items, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "feed_id", referencedColumnName: "id" }])
  feed: Feed;
}
