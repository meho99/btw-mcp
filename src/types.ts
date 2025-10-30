import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";

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

export type SessionData = {
  apiToken?: string;
  transport: StreamableHTTPServerTransport;
};
