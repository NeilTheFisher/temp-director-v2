import { z } from "zod";

export const Update = z.any();
export type Update = z.infer<typeof Update>;
