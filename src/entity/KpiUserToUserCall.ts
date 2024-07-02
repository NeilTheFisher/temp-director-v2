import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kpi_user_to_user_call")
export class KpiUserToUserCall {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "user_id", length: 191 })
  userId: string;

  @Column("varchar", { name: "callee_id", length: 191 })
  calleeId: string;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("int", { name: "date" })
  date: number;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("bigint", { name: "event_id" })
  eventId: number;
}
