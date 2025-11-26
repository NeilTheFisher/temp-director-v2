import { env } from "@director_v2/config";
import { ORPCError } from "@orpc/server";
import * as odienceService from "../lib/services/odience";
import { validateAndFormatPhoneNumber } from "../lib/utils/phone-validation";
import { pub } from "../orpc";

const CATEGORY_LIST = [
  "concert",
  "sport",
  "shopping",
  "gaming",
  "entertainment",
  "collaboration",
  "conference",
  "simulation",
  "museum",
  "travel",
  "bingo",
  "interview",
  "location",
  "personal",
  "activities",
  "assistant",
];

export const odienceRouter = {
  provisionUser: pub.odience.provisionUser.handler(async ({ input }) => {
    console.log("OdienceController.odience:");
    const rawMsisdn = input.msisdn;

    try {
      const objResponse = await odienceService.provisionUser(
        rawMsisdn,
        input.country_code || "",
      );
      return {
        code: objResponse.code,
        message: objResponse.message || "",
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `OdienceController.odience: for msisdn: ${
          rawMsisdn || ""
        }, error => ${errorMessage}`,
      );
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `OdienceController.odience. msisdn: ${
          rawMsisdn || ""
        } failed with error: ${errorMessage}`,
      });
    }
  }),

  validatePhoneNumber: pub.odience.validatePhoneNumber.handler(
    async ({ input }) => {
      const { msisdn, country_code } = input;
      console.log(
        `OdienceController.validatePhoneNumber: msisdn: ${msisdn || ""}`,
      );

      if (!msisdn) {
        throw new ORPCError("BAD_REQUEST", {
          message: `OdienceController.validatePhoneNumber. msisdn: ${
            msisdn || ""
          } country_code: ${
            country_code || ""
          } failed with error: missing request params`,
        });
      }

      const objResponse = await validateAndFormatPhoneNumber(
        msisdn,
        country_code,
      );

      if (objResponse.code !== 200) {
        throw new ORPCError("BAD_REQUEST", {
          message: objResponse.error || "Invalid phone number",
        });
      }

      return objResponse;
    },
  ),

  getCategoryList: pub.odience.getCategoryList.handler(async () => {
    try {
      // Generate S3 URLs for each category
      const categoryUrlMap: Record<string, string> = {};
      for (const category of CATEGORY_LIST) {
        categoryUrlMap[category] = `${env.AWS_URL}/tags/${category}.png`;
      }
      return categoryUrlMap;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error(
        `OdienceController.getCategoryList: error => ${errorMessage}`,
      );
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: `OdienceController.getCategoryList: failed with error: ${errorMessage}`,
      });
    }
  }),
};
