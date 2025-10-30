import { Request, Response } from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { SessionData } from "./types";

// Map to store transports by session ID
export const sessions: {
  [sessionId: string]: SessionData;
} = {};

export const getOrCreateSessionTransport = async (
  server: McpServer,
  req: Request
): Promise<SessionData | undefined> => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  if (sessionId && sessions[sessionId]) {
    console.log("Reusing existing transport for session ID:", sessionId);
    // Reuse existing transport
    return sessions[sessionId];
  }

  if (!sessionId && isInitializeRequest(req.body)) {
    console.log("Creating new transport for initialization request");
    // New initialization request
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (newSessionId) => {
        console.log("Session initialized with ID:", newSessionId);
        // Store the transport by session ID

        sessions[newSessionId] = { transport };
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: false,
      // allowedHosts: ['127.0.0.1', 'localhost'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        console.log("Cleaning up session:", transport.sessionId);
        delete sessions[transport.sessionId];
      }
    };

    // Connect to the MCP server
    await server.connect(transport);

    return { transport };
  }

  console.log("No valid session or initialize request");
  return undefined;
};

export const handleSessionRequest = async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  console.log("HANDLE SESSION REQ", sessionId, sessions, req.headers);
  if (!sessionId || !sessions[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }

  const transport = sessions[sessionId].transport;
  await transport.handleRequest(req, res);
};
