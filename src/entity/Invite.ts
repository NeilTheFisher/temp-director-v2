import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { InviteTemplate } from "./InviteTemplate";
import { Event } from "./Event";

@Index("invite_event_id_foreign", ["eventId"], {})
@Entity("invite")
export class Invite {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "recipient", length: 191 })
  recipient: string;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;

  @Column("varchar", { name: "msgId", nullable: true, length: 191 })
  msgId: string | null;

  @Column("varchar", { name: "status", nullable: true, length: 191 })
  status: string | null;

  @Column("varchar", { name: "timestamp", nullable: true, length: 191 })
  timestamp: string | null;

  @Column("tinyint", { name: "is_rcs", nullable: true, width: 1, default: () => 0 })
  isRcs: boolean | null;

  @Column("bigint", { name: "event_id", nullable: true, unsigned: true })
  eventId: number | null;

  @Column("tinyint", { name: "payed", width: 1, default: () => 0 })
  payed: boolean;

  @Column("varchar", { name: "ticket_type", nullable: true, length: 191 })
  ticketType: string | null;

  @Column("varchar", { name: "type", nullable: true, length: 191 })
  type: string | null;

  @Column("longtext", { name: "log", nullable: true })
  log: string | null;

  @OneToMany(() => InviteTemplate, (inviteTemplate) => inviteTemplate.invite)
  inviteTemplates: InviteTemplate[];

  @ManyToOne(() => Event, (event) => event.invites, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
