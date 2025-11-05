import { ORPCError } from "@orpc/server";
import { pub } from "../orpc";

// TODO: Import your actual services when they're available
// import { OdienceService } from "../services/OdienceService";
// import { S3Service } from "../services/S3Service";
// import { validateAndFormatPhoneNumber } from "../utils/utils";

// const odienceService = new OdienceService();
// const s3Service = new S3Service();

export const odienceRouter = {
  provisionUser: pub.odience.provisionUser.handler(async ({ input }) => {
    console.log("OdienceController.odience:");
    const rawMsisdn = (input as Record<string, string>).msisdn;

    try {
      // TODO: Replace with actual service calls
      // const objResponse = await odienceService.provisionUser(req, res, rawMsisdn);
      // return objResponse;

      // Temporary placeholder
      return {
        code: 200,
        message: "User provisioned successfully (placeholder)",
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
      const { msisdn, country_code } = input as Record<
        string,
        string | undefined
      >;
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

      // TODO: Replace with actual validation logic
      // const objResponse = await validateAndFormatPhoneNumber(msisdn, country_code);
      // if ((objResponse.code || 0) !== 200) {
      //   throw new ORPCError("BAD_REQUEST", {
      //     message: objResponse.error || "Invalid phone number"
      //   });
      // }
      // return objResponse;

      // Temporary placeholder
      return {
        valid: true,
        formatted: msisdn,
        country_code: country_code || "US",
        code: 200,
      };
    },
  ),

  getCategoryList: pub.odience.getCategoryList.handler(async () => {
    const categories = [
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
    ];

    try {
      // TODO: Replace with actual S3 service calls
      // const categoryUrlMap = new Map(
      //   categories.map(category => [
      //     category,
      //     s3Service.getUrlFromPath("tags/" + category + ".png")
      //   ])
      // );
      // return Object.fromEntries(categoryUrlMap);

      // Temporary placeholder - return mock URLs
      const categoryUrlMap: Record<string, string> = {};
      for (const category of categories) {
        categoryUrlMap[category] = `https://example.com/tags/${category}.png`;
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
