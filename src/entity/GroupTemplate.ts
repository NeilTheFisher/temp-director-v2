import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Group } from "./Group";
import { Template } from "./Template";

@Index("group_template_group_id_foreign", ["groupId"], {})
@Index("group_template_template_id_foreign", ["templateId"], {})
@Entity("group_template")
export class GroupTemplate {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "template_id", unsigned: true })
  templateId: number;

  @ManyToOne(() => Group, (group) => group.groupTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;

  @ManyToOne(() => Template, (template) => template.groupTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "template_id", referencedColumnName: "id" }])
  template: Template;
}
