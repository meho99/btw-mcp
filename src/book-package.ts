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
        btwToken: z.string().optional(),
      },
    },
    async ({ bookingDate, btwToken }, { requestInfo }) => {
      // Get token from environment (set by user or auth middleware)
      console.log("btwToken", btwToken);

      console.log("Using BTW token:", btwToken);

      if (!btwToken) {
        return {
          content: [
            {
              type: "text",
              text: `Error: No API token provided. Please log in first. Please go to /login?sessionId=${requestInfo?.headers["mcp-session-id"]}`,
            },
          ],
        };
      }

      const url = `https://new-api.dev.bookthewild.com/api/bookings-customer`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${btwToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingDate,
        }),
      });

      if (!response.ok) {
        console.log("BTW API ERROR response:", response);
        throw new Error(
          `BTW API error: ${response.status} ${response.statusText}`
        );
      }

      const addedBooking = await response.json();

      return {
        content: [
          {
            type: "text",
            text: `Successfully booked package on ${bookingDate}. Booking ID: ${addedBooking.id}`,
          },
        ],
        structuredContent: addedBooking,
      };
    }
  );
};
