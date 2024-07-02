import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EventRegistered } from "./EventRegistered";
import { EventLogs } from "./EventLogs";
import { EventUser } from "./EventUser";
import { EventBlocked } from "./EventBlocked";
import { Action } from "./Action";
import { EventInterested } from "./EventInterested";
import { EventRemoved } from "./EventRemoved";
import { Feed } from "./Feed";
import { EventGroup } from "./EventGroup";
import { EventStream } from "./EventStream";
import { MediaContent } from "./MediaContent";
import { EventTemplate } from "./EventTemplate";
import { EventFlagged } from "./EventFlagged";
import { DeviceEvent } from "./DeviceEvent";
import { EventSimulation } from "./EventSimulation";
import { ShoppingFeed } from "./ShoppingFeed";
import { EventOpened } from "./EventOpened";
import { ChatbotEvent } from "./ChatbotEvent";
import { AddressListEvent } from "./AddressListEvent";
import { Invite } from "./Invite";
import { EventPoll } from "./EventPoll";
import { TriggerLogs } from "./TriggerLogs";
import { EventRequests } from "./EventRequests";

@Entity("event")
export class Event {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "location", nullable: true, length: 191 })
  location: string | null;

  @Column("int", { name: "owner_id" })
  ownerId: number;

  @Column("int", { name: "duration", nullable: true })
  duration: number | null;

  @Column("int", { name: "date", nullable: true })
  date: number | null;

  @Column("tinyint", { name: "active", width: 1, default: () => 1 })
  active: boolean;

  @Column("int", { name: "capacity", nullable: true })
  capacity: number | null;

  @Column("longtext", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "category", nullable: true, length: 191 })
  category: string | null;

  @Column("tinyint", { name: "is_public", width: 1, default: () => 0 })
  isPublic: boolean;

  @Column("tinyint", { name: "profanity", width: 1, default: () => 1 })
  profanity: boolean;

  @Column("tinyint", { name: "is_5g", nullable: true, width: 1, default: () => 0 })
  is_5g: boolean | null;

  @Column("int", {
    name: "created_at",
    unsigned: true,
    default: () => "UNIX_TIMESTAMP()",
  })
  createdAt: number;

  @Column("int", {
    name: "updated_at",
    unsigned: true,
    default: () => "UNIX_TIMESTAMP()",
  })
  updatedAt: number;

  @Column("decimal", {
    name: "latitude",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  latitude: string | null;

  @Column("decimal", {
    name: "longitude",
    nullable: true,
    precision: 10,
    scale: 5,
  })
  longitude: string | null;

  @Column("char", { name: "image_uid", nullable: true, length: 36 })
  imageUid: string | null;

  @Column("varchar", { name: "stream_order", nullable: true, length: 191 })
  streamOrder: string | null;

  @Column("varchar", { name: "promo_video_url", nullable: true, length: 191 })
  promoVideoUrl: string | null;

  @Column("tinyint", { name: "invitations_only", width: 1, default: () => 0 })
  invitationsOnly: boolean;

  @Column("tinyint", { name: "is_draft", width: 1, default: () => 0 })
  isDraft: boolean;

  @Column("tinyint", { name: "payed", width: 1 , default: () => 0})
  payed: boolean;

  @Column("varchar", { name: "image_url", nullable: true, length: 191 })
  imageUrl: string | null;

  @Column("varchar", { name: "brand_image_url", nullable: true, length: 191 })
  brandImageUrl: string | null;

  @Column("varchar", {
    name: "brand_background_image_url",
    nullable: true,
    length: 191,
  })
  brandBackgroundImageUrl: string | null;

  @Column("varchar", {
    name: "brand_ad_image_url",
    nullable: true,
    length: 191,
  })
  brandAdImageUrl: string | null;

  @Column("varchar", { name: "featured", nullable: true, length: 191 })
  featured: string | null;

  @Column("varchar", { name: "hashtags", nullable: true, length: 191 })
  hashtags: string | null;

  @Column("tinyint", { name: "app_allowed", width: 1, default: () => 1 })
  appAllowed: boolean;

  @Column("tinyint", { name: "web_allowed", width: 1, default: () => 0 })
  webAllowed: boolean;

  @Column("tinyint", { name: "hmd_allowed", width: 1, default: () => 0 })
  hmdAllowed: boolean;

  @Column("varchar", { name: "shop_bot_id", length: 191, default: () => "" })
  shopBotId: string;

  @Column("varchar", {
    name: "promo_video_aspect_ratio",
    nullable: true,
    length: 191,
  })
  promoVideoAspectRatio: string | null;

  @Column("varchar", {
    name: "promo_video_status",
    nullable: true,
    length: 191,
  })
  promoVideoStatus: string | null;

  @OneToMany(() => EventRegistered, (eventRegistered) => eventRegistered.event)
  eventRegistereds: EventRegistered[];

  @OneToMany(() => EventLogs, (eventLogs) => eventLogs.event)
  eventLogs: EventLogs[];

  @OneToMany(() => EventUser, (eventUser) => eventUser.event)
  eventUsers: EventUser[];

  @OneToMany(() => EventBlocked, (eventBlocked) => eventBlocked.event)
  eventBlockeds: EventBlocked[];

  @OneToMany(() => Action, (action) => action.event)
  actions: Action[];

  @OneToMany(() => EventInterested, (eventInterested) => eventInterested.event)
  eventInteresteds: EventInterested[];

  @OneToMany(() => EventRemoved, (eventRemoved) => eventRemoved.event)
  eventRemoveds: EventRemoved[];

  @OneToMany(() => Feed, (feed) => feed.event)
  feeds: Feed[];

  @OneToMany(() => EventGroup, (eventGroup) => eventGroup.event)
  eventGroups: EventGroup[];

  @OneToMany(() => EventStream, (eventStream) => eventStream.event)
  eventStreams: EventStream[];

  @OneToMany(() => MediaContent, (mediaContent) => mediaContent.event)
  mediaContents: MediaContent[];

  @OneToMany(() => EventTemplate, (eventTemplate) => eventTemplate.event)
  eventTemplates: EventTemplate[];

  @OneToMany(() => EventFlagged, (eventFlagged) => eventFlagged.event)
  eventFlaggeds: EventFlagged[];

  @OneToMany(() => DeviceEvent, (deviceEvent) => deviceEvent.event)
  deviceEvents: DeviceEvent[];

  @OneToMany(() => EventSimulation, (eventSimulation) => eventSimulation.event)
  eventSimulations: EventSimulation[];

  @OneToMany(() => ShoppingFeed, (shoppingFeed) => shoppingFeed.event)
  shoppingFeeds: ShoppingFeed[];

  @OneToMany(() => EventOpened, (eventOpened) => eventOpened.event)
  eventOpeneds: EventOpened[];

  @OneToMany(() => ChatbotEvent, (chatbotEvent) => chatbotEvent.event)
  chatbotEvents: ChatbotEvent[];

  @OneToMany(
    () => AddressListEvent,
    (addressListEvent) => addressListEvent.event
  )
  addressListEvents: AddressListEvent[];

  @OneToMany(() => Invite, (invite) => invite.event)
  invites: Invite[];

  @OneToMany(() => EventPoll, (eventPoll) => eventPoll.event)
  eventPolls: EventPoll[];

  @OneToMany(() => TriggerLogs, (triggerLogs) => triggerLogs.event)
  triggerLogs: TriggerLogs[];

  @OneToMany(() => EventRequests, (eventRequests) => eventRequests.event)
  eventRequests: EventRequests[];
}
