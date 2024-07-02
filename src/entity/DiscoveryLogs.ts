import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("discovery_logs")
export class DiscoveryLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("int", { name: "mcc", nullable: true })
  mcc: number | null;

  @Column("int", { name: "mnc", nullable: true })
  mnc: number | null;

  @Column("varchar", { name: "ip", nullable: true, length: 191 })
  ip: string | null;

  @Column("varchar", { name: "stream_url", nullable: true, length: 191 })
  streamUrl: string | null;

  @Column("tinyint", { name: "mobile", width: 1, default: () => 0 })
  mobile: boolean;

  @Column("int", { name: "timestamp", default: () => 0 })
  timestamp: number;

  @Column("longtext", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "country", length: 191 })
  country: string;
}
