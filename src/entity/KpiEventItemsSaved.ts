import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_event_items_saved")
export class KpiEventItemsSaved {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("int", { name: "items_count" })
  itemsCount: number;

  @Column("int", { name: "event_id" })
  eventId: number;
}
