import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Chatbot } from "./Chatbot";
import { Event } from "./Event";

@Index("chatbot_event_chatbot_id_foreign", ["chatbotId"], {})
@Index("chatbot_event_event_id_foreign", ["eventId"], {})
@Entity("chatbot_event")
export class ChatbotEvent {
  @PrimaryColumn("bigint", { name: "chatbot_id", unsigned: true })
  chatbotId: number;

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @ManyToOne(() => Chatbot, (chatbot) => chatbot.chatbotEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "chatbot_id", referencedColumnName: "id" }])
  chatbot: Chatbot;

  @ManyToOne(() => Event, (event) => event.chatbotEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
