import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceUser } from "./KpiOdienceUser";

@Index("kpi_odience_user_to_user_call_msisdn_foreign", ["msisdn"], {})
@Index("kpi_odience_user_to_user_call_callee_id_foreign", ["calleeId"], {})
@Entity("kpi_odience_user_to_user_call")
export class KpiOdienceUserToUserCall {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("int", { name: "date" })
  date: number;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("varchar", { name: "callee_id", length: 191 })
  calleeId: string;

  @Column("int", { name: "duration" })
  duration: number;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @Column("varchar", { name: "direction", nullable: true, length: 191 })
  direction: string | null;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiOdienceUserToUserCalls,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "callee_id", referencedColumnName: "msisdn" }])
  callee: KpiOdienceUser;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiOdienceUserToUserCalls2,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "msisdn", referencedColumnName: "msisdn" }])
  msisdn2: KpiOdienceUser;
}
