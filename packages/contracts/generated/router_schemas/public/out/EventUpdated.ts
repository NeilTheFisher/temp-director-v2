import { z } from "zod";

export const EventUpdated = z.object({
  id: z.string().describe("Event Id"),
  namespace: z
    .string()
    .regex(/^\/[0-9]+$/)
    .describe("Event Namespace")
    .optional(),
  name: z.string().describe("Event Name").optional(),
  label: z
    .string()
    .describe("Event's Label if its live, re-stream, etc...")
    .optional(),
  date: z.number().int().gte(0).describe("Event Date").optional(),
  duration: z
    .union([
      z.number().int().describe("Event Duration in seconds"),
      z.null().describe("Event Duration in seconds"),
    ])
    .describe("Event Duration in seconds")
    .optional(),
  location: z.string().describe("Event Location").optional(),
  description: z.string().describe("Event description").optional(),
  capacity: z.number().int().gte(0).describe("Event capacity").optional(),
  min_price: z.number().int().gte(0).describe("Event minimum price").optional(),
  organization: z.string().describe("Group name of the event").optional(),
  organization_image_url: z.string().describe("Group image url").optional(),
  organization_id: z.string().describe("Group id").optional(),
  ticket_url: z.string().describe("Purchase ticket url").optional(),
  ticket_platform: z.string().describe("Purchase ticket platform").optional(),
  usersConnected: z
    .number()
    .int()
    .gte(0)
    .describe("Number of connected users (Idle + Active + Blocked)")
    .optional(),
  category: z.string().describe("Event category").optional(),
  imageUrl: z.string().describe("Event image").optional(),
  map_image_url: z.string().describe("Event map image").optional(),
  promo_video_url: z.string().describe("Event promo video url").optional(),
  promo_video_aspect_ratio: z
    .string()
    .describe("Event promo video aspect ratio")
    .optional(),
  is_5g: z.boolean().describe("Event's 5g feature").optional(),
  onLocation: z.boolean().describe("If on location is enabled").optional(),
  onLocationLock: z
    .boolean()
    .describe("If on location lock is enabled")
    .optional(),
  host: z.string().describe("Event host msisdn").optional(),
  is_public: z.boolean().describe("If event is public or private").optional(),
  invitations_only: z
    .boolean()
    .describe("If event is invitation only")
    .optional(),
  coordinates: z
    .union([
      z.record(z.string(), z.any()).describe("Event's coordinate"),
      z.null().describe("Event's coordinate"),
    ])
    .describe("Event's coordinate")
    .optional(),
  invitation_message: z
    .string()
    .describe("Message sent when user is invited to an event")
    .optional(),
  share_message_live_text: z
    .string()
    .describe("Text for message shared for live events")
    .optional(),
  event_url: z.string().describe("Event url").optional(),
  banned: z.boolean().describe("If user is banned from event").optional(),
  blocked: z.boolean().describe("If user is blocked from event").optional(),
  opened: z.boolean().describe("If user has opened the event").optional(),
  interested: z
    .boolean()
    .describe("If user is interested in the event")
    .optional(),
  event_ended: z.boolean().describe("If event ended was triggered").optional(),
  invitation_accepted: z
    .boolean()
    .describe("If user was invited to event")
    .optional(),
  invitation_requested: z
    .boolean()
    .describe("If user requested to join event")
    .optional(),
  registered: z.boolean().describe("If user registered to event").optional(),
  complete: z.boolean().describe("If event is full or not").default(false),
  pre_access: z
    .boolean()
    .describe("If user have access to preview")
    .default(false),
  has_ricoh_stream: z
    .boolean()
    .describe("If event has a ricoh stream")
    .default(false),
  owner_id: z.string().describe("Event Owner Id").optional(),
  payed: z.boolean().describe("If event requires payment").default(false),
  featured: z
    .boolean()
    .describe("If event is featured to show on top of the list")
    .default(false),
  downloads: z.array(z.string().describe("Event stream file urls")).optional(),
  sponsors: z
    .object({
      custom: z.record(
        z.string(),
        z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            media_url: z.string(),
            media_type: z.string(),
            url: z.string(),
            location: z.string(),
            sponsor_name: z.string(),
            clickUrl: z.string(),
          }),
        ),
      ),
      external: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          image_url: z.string(),
          config: z.record(z.string(), z.any()),
        }),
      ),
      settings: z.object({
        event_in_stream: z.object({
          ad_inside_stream_display_delay: z.number(),
          ad_inisde_stream_show_interval: z.number(),
          ad_inside_stream_skip_after: z.number(),
        }),
        event_invitation: z.object({
          ad_invitation_page_display_interval: z.number(),
        }),
        event_details: z.object({
          ad_event_details_display_interval: z.number(),
        }),
        event_brand_panel: z.object({
          ad_brand_panel_display_interval: z.number(),
        }),
      }),
    })
    .describe("Event sponsors with ads grouped by location under 'custom'")
    .optional(),
  settings: z
    .union([
      z
        .object({
          event_feature_chat: z
            .boolean()
            .describe("Event feature chat")
            .optional(),
          message_interval: z.number().describe("Message interval").optional(),
          reminder_interval: z
            .number()
            .describe("Reminder interval")
            .optional(),
          event_end_reminder_interval: z
            .number()
            .describe("Reminder interval")
            .optional(),
          videowall_call_resolution: z
            .string()
            .describe("Videowall call resolution")
            .optional(),
          time_limited_invitation: z
            .string()
            .describe("Videowall call resolution")
            .optional(),
          nft_bot: z.string().describe("nft_bot").optional(),
          hq_zoom: z.boolean().describe("hq zoom").optional(),
          automatic_sms_items: z
            .string()
            .describe("Automatic sms items")
            .optional(),
          maximum_stream_messages: z
            .number()
            .describe("Maximum stream messages")
            .optional(),
          videowall_reaction_duration_interval: z
            .number()
            .describe("Videowall reaction duration interval")
            .optional(),
          videowall_request_invite_duration: z
            .number()
            .describe("Videowall reaction duration interval")
            .optional(),
          question_settings: z
            .union([
              z
                .object({
                  ask_question: z
                    .boolean()
                    .describe("ask question feature")
                    .optional(),
                  ask_question_section_name: z
                    .string()
                    .describe("Ask question section name")
                    .optional(),
                  ask_question_types: z
                    .array(z.any())
                    .describe("ask question types")
                    .optional(),
                })
                .describe("Question Settings"),
              z.null().describe("Question Settings"),
            ])
            .describe("Question Settings")
            .optional(),
        })
        .describe("Event settings"),
      z.null().describe("Event settings"),
    ])
    .describe("Event settings")
    .optional(),
  brand: z
    .union([
      z
        .object({
          show_brand_panel: z
            .boolean()
            .describe("show or hide brand panel")
            .optional(),
          brand_title: z.string().describe("Brand title"),
          brand_subtitle: z.string().describe("Brand subtitle"),
          brand_background_color: z.string().describe("Brand background color"),
          brand_text_color: z.string().describe("Brand text color"),
          brand_image_url: z.string().describe("Brand image url"),
          brand_background_image_url: z
            .string()
            .describe("Brand background image url"),
          brand_ad_image_url: z.string().describe("Brand ad image url"),
          brand_background_opacity: z
            .number()
            .describe("Brand background opacity"),
          brand_logo_padding: z.number().describe("Brand logo padding"),
        })
        .describe("Event's Brand"),
      z.null().describe("Event's Brand"),
    ])
    .describe("Event's Brand")
    .optional(),
  featured_catalogue: z
    .union([
      z
        .object({
          image_alignment: z.string().describe("catalogue title"),
          blurred_background: z
            .boolean()
            .describe("catalogue subtblurred_background"),
        })
        .describe("Event's Featured catalogue image settings"),
      z.null().describe("Event's Featured catalogue image settings"),
    ])
    .describe("Event's Featured catalogue image settings")
    .optional(),
});
export type EventUpdated = z.infer<typeof EventUpdated>;
