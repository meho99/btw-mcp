import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import z from "zod";
import { parseCrudQuery } from "../parsers";
import { PrismaCrudQuery } from "../types";

export const registerFindHuntsTool = (server: McpServer) => {
  server.registerTool(
    "find hunts",
    {
      title: "Find Hunts on Book The Wild",
      description: "Search for hunting packages on Book The Wild",
      inputSchema: {
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      },
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

      const url = `https://new-api.dev.bookthewild.com/api/hunts-view?${parseCrudQuery(
        query
      )}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `BTW API error: ${response.status} ${response.statusText}`
        );
      }

      const huntsList = await response.json();

      return {
        content: [
          {
            type: "text",
            text: `Found ${huntsList.totalRecords} hunts`,
          },
        ],
        structuredContent: huntsList,
      };
    }
  );
};
