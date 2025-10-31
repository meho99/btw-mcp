import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";

export const registerBookPackageTool = (server: McpServer) => {
  server.registerTool(
    "book package",
    {
      title: "Book Package",
      description: "Book a selecting hunting package on Book The Wild",
      inputSchema: {
        bookingDate: z.string(),
        apiToken: z.string().optional(),
      },
    },
    async ({ bookingDate, apiToken }, { requestInfo }) => {
      // Get token from environment (set by user or auth middleware)
      console.log("btwToken", apiToken);

      console.log("Using BTW token:", apiToken);

      if (!apiToken) {
        return {
          content: [
            {
              type: "text",
              text: `Error: No API token provided. Please log in first. Please go to http://localhost:3005/login?sessionId=${requestInfo?.headers["mcp-session-id"]}`,
            },
          ],
        };
      }

      const url = `https://new-api.dev.bookthewild.com/api/bookings-customer`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDate: new Date(bookingDate).toISOString(),
        }),
      });

      const parsedResponse = await response.json();

      if (!response.ok) {
        console.log("BTW API ERROR response:", response);
        if (response.status === 400) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Bad Request - ${
                  parsedResponse.message || "Unknown error"
                }`,
              },
            ],
            structuredContent: { error: parsedResponse },
          };
        }
        throw new Error(
          `BTW API error: ${response.status} ${response.statusText}`
        );
      }

      return {
        content: [
          {
            type: "text",
            text: `Successfully booked package on ${bookingDate}. Booking ID: ${parsedResponse.id}`,
          },
        ],
        structuredContent: parsedResponse,
      };
    }
  );
};
