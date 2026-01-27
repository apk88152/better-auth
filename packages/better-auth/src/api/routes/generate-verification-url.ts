import type { BetterAuthOptions } from "@better-auth/core";
import { createAuthEndpoint } from "@better-auth/core/api";
import type { AdditionalUserFieldsInput } from "../../types";
import { APIError, BASE_ERROR_CODES } from "@better-auth/core/error";
import * as z from "zod";

const verificationUrlBody = z.object({
  email: z.email().min(1),
  callbackURL: z.string(),
  newUserCallbackURL: z.string(),
  errorCallbackURL: z.string(),
});

export const generateVerificationUrl = createAuthEndpoint(
  "/generate-verification-url",
  {
    method: "POST",
    operationId: "generate-verification-url",
    body: verificationUrlBody,
    metadata: {
      $Infer: {
        body: {} as {
          email: string;
          callbackURL: string | undefined;
          newUserCallbackURL: string | undefined;
          errorCallbackURL: string | undefined;
        },
      },
      openapi: {
        operationId: "generate-verification-url",
        description: "Generate a verification URL",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "The email of the user",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      $ref: "#/components/schemas/User",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  async (ctx) => {
    const body = ctx.body as {
      email: string;
      callbackURL: string | undefined;
      newUserCallbackURL: string | undefined;
      errorCallbackURL: string | undefined;
    };

    if (typeof body !== "object" || Array.isArray(body)) {
      throw new APIError("BAD_REQUEST", {
        message: "Body must be an object",
      });
    }

    if (!body.email) {
      throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_REQUIRED);
    }

    const { email, callbackURL, newUserCallbackURL, errorCallbackURL } = body;
    const session = ctx.context.session;

    return ctx.json({
      status: true,
    });
  },
);
