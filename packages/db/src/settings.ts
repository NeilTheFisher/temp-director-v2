import { type } from "arktype";

/**
 * Event settings schema with automatic type coercion and defaults
 */
export const eventSettingsSchema = type({
  event_feature_chat: "boolean = false",
  message_interval: "number = 0",
  event_message_reminder: "number = 0",
  event_end_reminder_interval: "number = 0",
  time_limited_invitation: "number|string = 0",
  videowall_request_invite_duration: "number = 0",
  videowall_reaction_duration_interval: "number = 0",
  videowall_call_resolution: "number|string = 0",
  nft_bot: "number|string = 0",
  hq_zoom: "number = 0",
  automatic_sms_items: "string = ''",
  maximum_stream_messages: "number = 0",
  chat_profanity: "number|string = 0",
  show_brand_panel: "number|string|boolean = 1",
  brand_title: "string = ''",
  brand_subtitle: "string = ''",
  brand_background_color: "string = '#DF2C48'",
  brand_text_color: "string = '#FFFFFF'",
  brand_background_opacity: "number|string = 1",
  brand_logo_padding: "number|string = 0.4",
  event_ticket_levels: "string = '[]'",
  event_ticket_platform: "string = ''",
  eventbrite_event_url: "string = ''",
  event_invitation_message: "string = ''",
  event_assistant_phone_number: "string = ''",
  featured_catalog_image_alignment: "string = 'scalefit'",
  featured_catalog_blurred_background: "number|string = 0",
  ad_brand_panel_display_interval: "number|string = 10",
  ad_event_details_display_interval: "number|string = 10",
  ad_inside_stream_show_interval: "number|string = 15",
  ad_inside_stream_display_delay: "number|string = 0",
  ad_inside_stream_skip_after: "number|string = 5",
  ad_invitation_page_display_interval: "number|string = 10",
});

export type EventSettings = typeof eventSettingsSchema.infer;

export type SettingKey = keyof EventSettings | (string & {});

export const eventSettingsKeys = eventSettingsSchema.props.map((p) => p.key) as SettingKey[];

/**
 * Parse and validate event settings from a JSON string or object
 */
export function parseEventSettings(value: unknown): EventSettings {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      const result = eventSettingsSchema(parsed);
      if (result instanceof type.errors) {
        return eventSettingsSchema({}) as EventSettings;
      }
      return result;
    } catch {
      return eventSettingsSchema({}) as EventSettings;
    }
  }

  if (typeof value === "object" && value !== null) {
    const result = eventSettingsSchema(value);
    if (result instanceof type.errors) {
      return eventSettingsSchema({}) as EventSettings;
    }
    return result;
  }

  return eventSettingsSchema({}) as EventSettings;
}
