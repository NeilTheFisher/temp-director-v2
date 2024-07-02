import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("failed_jobs_uuid_unique", ["uuid"], { unique: true })
@Entity("failed_jobs")
export class FailedJobs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "uuid", unique: true, length: 191 })
  uuid: string;

  @Column("text", { name: "connection" })
  connection: string;

  @Column("text", { name: "queue" })
  queue: string;

  @Column("longtext", { name: "payload" })
  payload: string;

  @Column("longtext", { name: "exception" })
  exception: string;

  @Column("timestamp", {
    name: "failed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  failedAt: Date;
}
