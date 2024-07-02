import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Invite } from "./Invite";
import { Template } from "./Template";

@Index("invite_template_template_id_foreign", ["templateId"], {})
@Index("invite_template_invite_id_foreign", ["inviteId"], {})
@Entity("invite_template")
export class InviteTemplate {
  @PrimaryColumn("bigint", { name: "template_id", unsigned: true })
  templateId: number;

  @PrimaryColumn("bigint", { name: "invite_id", unsigned: true })
  inviteId: number;

  @ManyToOne(() => Invite, (invite) => invite.inviteTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "invite_id", referencedColumnName: "id" }])
  invite: Invite;

  @ManyToOne(() => Template, (template) => template.inviteTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "template_id", referencedColumnName: "id" }])
  template: Template;
}
