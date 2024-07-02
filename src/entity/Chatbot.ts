import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatbotEvent } from "./ChatbotEvent";

@Entity("chatbot")
export class Chatbot {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @Column("varchar", { name: "custom_name", nullable: true, length: 191 })
  customName: string | null;

  @Column("varchar", { name: "chatbot_id", nullable: true, length: 191 })
  chatbotId: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 191 })
  type: string | null;

  @Column("varchar", { name: "theme", nullable: true, length: 191 })
  theme: string | null;

  @Column("varchar", { name: "action", nullable: true, length: 191 })
  action: string | null;

  @Column("longtext", { name: "payload", nullable: true })
  payload: string | null;

  @Column("tinyint", { name: "is_qrscan", width: 1, default: () => 0 })
  isQrscan: boolean;

  @Column("varchar", {
    name: "product_filter_id",
    length: 191,
    default: () => "",
  })
  productFilterId: string;

  @Column("varchar", {
    name: "aggregator_instance_id",
    length: 191,
    default: () => "",
  })
  aggregatorInstanceId: string;

  @Column("varchar", {
    name: "scale",
    length: 191,
    default: () => "scalefit",
  })
  scale: string;

  @Column("varchar", { name: "icon", nullable: true, length: 191 })
  icon: string | null;

  @Column("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @Column("varchar", {
    name: "style",
    length: 191,
    default: () => "landscape",
  })
  style: string;

  @OneToMany(() => ChatbotEvent, (chatbotEvent) => chatbotEvent.chatbot)
  chatbotEvents: ChatbotEvent[];
}
