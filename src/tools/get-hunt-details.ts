import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";

export const registerGetHuntDetailsTool = (server: McpServer) => {
  server.registerTool(
    "get-hun-details",
    {
      title: "Get Hunt Details",
      description:
        "Retrieve details for a specific hunt. It includes a list of packages available for booking.",
      inputSchema: {
        huntId: z.string(),
      },
    },
    async ({ huntId }) => {
      const response = await fetch(
        `https://new-api.dev.bookthewild.com/api/hunts/${huntId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `BTW API error: ${response.status} ${response.statusText}`
        );
      }

      const huntDetails = await response.json();

      return {
        content: [
          {
            type: "text",
            text: `Found details for the Hunt: ${huntDetails.title}. It has ${huntDetails.packages.length} packages available for booking.`,
          },
        ],
        structuredContent: huntDetails,
      };
    }
  );
};
