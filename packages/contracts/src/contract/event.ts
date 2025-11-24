import { eventSchema } from "@director_v2/db/prisma/generated/zod/schemas/models/event.schema";
import { eventIterator } from "@orpc/contract";
import z from "zod";
import { base } from "./base";

// Query parameters for fetching events
export const listEventsInputSchema = z.object({
  category: z.string().optional(),
  date: z.number().optional(),
  location: z.string().optional(),
  per_page: z.number().int().optional(),
  current_page: z.number().int().optional(),
});

// Extended event response with computed fields
// export const eventResponseSchema = eventSchema.extend({
//   id: z.string(), // Convert to string for API
//   namespace: z.string(),
//   label: z.string(),
//   featured: z.boolean(),
//   brand: z.unknown(),
//   featured_catalogue: z.unknown(),
//   organization: z.string(),
//   organization_image_url: z.string(),
//   organization_id: z.bigint(),
//   owner_id: z.string(),
//   categoryImage: z.string(),
//   capacity: z.number().int().nullable(),
//   imageUrl: z.string(),
//   min_price: z.number().nullable(),
//   ticket_url: z.string().nullable(),
//   ticket_platform: z.string().nullable(),
//   map_image_url: z.string().nullable(),
//   has_ricoh_stream: z.boolean(),
//   payed: z.boolean(),
//   invitation_message: z.string().nullable(),
//   event_url: z.string(),
//   invitations_only: z.boolean(),
//   usersConnected: z.number().int(),
//   complete: z.boolean(),
//   invitation_accepted: z.boolean(),
//   invitation_requested: z.boolean(),
//   registered: z.boolean(),
//   usersInterestedCount: z.number().int(),
//   banned: z.boolean(),
//   blocked: z.boolean(),
//   opened: z.boolean(),
//   pre_access: z.unknown(),
//   web_allowed: z.boolean(),
//   app_allowed: z.boolean(),
//   appUrl: z.string(),
//   settings: z.unknown(),
//   active: z.boolean(),
//   downloads: z.array(z.string()),
//   sponsors: z.object({
//     custom: z.unknown(),
//     settings: z.unknown(),
//     external: z.unknown(),
//   }),
//   host: z.unknown(),
//   onLocation: z.unknown(),
//   onLocationLock: z.unknown(),
// });

const FeaturedCatalogue = z
  .object({ image_alignment: z.string(), blurred_background: z.boolean() })
  .partial()
  .loose();
const EventCoordinates = z
  .object({ lat: z.number(), lng: z.number() })
  .partial()
  .loose();
const Brand = z
  .object({
    show_brand_panel: z.boolean(),
    brand_title: z.string(),
    brand_subtitle: z.string(),
    brand_background_color: z.string(),
    brand_text_color: z.string(),
    brand_image_url: z.string(),
    brand_background_image_url: z.string(),
    brand_ad_image_url: z.string(),
    brand_background_opacity: z.number(),
    brand_logo_padding: z.number(),
  })
  .loose();
const RestEvent = z
  .object({
    id: z.string(),
    namespace: z.string(),
    name: z.string(),
    label: z.string(),
    duration: z.number().int(),
    date: z.number().int(),
    featured: z.boolean(),
    location: z.string(),
    brand: Brand,
    featured_catalogue: FeaturedCatalogue,
    organization: z.string(),
    organization_image_url: z.string().nullable(),
    owner_id: z.string(),
    organization_id: z.string(),
    description: z.string().nullable(),
    category: z.string(),
    categoryImage: z.string().nullable(),
    capacity: z.number().int(),
    coordinates: EventCoordinates.nullable(),
    is_public: z.boolean(),
    is_5g: z.boolean(),
    imageUrl: z.string().nullable(),
    min_price: z.number().nullable(),
    ticket_url: z.string().nullable(),
    ticket_platform: z.string().nullable(),
    map_image_url: z.string().nullable(),
    promo_video_url: z.string().nullable(),
    promo_video_aspect_ratio: z.string().nullable(),
    has_ricoh_stream: z.boolean(),
    payed: z.boolean(),
    invitation_message: z.string().nullable(),
    invitations_only: z.boolean(),
    usersConnected: z.number().int(),
    complete: z.boolean(),
    invitation_accepted: z.boolean(),
    invitation_requested: z.boolean(),
    registered: z.boolean(),
    usersInterestedCount: z.number().int(),
    banned: z.boolean(),
    blocked: z.boolean(),
    opened: z.boolean(),
    pre_access: z.boolean(),
    web_allowed: z.number().int(),
    app_allowed: z.number().int(),
    appUrl: z.string(),
    settings: z.object({}).partial().loose(),
    active: z.boolean(),
    downloads: z.array(z.string()),
  })
  .partial()
  .loose();

// Response wrapper for list endpoint
export const listEventsResponseSchema = z.object({
  total_events: z.number().int(),
  per_page: z.number().int(),
  current_page: z.number().int(),
  events: RestEvent.array(),
});
export type listEventsResponseSchema = z.infer<typeof listEventsResponseSchema>;

export const categoriesResponseSchema = z.object({
  categories: z
    .array(
      z.object({
        category: z.string(),
        image: z.string(),
      }),
    )
    .nullable()
    .default([]),
});
export type categoriesResponseSchema = z.infer<typeof categoriesResponseSchema>;

const WebEvent = RestEvent;

export const webEventsListResponseSchema = z.object({
  data: z.array(WebEvent),
});
export type webEventsListResponseSchema = z.infer<
  typeof webEventsListResponseSchema
>;

export const eventContract = base.prefix("/events").router({
  listEvents: base
    .route({
      path: "/",
    })
    .input(listEventsInputSchema)
    .output(listEventsResponseSchema),
  get: base
    .route({
      path: "/{id}",
    })
    .input(z.object({ id: z.string() }))
    .output(RestEvent),
  listEventsLive: base.input(z.void()).output(eventIterator(eventSchema)),
  listPartialEvents: base
    .input(listEventsInputSchema)
    .output(listEventsResponseSchema),
  webEventsList: base
    .route({
      path: "/web/api/eventsList",
    })
    .input(listEventsInputSchema)
    .output(webEventsListResponseSchema),
  categories: base
    .route({
      path: "/categories",
    })
    .input(z.void())
    .output(categoriesResponseSchema),
});
