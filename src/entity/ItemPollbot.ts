import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("item_pollbot")
export class ItemPollbot {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("tinyint", { name: "pollbot_feed", width: 1 })
  pollbotFeed: boolean;

  @Column("int", { name: "event_id" })
  eventId: number;

  @Column("varchar", { name: "style", length: 191 })
  style: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;
}
