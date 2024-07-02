import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mcc_mnc")
export class MccMnc {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "mcc" })
  mcc: number;

  @Column("int", { name: "mnc" })
  mnc: number;

  @Column("varchar", { name: "iso", length: 191 })
  iso: string;

  @Column("varchar", { name: "country", nullable: true, length: 191 })
  country: string | null;

  @Column("varchar", { name: "country_code", nullable: true, length: 191 })
  countryCode: string | null;

  @Column("varchar", { name: "network", nullable: true, length: 191 })
  network: string | null;

  @Column("longtext", { name: "rules", nullable: true })
  rules: string | null;

  @Column("varchar", { name: "date", nullable: true, length: 191 })
  date: string | null;
}
