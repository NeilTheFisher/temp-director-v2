import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";
import { Template } from "./Template";

@Index("event_template_event_id_foreign", ["eventId"], {})
@Index("event_template_template_id_foreign", ["templateId"], {})
@Entity("event_template")
export class EventTemplate {
  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @PrimaryColumn("bigint", { name: "template_id", unsigned: true })
  templateId: number;

  @ManyToOne(() => Event, (event) => event.eventTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Template, (template) => template.eventTemplates, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "template_id", referencedColumnName: "id" }])
  template: Template;
}
