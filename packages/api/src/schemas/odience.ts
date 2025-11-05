import { z } from "zod";

export const OdienceProvisionInputSchema = z.object({
  msisdn: z.string(),
  country_code: z.string().optional(),
});

export const OdienceProvisionOutputSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const ValidatePhoneNumberInputSchema = z.object({
  msisdn: z.string(),
  country_code: z.string().optional(),
});

export const ValidatePhoneNumberOutputSchema = z.object({
  valid: z.boolean(),
  formatted: z.string(),
  country_code: z.string(),
  error: z.string().optional(),
  code: z.number(),
});

export const CategoryListOutputSchema = z.record(z.string(), z.string());
