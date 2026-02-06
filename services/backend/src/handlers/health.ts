import type { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

/**
 * Health check endpoint
 * GET /api/health
 */
export const handler: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || "0.1.0",
      }),
    };
  };
