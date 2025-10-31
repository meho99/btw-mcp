import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import { sessions } from "../session";

export const registerBookPackageTool = (server: McpServer) => {
  server.registerTool(
    "book package",
    {
      title: "Book Package",
      description: "Book a selected hunting package on Book The Wild",
      inputSchema: {
        bookingDate: z.string(),
      },
    },
    async ({ bookingDate }, { sessionId }) => {
      if (!sessionId || !sessions[sessionId] || !sessions[sessionId].apiToken) {
        return {
          content: [
            {
              type: "text",
              text: `Error: User unauthorized. Please go to http://localhost:3005/login?sessionId=${sessionId} to log in.`,
            },
          ],
        };
      }

      const url = `https://new-api.dev.bookthewild.com/api/bookings-customer`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessions[sessionId].apiToken}`,
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
            content: [{ type: "text", text: `BTW API error` }],
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
