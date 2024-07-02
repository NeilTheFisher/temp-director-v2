import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Action } from "./Action";
import { Event } from "./Event";

@Index("trigger_logs_event_id_foreign", ["eventId"], {})
@Index("trigger_logs_action_id_foreign", ["actionId"], {})
@Entity("trigger_logs")
export class TriggerLogs {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "trigger", length: 191 })
  trigger: string;

  @Column("varchar", { name: "status", length: 191 })
  status: string;

  @Column("longtext", { name: "response", nullable: true })
  response: string | null;

  @Column("longtext", { name: "user", nullable: true })
  user: string | null;

  @Column("int", { name: "date" })
  date: number;

  @Column("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("bigint", { name: "action_id", nullable: true, unsigned: true })
  actionId: number | null;

  @ManyToOne(() => Action, (action) => action.triggerLogs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "action_id", referencedColumnName: "id" }])
  action: Action;

  @ManyToOne(() => Event, (event) => event.triggerLogs, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
