import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Event } from "./Event"

@Entity("setting")
export class Setting {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("varchar", { name: "key", length: 191 })
  key: string

  @Column("longtext", { name: "value", nullable: true })
  value: string | null

  @Column("varchar", { name: "configurable_type", nullable: true, length: 191 })
  configurableType: string | null

  @Column("bigint", { name: "configurable_id", nullable: true, unsigned: true })
  configurableId: string | null
  private static loadedSettings: Map<string, string> = new Map()

  @ManyToOne(() => Event, (event) => event.settings)
  @JoinColumn({ name: "configurable_id", referencedColumnName: "id" })
  event: Event

  static getLoadedSettings(): Map<string, string> {
    return this.loadedSettings
  }

  static setLoadedSetting(key: string, value: string): void {
    this.loadedSettings.set(key, value)
  }

  //#region constants
  public static SYSTEM_SETTINGS = "system_settings"
  public static EVENT_SETTINGS = "event_settings"
  public static STORE_LOG_DURATION = "store_log_duration"
  public static STORE_DISCOVERY_LOG_DURATION = "store_discovery_log_duration"
  public static MESSAGE_INTERVAL = "message_interval"
  public static PNS_API_IP = "pns_api_ip"
  public static PNS_API_PORT = "pns_api_port"
  public static CHATBOT_FEED_URL = "chatbot_feed_url"
  public static POLLBOT_FEED_URL = "pollbot_feed_url"
  public static CHATBOT_STORE_HOST = "chatbot_store_host"
  public static CHATBOT_STORE_CODE = "chatbot_store_code"
  public static CHATBOT_STORE_CUSTOMER_TOKEN = "chatbot_store_customer_token"
  public static CHATBOT_INTERPRETER_ADDRESS = "chatbot_interpreter_address"
  public static CHATBOT_BUILDER_API_TOKEN = "chatbot_builder_api_token"
  public static CHATBOT_AGGREGATOR_API_TOKEN = "chatbot_aggregator_api_token"
  public static CHATBOT_MODERATOR_API_TOKEN = "chatbot_moderator_api_token"
  public static CHATBOT_TR_URL = "chatbot_tr_url"
  public static CHATBOT_NAME = "chatbot_name"
  public static CHATBOT_ID = "chatbot_id"
  public static CHATBOT_IMAGE_ALIGNMENT = "chatbot_image_alignment"
  public static CHATBOT_DIRECTORY_ADDRESS = "chatbot_directory_address"
  public static CHATBOT_DIRECTORY_ADDRESS_DEFAULT = "chatbot_directory_address_default"
  public static CHATBOT_SHOPPING_DESCRIPTION_LENGTH = "chatbot_shopping_description_length"
  public static CHATBOT_POLLBOT_DESCRIPTION_LENGTH = "chatbot_pollbot_description_length"
  public static PAYPAL_EMAIL = "paypal_email"
  public static BRACKET_IMAGE_URL = "bracket_image_url"
  public static TWILIO_ACCOUNT_SID = "twilio_account_sid"
  public static TWILIO_AUTH_TOKEN = "twilio_auth_token"
  public static TWILIO_PHONE_NUMBER = "twilio_phone_number"
  public static SMTP_HOST = "smtp_host"
  public static SMTP_PORT = "smtp_port"
  public static SMTP_SENDER_ADDRESS = "smpt_sender_address"
  public static SMTP_SENDER_NAME = "smtp_sender_name"
  public static SMTP_USERNAME = "smtp_username"
  public static SMTP_PASSWORD = "smtp_password"
  public static SMTP_PROTOCOL = "smtp_protocol"
  public static DMX_CONTROL_URL = "dmx_control_url"
  public static RASPBERRY_IP = "raspberry_ip"
  public static MESSAGES_MODERATOR_API_IP = "messages_moderator_api_ip"
  public static MESSAGES_MODERATOR_API_PORT = "messages_moderator_api_port"
  public static EVENT_FEATURE_CHAT = "event_feature_chat"
  public static EVENT_FEATURE_VIDEO_WALL = "event_feature_video_wall"
  public static EVENT_FEATURE_FRONT_ROW = "event_feature_front_row"
  public static EVENT_FEATURE_ACTIONS = "event_feature_actions"
  public static EVENT_FEATURE_EXTRAS = "event_feature_extras"
  public static EVENT_MESSAGE_REMINDER = "event_message_reminder"
  public static EVENT_MESSAGE_REMINDER_TEXT = "event_message_reminder_text"
  public static WEB_STREAM_SIGNALING_SERVER_URL = "web_stream_signaling_server_url"
  public static WEB_STREAM_SERVER_ID = "web_stream_server_id"
  public static VIDEO_WALL_INVITATION_START_TIME = "videowall_invitation_start_time"
  public static VIDEO_WALL_INVITATION_END_TIME = "videowall_invitation_end_time"
  public static VIDEO_WALL_INVITATION_INTERVAL = "videowall_invitation_interval"
  public static VIDEO_WALL_USER_REQUEST = "videowall_user_request"
  public static VIDEO_WALL_DURATION = "videowall_duration"
  public static VIDEO_WALL_LAYOUT = "videowall_layout"
  public static VIDEO_WALL_MAX_NUMBER_CALLS = "videowall_max_number_calls"
  public static VIDEO_WALL_VIDEO_ASPECT = "videowall_video_aspect"
  public static VIDEO_WALL_VIDEO_ASPECT_ROUNDED = "videowall_video_aspect_rounded"
  public static VIDEO_WALL_VIDEO_MARGIN = "videowall_video_margin"
  public static VIDEO_WALL_MESSAGE_POSITION = "video_wall_message_position"
  public static VIDEO_WALL_FEED_POSITION = "video_wall_feed_position"
  public static VIDEO_WALL_PRE_RECORDED_VIDEO = "video_wall_pre_recorded_video"
  public static VIDEO_WALL_EMPTY_MESSAGE = "video_wall_empty_message"
  public static VIDEO_WALL_RESOLUME_OSC_URL = "video_wall_resolume_osc_url"
  public static VIDEO_WALL_CALL_RESOLUTION = "videowall_call_resolution"
  public static FRONT_ROW_PREVIEW_AUTOGRAPH = "front_row_preview_autograph"
  public static VIDEO_WALL_TEXT_COLOR = "video_wall_text_color"
  public static EVENT_WELCOME_MESSAGE = "event_welcome_message"
  public static EVENT_AI_DETECTION = "event_ai_detection"
  public static WEB_VIDEO_WALL_RANGE = "web_video_wall_range"
  public static FRONT_ROW_NUMBER_RANGE = "front_row_number_range"
  public static ON_STANDBY_WALL_MAX_CONNECTIONS = "on_standby_wall_max_connections"
  public static ON_STANDBY_VIDEO_WALL_RANGE = "on_standby_video_wall_range"
  public static ON_STANDBY_VIDEO_WALL_SIP = "on_standby_video_wall_sip"
  public static RESOLUME_VIDEO_WALL_RANGE = "resolume_wall_range"
  public static GLOBAL_VIDEO_WALL_MAX_CONNECTIONS = "global_videowall_max_connection"
  public static VIDEO_WALL_DISCONNECT_TIMEOUT = "videowall_disconnect_timeout"
  public static VIDEO_WALL_REACTION_DURATION_INTERVAL = "videowall_reaction_duration_interval"
  public static VIDEO_WALL_REQUEST_INVITE_DURATION = "videowall_request_invite_duration"
  public static VIDEO_WALL_AUTOMATION = "videowall_automation"
  public static VIDEO_WALL_INVITATION_TIME_SLOTS = "videowall_invitation_time_slots"
  public static VIDEO_WALL_POLL_BOT_POSITION = "videowall_poll_bot_position"
  public static VIDEO_WALL_POLL_TITLE_COLOR = "videowall_poll_title_color"
  public static VIDEO_WALL_POLL_BAR_BACKGROUND_COLOR = "videowall_poll_bar_background_color"
  public static VIDEO_WALL_POLL_BAR_FOREGROUND_COLOR = "videowall_poll_bar_foreground_color"
  public static VIDEO_WALL_POLL_BAR_TEXT_COLOR = "videowall_poll_bar_text_color"
  public static VIDEO_WALL_POLL_TEXT_FONT = "videowall_poll_text_font"
  public static VIDEO_WALL_POLL_RESULTS_EDGES_ROUNDED = "videowall_poll_results_edges_rounded"
  public static PHILLIPS_HUE_APP_NAME = "phillips_hue_app_name"
  public static PHILLIPS_HUE_CLIENT_ID = "phillips_hue_client_id"
  public static PHILLIPS_HUE_CLIENT_SECRET = "phillips_hue_client_secret"
  public static PHILLIPS_HUE_AUTHORIZATION_CODE = "phillips_hue_authorization_code"
  public static PHILLIPS_HUE_ACCESS_TOKEN = "phillips_hue_access_token"
  public static PHILLIPS_HUE_REFRESH_TOKEN = "phillips_hue_refresh_token"
  public static PHILLIPS_HUE_USERNAME = "phillips_hue_username"
  public static PHILLIPS_HUE_ACCESS_TOKEN_EXPIRATION_DATE =
    "phillips_hue_access_token_expiration_date"
  public static PHILLIPS_HUE_REFRESH_TOKEN_EXPIRATION_DATE =
    "phillips_hue_refresh_token_expiration_date"
  public static QRCODE_TRIGGER_ACTION = "qrcode_trigger_action"
  public static BRAND_BACKGROUND_COLOR = "brand_background_color"
  public static BRAND_TITLE = "brand_title"
  public static BRAND_SUBTITLE = "brand_subtitle"
  public static BRAND_TEXT_COLOR = "brand_text_color"
  public static BRAND_BACKGROUND_OPACITY = "brand_background_opacity"
  public static SHOW_BRAND_PANEL = "show_brand_panel"
  public static BRAND_LOGO_PADDING = "brand_logo_padding"
  public static CUSTOM_TRIGGER_ACTION = "custom_trigger_action"
  public static CHAT_PROFANITY = "chat_profanity"
  public static CHAT_PROFANITY_NOTIFICATION_MESSAGE = "chat_profanity_notification_message"
  public static ODIENCE_LOGO = "/images/odience.png"
  public static EMPTY_IMAGE = "/images/event/empty_event.svg"
  public static BINGO_SERVER_URL = "bingo_server_url"
  public static BINGO_SERVER_TOKEN = "bingo_server_token"
  public static ESPORT_SERVER_URL = "esport_server_url"
  public static ESPORT_SERVER_TOKEN = "esport_server_token"
  public static KPI_MESSAGES = "kpi_messages"
  public static NFT_BOT = "nft_bot"
  public static HQ_ZOOM = "hq_zoom"
  public static AUTOMATIC_SMS_ITEMS = "automatic_sms_items"
  public static PAYED_EVENT = "payed_event"
  public static KPI_USERS = "kpi_users"
  public static KPI_USERS_PICTURES_TAKEN = "kpi_users_pictures_taken"
  public static KPI_UPLOAD_INTERVAL = "kpi_upload_interval"
  public static KPI_UPLOAD_DATA_NUMBER = "kpi_upload_data_number"
  public static WEBSOCKIFY_PORT = "websockify_port"
  public static TIME_LIMITED_INVITATION = "time_limited_invitation"
  public static STREAM_MESSAGE_FONT_SIZE = "stream_message_font_size"
  public static VIDEO_WALL_USER_AVATAR_SIZE = "video_wall_user_avatar_size"
  public static STREAM_MESSAGE_BG_COLOR = "stream_message_bg_color"
  public static STREAM_MESSAGE_BG_IMAGE_URL = "stream_message_bg_image_url"
  public static APP_WALL_TEMPLATE = "app_wall_template"
  /* Settings download urls for the app */
  public static ODIENCE_DOWNLOAD_URL_ANDROID = "odience_download_url_android"
  public static ODIENCE_DOWNLOAD_URL_IOS = "odience_download_url_ios"
  public static IOS_APP_LINKS_JSON = "ios_app_links_json"
  public static ANDROID_APP_LINKS_JSON = "android_app_links_json"
  /*event TICKETS*/
  public static EVENT_TICKET_LEVELS = "event_ticket_levels"
  public static EVENT_TICKET_TYPE = "event_ticket_type"
  public static EVENT_TICKET_TYPE_PAYED = "event_ticket_type_payed"
  public static EVENT_TICKET_TYPE_FREE = "event_ticket_type_free"
  public static EVENT_TICKET_TYPE_LABELS = [
    { EVENT_TICKET_TYPE_FREE: "Free/no tickets registration" },
    { EVENT_TICKET_TYPE_PAYED: "Buy tickets" },
  ]
  public static EVENT_TICKET_PLATFORM = "event_ticket_platform"
  public static EVENT_TICKET_CURRENCY = "event_ticket_currency"
  /* Settings for osc commands */
  public static OSC_DEFAULT_COLUMNS = "osc_default_columns"
  public static OSC_POLL_COLUMNS = "osc_poll_columns"
  public static OSC_POLL_END_COLUMNS = "osc_poll_end_columns"
  public static OSC_FEATURED_MESSAGE_COLUMNS = "osc_featured_message_columns"
  public static OSC_FEATURED_MESSAGE_END_COLUMNS = "osc_featured_message_end_columns"
  public static OSC_FRONTROW_COLUMNS = "osc_frontrow_columns"
  public static OSC_FRONTROW_END_COLUMNS = "osc_frontrow_end_columns"
  public static OSC_FEATURED_USER_COLUMNS = "osc_featured_user_columns"
  public static OSC_FEATURED_USER_END_COLUMNS = "osc_featured_user_end_columns"
  public static OSC_POLL_SETTINGS = "osc_poll_settings"
  public static OSC_REACTIONS_LAYERS_EMOTE_SETTINGS = "osc_reactions_layer_emote_settings"
  public static OSC_FEATURED_MESSAGE_SETTINGS = "osc_featured_message_settings"
  public static OSC_FRONTROW_SETTINGS = "osc_frontrow_settings"
  /* Emotes names */
  public static EMOTE_HEART = "heart"
  public static EMOTE_SPARKLES = "sparkles"
  public static EMOTE_CONFETTI = "confetti"
  public static EMOTE_FIRE = "fire"
  public static EMOTE_WOW = "wow"
  public static EMOTE_SMIRK = "smirk"
  public static EMOTE_JOY = "joy"
  public static EMOTE_KISS = "kiss"
  /* Settings for layers of emote types */
  public static OSC_REACTION_LAYER_HEART = "osc_reactions_layer_heart"
  public static OSC_REACTION_LAYER_SPARKLES = "osc_reactions_layer_sparkles"
  public static OSC_REACTION_LAYER_CONFETTI = "osc_reactions_layer_confetti"
  public static OSC_REACTION_LAYER_FIRE = "osc_reactions_layer_fire"
  public static OSC_REACTION_LAYER_WOW = "osc_reactions_layer_wow"
  public static OSC_REACTION_LAYER_SMIRK = "osc_reactions_layer_smirk"
  public static OSC_REACTION_LAYER_JOY = "osc_reactions_layer_joy"
  public static OSC_REACTION_LAYER_KISS = "osc_reactions_layer_kiss"

  public static OSC_REACTION_DEFAULT_SCALE_MIN = "osc_reactions_default_scale_min"
  public static OSC_REACTION_DEFAULT_SCALE_MAX = "osc_reactions_default_scale_max"
  public static OSC_REACTION_L1_SCALE_MIN = "osc_reactions_l1_scale_min"
  public static OSC_REACTION_L1_SCALE_MAX = "osc_reactions_l1_scale_max"
  /* Settings for levels of emotes */
  public static EMOTE_LEVEL_ZERO_START = "emote_level_zero_start"
  public static EMOTE_LEVEL_ONE_START = "emote_level_one_start"
  public static EMOTE_LEVEL_TWO_START = "emote_level_two_start"
  public static EMOTE_LEVEL_THREE_START = "emote_level_three_start"
  public static EMOTE_LEVEL_FOUR_START = "emote_level_four_start"
  public static EMOTE_LEVEL_FIVE_START = "emote_level_five_start"

  /* System Settings for events*/
  public static MAXIMUM_NUMBER_EVENTS_PER_USER = "maximum_number_events_per_user"
  public static MAXIMUM_CAPACITY_PER_EVENT = "maximum_capacity_per_event"
  public static MAXIMUM_STREAM_MESSAGES = "maximum_stream_messages"
  public static MAXIMUM_EVENT_LENGTH = "maximum_event_length"

  /* Stream url endpoint */
  public static STREAM_SERVICE_SOCKET_ADDRESS = "stream_service_socket_address"
  public static PUBLISHER_STREAM_SERVICE_SOCKET_ADDRESS = "publisher_stream_service_socket_address"
  public static NFT_CHATBOT_ID = "nft_chatbot_id"
  public static MAX_FEATURED_USERS = "max_featured_users"
  public static TRIGGER_ACTIONS = [{ on: "Always On" }, { moderator: "Moderator Triggered" }]

  /* Ricoh settings */
  public static CAMERA_QOD = "camera_qod"
  public static CAMERA_QOD_IP = "camera_qod_ip"
  public static CAMERA_QOD_MSISDN = "camera_qod_msisdn"
  public static CAMERA_BITRATE = "camera_bitrate"
  public static QOD_SERVICE_ENDPOINT = "qod_service_endpoint"
  public static CAMERA_SOURCE_PORT = "camera_source_port"

  /* Eventbrite endpoint */

  public static EVENTBRITE_HOST = "eventbrite_host"
  public static EVENTBRITE_TOKEN = "eventbrite_token"
  public static EVENTBRITE_UID = "eventbrite_uid"
  public static EVENTBRITE_USER_ID = "eventbrite_user_id"
  public static EVENTBRITE_EVENT_ID = "eventbrite_event_id"
  public static EVENTBRITE_EVENT_URL = "eventbrite_event_url"
  public static EVENTBRITE_ORGANIZATION_ID = "eventbrite_organization_id"
  public static EVENTBRITE_USER_EMAIL = "eventbrite_user_email"
  public static EVENTBRITE_USER_NAME = "eventbrite_user_name"

  /* Event platform settings */

  public static EVENT_PLATFORM_TYPE_ODIENCE = "odience"
  public static EVENT_PLATFORM_TYPE_EVENTBRITE = "event_brite"

  /* Event reminder/ trigger settings */

  public static EVENT_END_REMINDER_INTERVAL = "event_end_reminder_interval"
  public static EVENT_WEBHOOK = "event_webhook"
  public static EVENT_NETWORK_SERVICES_URL = "event_network_services_url"
  public static EVENT_NETWORK_LOGO_URL = "event_network_logo_url"
  public static EVENT_NETWORK_PACKAGE_INFO = "event_network_package_info"
  public static EVENT_NETWORK_ORDER_SUMMARY = "event_network_order_summary"
  public static EVENT_NETWORK_ORDERS = "event_network_orders"
  public static EVENT_NETWORK_QOD_STARTED = "event_network_qod_started"

  /* api settings */
  public static API_ACCESS_TOKEN = "api_access_token"

  /* stream setting */

  public static EDGE_DISCOVERY = "edge_discovery"

  /* featured catalog settings */

  public static FEATURED_CATALOG_IMAGE_ALIGNMENT = "eatured_catalog_image_alignment"
  public static FEATURED_CATALOG_BLURRED_BACKGROUND = "featured_catalog_blurred_background"

  public static EVENT_ASSISTANT_PHONE_NUMBER = "event_assistant_phone_number"
  public static EVENT_INVITATION_MESSAGE = "event_invitation_message"
  //#endregion
}
