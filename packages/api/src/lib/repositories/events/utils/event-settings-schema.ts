import { type } from "arktype";

/**
 * Event settings schema using ArkType for validation
 * Coerces string/unknown values to appropriate types
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
  // Optional settings for branding and tickets
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
  eatured_catalog_image_alignment: "string = 'scalefit'",
  featured_catalog_blurred_background: "number|string = 0",
  ad_brand_panel_display_interval: "number|string = 10",
  ad_event_details_display_interval: "number|string = 10",
  ad_inisde_stream_show_interval: "number|string = 15",
  ad_inside_stream_display_delay: "number|string = 0",
  ad_inside_stream_skip_after: "number|string = 5",
  ad_invitation_page_display_interval: "number|string = 10",
});

/**
 * Parse and validate event settings using ArkType schema
 */
export function parseEventSettings(value: unknown) {
  if (typeof value !== "string") {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      // Validate against schema - ArkType will coerce values
      const validated = eventSettingsSchema(parsed);

      // Check if validation resulted in an error (ArkType convention)
      if (validated instanceof type) {
        // If error, return empty object
        return {};
      }

      return validated;
    }
    return {};
  } catch {
    return {};
  }
}
