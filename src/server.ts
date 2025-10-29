import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

export type PrismaCrudQuery = {
  where: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">[];
  page?: number;
  pageSize?: number;
  joins?: string[];
  select?: {
    only?: string[];
    except?: string[];
  };
};

export const parseCrudQuery = (query: PrismaCrudQuery): URLSearchParams =>
  new URLSearchParams({
    crudQuery: JSON.stringify(query),
  });

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Add an addition tool
server.registerTool(
  "find hunts",
  {
    title: "Find Hunts on Book The Wild",
    description:
      "This tools looks for huts listing defined in the book the wild page.",
    inputSchema: {
      dateFrom: z.string().optional(),
      dateTo: z.string().optional(),
    },
  },
  async ({ dateFrom, dateTo }) => {
    const query: PrismaCrudQuery = {
      where: {},
    };

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

    const listedHunts = await fetch(url, {
      method: "GET",
    });

    const huntsList = await listedHunts.json();

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

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "3005");
app
  .listen(port, () => {
    console.log(`BTW hunts MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
