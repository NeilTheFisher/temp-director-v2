import z from "zod";

import { base } from "./base";

// Full user info response schema (mirrors director-api UserService.getUserInfo)
export const userInfoResponseSchema = z.object({
  user_id: z.number(),
  group_id: z.bigint().nullable(),
  name: z.string().nullable(),
  email: z.string(),
  emails: z.array(z.string()),
  avatar: z.string().nullable(),
  msisdn: z.string().nullable(),
  image_uid: z.string().nullable(),
  account_type: z.number().int(),
  pns_settings: z.object({
    pns_event_created: z.boolean(),
    pns_event_updated: z.boolean(),
    pns_event_registered: z.boolean(),
    pns_event_mention: z.boolean(),
  }),
  usersReported: z.array(z.string()),
  usersBlocked: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullable(),
      avatar: z.string().nullable(),
      sip: z.string(),
      type: z.string(),
    })
  ),
  usersBlockedBy: z.array(z.string().nullable()),
  roles: z.object({
    super_admin: z.boolean(),
    organizations: z.record(z.string(), z.array(z.string())),
  }),
});

// Minimal user info by msisdn response (mirrors director-api UserService.getUserInfoByMsisdn)
export const userInfoByMsisdnResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  type: z.string(),
  role: z.string(),
  sip: z.string(),
});

export const userContract = base.prefix("/api").router({
  getUserInfo: base
    .route({
      path: "/getUserInfo",
      method: "GET",
    })
    .input(z.unknown())
    .output(userInfoResponseSchema),
  getUserInfoByMsisdn: base
    .route({
      path: "/getUserInfoByMsisdn/{msisdn}",
      method: "GET",
    })
    .input(
      z.object({
        msisdn: z.string(),
      })
    )
    .output(userInfoByMsisdnResponseSchema),
});
