import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_odience_carrier")
export class KpiOdienceCarrier {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "carrier", length: 191 })
  carrier: string;

  @Column("int", { name: "mcc", nullable: true })
  mcc: number | null;

  @Column("int", { name: "mnc", nullable: true })
  mnc: number | null;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;
}
