import { z } from "zod";

export const Event = z
  .object({
    id: z.string().describe("Event Id"),
    namespace: z
      .string()
      .regex(/^\/[0-9]+$/)
      .describe("Event Namespace")
      .optional(),
    name: z.string().describe("Event Name").optional(),
    label: z.string().describe("Event's Label if its live, re-stream, etc...").optional(),
    location: z.string().describe("Event Location").optional(),
    category: z.string().describe("Event category").optional(),
    categoryImage: z.string().describe("Event category's image").optional(),
    imageUrl: z.string().describe("Event image url").optional(),
    map_image_url: z.string().describe("Event map image").optional(),
    promo_video_url: z.string().describe("Event promo video url").optional(),
    promo_video_aspect_ratio: z.string().describe("Event promo video aspect ratio").optional(),
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
            })
          )
        ),
        external: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            image_url: z.string(),
            config: z.record(z.string(), z.any()),
          })
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
    brand: z
      .union([
        z
          .object({
            brand_title: z.string().describe("Brand title"),
            brand_subtitle: z.string().describe("Brand subtitle"),
            show_brand_panel: z.boolean().describe("show or hide brand panel"),
            brand_background_color: z.string().describe("Brand background color"),
            brand_text_color: z.string().describe("Brand text color"),
            brand_image_url: z.string().describe("Brand image url"),
            brand_background_image_url: z.string().describe("Brand background image url"),
            brand_ad_image_url: z.string().describe("Brand ad image url"),
            brand_background_opacity: z.number().describe("Brand background opacity"),
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
            blurred_background: z.boolean().describe("catalogue subtblurred_background"),
          })
          .describe("Event's Featured catalogue image settings"),
        z.null().describe("Event's Featured catalogue image settings"),
      ])
      .describe("Event's Featured catalogue image settings")
      .optional(),
    chatbots: z
      .array(
        z
          .object({
            id: z.string().describe("Chatbot ID"),
            action_image_url: z.string().describe("Chatbot Image Url").optional(),
            name: z.string().describe("Chatbot Name").optional(),
            display_name: z.string().describe("Chatbot Display Name").optional(),
            bot_id: z.string().describe("Chatbot sip ID"),
            type: z.string().describe("Chatbot Type").optional(),
            payload: z.string().describe("Chatbot Payload").optional(),
            chat_theme: z.record(z.string(), z.any()).describe("Chatbot Chat Theme").optional(),
            rich_card_theme: z.record(z.string(), z.any()).describe("Richcard Theme").optional(),
            started: z.boolean().describe("If this chatbot has been started").optional(),
            results_displayed: z
              .object({
                value: z.boolean().describe("If chatbot results are displayed or not"),
                expanded: z
                  .boolean()
                  .describe("If the chatbot results are expanded or not")
                  .optional(),
              })
              .describe("If this chatbot's results have been displayed")
              .optional(),
            chatbot_image_alignment: z.string().describe("Chatbot image alignment").optional(),
            chatbot_image_style: z.string().describe("Chatbot image style").optional(),
            chatbot_blurred_background: z
              .boolean()
              .describe("Chatbot blurred background")
              .optional(),
            user_seen: z.boolean().describe("If user has seen the chatbot").optional(),
          })
          .describe("Chatbot")
      )
      .optional(),
    description: z.string().describe("Event description").optional(),
    capacity: z.number().int().gte(0).describe("Event capacity").optional(),
    min_price: z.number().int().gte(0).describe("Event minimum price").optional(),
    duration: z
      .union([
        z.number().int().describe("Event Duration in seconds"),
        z.null().describe("Event Duration in seconds"),
      ])
      .describe("Event Duration in seconds")
      .optional(),
    date: z.number().int().gte(0).describe("Event Date").optional(),
    coordinates: z
      .union([
        z
          .object({
            lat: z.number().describe("Latitude"),
            lng: z.number().describe("Longitude"),
          })
          .describe("Event's coordinate"),
        z.null().describe("Event's coordinate"),
      ])
      .describe("Event's coordinate")
      .optional(),
    active: z.boolean().describe("Event is active").optional(),
    is_5g: z.boolean().describe("Event's 5g feature").optional(),
    host: z.string().describe("Event host msisdn").optional(),
    onLocation: z.boolean().describe("If on location is enabled").optional(),
    onLocationLock: z.boolean().describe("If on location lock is enabled").optional(),
    ai_detection: z.boolean().describe("If event's stream scans for objects").optional(),
    profanity: z.boolean().describe("Event's profanity feature").optional(),
    poll_started: z
      .boolean()
      .describe("If event's poll started (deprecated, use chatbot.started instead)")
      .optional(),
    event_started: z.boolean().describe("If presenter started the event").optional(),
    live_stream_switching: z
      .boolean()
      .describe("If event's live stream switching is on")
      .optional(),
    ask_question: z.boolean().describe("If event's ask question is on").optional(),
    is_public: z.boolean().describe("If event is public or private").optional(),
    invitations_only: z.boolean().describe("If event is invitation only").optional(),
    organization: z.string().describe("Group name of the event").optional(),
    organization_image_url: z.string().describe("Group image url").optional(),
    organization_id: z.string().describe("Group id").optional(),
    ticket_url: z.string().describe("Purchase ticket url").optional(),
    ticket_platform: z.string().describe("Purchase ticket platform").optional(),
    settings: z
      .union([
        z
          .object({
            event_feature_chat: z.boolean().describe("Event feature chat").optional(),
            message_interval: z.number().describe("Message interval").optional(),
            reminder_interval: z.number().describe("Reminder interval").optional(),
            event_end_reminder_interval: z.number().describe("Reminder interval").optional(),
            videowall_call_resolution: z.string().describe("Videowall call resolution").optional(),
            time_limited_invitation: z.string().describe("Videowall call resolution").optional(),
            nft_bot: z.string().describe("nft_bot").optional(),
            hq_zoom: z.boolean().describe("hq zoom").optional(),
            automatic_sms_items: z.string().describe("Automatic sms items").optional(),
            maximum_stream_messages: z.number().describe("Maximum stream messages").optional(),
            videowall_reaction_duration_interval: z
              .number()
              .describe("Videowall reaction duration interval")
              .optional(),
            videowall_request_invite_duration: z
              .number()
              .describe("Videowall reaction duration interval")
              .optional(),
            emote_settings: z
              .union([
                z
                  .object({
                    emote_level_zero_start: z.string().describe("Emote level 0 start").optional(),
                    emote_level_one_start: z.string().describe("Emote level 1 start").optional(),
                    emote_level_two_start: z.string().describe("Emote level 2 start").optional(),
                    emote_level_three_start: z.string().describe("Emote level 3 start").optional(),
                    emote_level_four_start: z.string().describe("Emote level 4 start").optional(),
                    emote_level_five_start: z.string().describe("Emote level 5 start").optional(),
                  })
                  .describe("Emote Settings"),
                z.null().describe("Emote Settings"),
              ])
              .describe("Emote Settings")
              .optional(),
            question_settings: z
              .union([
                z
                  .object({
                    ask_question: z.boolean().describe("ask question feature").optional(),
                    ask_question_section_name: z
                      .string()
                      .describe("Ask question section name")
                      .optional(),
                    ask_question_types: z.array(z.any()).describe("ask question types").optional(),
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
    silent_mode: z.boolean().describe("If event's silent mode is on").optional(),
    picture_in_picture_mode: z
      .boolean()
      .describe("If event's picture in picture mode is on")
      .optional(),
    picture_in_picture_params: z
      .object({
        streamId: z.string().describe("Stream Id"),
        position: z.string().describe("Stream position"),
      })
      .describe("Picture in picture parameters")
      .optional(),
    has_ricoh_stream: z.boolean().describe("If event has a ricoh stream").default(false),
    owner_id: z.string().describe("Event Owner Id").optional(),
    last_updated: z.number().int().describe("Last updated timestamp").optional(),
    payed: z.boolean().describe("If event requires payment").default(false),
    featured: z
      .boolean()
      .describe("If event is featured to show on top of the list")
      .default(false),
    devices: z.array(z.any()).describe("Event devices").optional(),
    streams: z
      .array(
        z
          .object({
            id: z.string().describe("Stream Id"),
            order: z.number().describe("The order of the stream").optional(),
            name: z.string().describe("Stream name").optional(),
            code: z.string().describe("Code").optional(),
            selected: z.boolean().describe("If the stream was selected").optional(),
            position: z.string().describe("If the stream is in pip mode its position").default(""),
            urls: z
              .array(
                z.object({
                  url: z.string().describe("Stream Url"),
                  download_url: z.string().describe("Download Url").optional(),
                  is_running: z.boolean().describe("is stream is running").optional(),
                  publishing_url: z.string().describe("Publishing Url").optional(),
                  resolution: z.string().describe("Stream resolution"),
                })
              )
              .describe("Stream URL")
              .optional(),
            type: z
              .enum(["standard", "pre-event", "post-event", "in-picture", "floater"])
              .describe("Stream Name")
              .optional(),
            video_format: z
              .enum(["sphere", "hemisphere", "planar"])
              .describe("Stream video format")
              .optional(),
            format: z
              .union([z.string().describe("Stream format"), z.null().describe("Stream format")])
              .describe("Stream format")
              .optional(),
            preStream: z
              .union([
                z.string().describe("Pre Stream Url if exists"),
                z.null().describe("Pre Stream Url if exists"),
              ])
              .describe("Pre Stream Url if exists")
              .optional(),
            previewUrl: z
              .union([
                z.string().describe("Preview Stream Url if exists"),
                z.null().describe("Preview Stream Url if exists"),
              ])
              .describe("Preview Stream Url if exists")
              .optional(),
            loop: z
              .union([
                z.boolean().describe("Loop stream or play only once"),
                z.null().describe("Loop stream or play only once"),
              ])
              .describe("Loop stream or play only once")
              .optional(),
            is_equirectangular: z.boolean().describe("Is EquiRectangular").optional(),
            is_stereo: z.boolean().describe("Is Stereo").optional(),
            is_360: z.boolean().describe("Is 360").optional(),
            access_type: z.string().describe("Stream access").optional(),
            saturation_mod: z.number().int().gte(0).describe("Saturation Mod").optional(),
            gamma_mod: z.number().int().gte(0).describe("Gamma Mod").optional(),
            users: z.array(z.string()).describe("Stream Assigned Users").optional(),
            updated_at: z.number().describe("Last updated at timestamp").optional(),
          })
          .describe("Streams configuration from the director")
      )
      .optional(),
    invites: z.array(z.string().describe("Guests Invited to the event")).optional(),
    requests: z.array(z.string().describe("Guests Requested to join the event")).optional(),
    registrations: z.array(z.string().describe("Guests registered to the event")).optional(),
    invitation_message: z
      .string()
      .describe("Message sent when user is invited to an event")
      .optional(),
    share_message_live_text: z
      .string()
      .describe("Text for message shared for live events")
      .optional(),
    event_url: z.string().describe("Event Url").optional(),
    messageInterval: z
      .number()
      .int()
      .gte(0)
      .describe("Event message interval between each message sent")
      .optional(),
    isRunning: z.boolean().describe("Event is running").optional(),
    usersConnected: z
      .number()
      .int()
      .gte(0)
      .describe("Number of connected users (Idle + Active + Blocked)")
      .optional(),
    usersInterestedCount: z.number().int().gte(0).describe("Number of interested users").optional(),
    mini_carousel_open: z.boolean().describe("If event's mini_carousel is on").optional(),
    mini_carousel_orientation: z.string().describe("mini carousel orientation").optional(),
    welcome_message: z.string().describe("Message sent when presenter starts the event").optional(),
    opened_list: z.array(z.string().describe("Guests viewed the event")).optional(),
    banned: z.boolean().describe("If user is banned from event").optional(),
    blocked: z.boolean().describe("If user is blocked from event").optional(),
    opened: z.boolean().describe("If user has opened the event").optional(),
    interested: z.boolean().describe("If user is interested in the event").optional(),
    banned_list: z.record(z.string(), z.any()).optional(),
    blocked_list: z.record(z.string(), z.any()).optional(),
    invite_categories_list: z.any().optional(),
    flagged_list: z.record(z.string(), z.any()).optional(),
    interested_list: z.array(z.string().describe("Guests interested in the event")).optional(),
    event_ended: z.boolean().describe("If event ended was triggered").optional(),
    recording_started_timestamp: z.number().describe("Timestamp when recording started").optional(),
    invitation_accepted: z.boolean().describe("If user was invited to event").optional(),
    invitation_requested: z.boolean().describe("If user requested to join event").optional(),
    registered: z.boolean().describe("If user registered to the event").optional(),
    complete: z.boolean().describe("If event is full or not").default(false),
    pre_access: z.boolean().describe("If user have access to preview").default(false),
    web_allowed: z.boolean().describe("If app allowed").default(true),
    app_allowed: z.boolean().describe("If app allowed").default(true),
    appUrl: z.string().describe("Event category").optional(),
  })
  .describe("Event configuration from the director");
export type Event = z.infer<typeof Event>;
