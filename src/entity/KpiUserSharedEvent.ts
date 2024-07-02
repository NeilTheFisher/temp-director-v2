import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_user_shared_event")
export class KpiUserSharedEvent {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "date" })
  date: number;

  @Column("varchar", { name: "type", length: 191, default: () => "'opened'" })
  type: string;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;
}
