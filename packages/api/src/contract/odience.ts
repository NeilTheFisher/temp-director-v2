import { oc } from "@orpc/contract";
import {
  CategoryListOutputSchema,
  OdienceProvisionInputSchema,
  OdienceProvisionOutputSchema,
  ValidatePhoneNumberInputSchema,
  ValidatePhoneNumberOutputSchema,
} from "../schemas/odience";

export const odienceContract = {
  provisionUser: oc
    .input(OdienceProvisionInputSchema)
    .output(OdienceProvisionOutputSchema),
  validatePhoneNumber: oc
    .input(ValidatePhoneNumberInputSchema)
    .output(ValidatePhoneNumberOutputSchema),
  getCategoryList: oc.output(CategoryListOutputSchema),
};
