import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import { findHunts } from "../api/find-hunts";
import { parseCrudQuery } from "../parsers";
import { PrismaCrudQuery } from "../types";

export class FindHuntsTool {
  static toolName = "find-hunts" as const;
  static inputSchema = {
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  };

  static register(server: McpServer) {
    server.registerTool(
      this.toolName,
      {
        title: "Find Hunts on Book The Wild",
        description: `Search for hunting packages on Book The Wild. You can filter by date range. To book some hunt, first find available packages using the "get hunt details" tool.`,
        inputSchema: this.inputSchema,
      },
      async ({ dateFrom, dateTo }) => {
        const query: PrismaCrudQuery = { where: {} };

        if (dateFrom) {
          query.where.start_date = {
            equals: new Date(dateFrom).toISOString(),
          };
        }

        if (dateTo) {
          query.where.end_date = { equals: new Date(dateTo).toISOString() };
        }

        const response = await findHunts(parseCrudQuery(query));
        const parsedResponse = await response.json();

        if (!response.ok) {
          return {
            content: [
              {
                type: "text",
                text: `BTW API error: ${response.statusText}`,
              },
            ],
            structuredContent: response.status === 400 ? parsedResponse : {},
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Found ${parsedResponse.totalRecords} hunts`,
            },
          ],
          structuredContent: parsedResponse,
        };
      }
    );
  }
}
