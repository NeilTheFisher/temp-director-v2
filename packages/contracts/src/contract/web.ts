import z from "zod";

import { base } from "./base";

const WebEvent = z
  .object({
    id: z.string(),
    namespace: z.string(),
    name: z.string(),
    label: z.string(),
    duration: z.number().int(),
    date: z.number().int(),
    featured: z.boolean(),
    location: z.string(),
    organization: z.string(),
    organization_image_url: z.string().nullable(),
    owner_id: z.string(),
    organization_id: z.string(),
    description: z.string().nullable(),
    category: z.string(),
    categoryImage: z.string().nullable(),
    capacity: z.number().int(),
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
    active: z.boolean(),
    downloads: z.array(z.string()),
  })
  .partial()
  .loose();

export const webEventsListResponseSchema = z.object({
  data: z.array(WebEvent),
});

export const webContract = base.prefix("/").router({
  webEventsList: base
    .route({
      path: "/web/api/eventsList",
      method: "GET",
    })
    .input(
      z.object({
        category: z.string().optional(),
        date: z.number().optional(),
        location: z.string().optional(),
        per_page: z.number().int().optional(),
        current_page: z.number().int().optional(),
      })
    )
    .output(webEventsListResponseSchema),
});
