import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InviteTemplate } from "./InviteTemplate";
import { EventTemplate } from "./EventTemplate";
import { GroupTemplate } from "./GroupTemplate";

@Entity("template")
export class Template {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "message", nullable: true, length: 191 })
  message: string | null;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;

  @Column("longblob", { name: "image", nullable: true })
  image: Buffer | null;

  @OneToMany(() => InviteTemplate, (inviteTemplate) => inviteTemplate.template)
  inviteTemplates: InviteTemplate[];

  @OneToMany(() => EventTemplate, (eventTemplate) => eventTemplate.template)
  eventTemplates: EventTemplate[];

  @OneToMany(() => GroupTemplate, (groupTemplate) => groupTemplate.template)
  groupTemplates: GroupTemplate[];
}
