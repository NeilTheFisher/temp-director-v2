import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_purchases")
export class KpiPurchases {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "chatbot_id", length: 191 })
  chatbotId: string;

  @Column("varchar", { name: "chatbot_name", length: 191 })
  chatbotName: string;

  @Column("int", { name: "event_id" })
  eventId: number;

  @Column("int", { name: "quantity" })
  quantity: number;

  @Column("double", { name: "total_price", precision: 10, scale: 2 })
  totalPrice: number;
}
