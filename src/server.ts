import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import { registerFindHuntsTool } from "./find-hunts";
import {
  getOrCreateSessionTransport,
  handleSessionRequest,
  sessions,
} from "./session";
import { registerBookPackageTool } from "./book-package";

const app = express();
app.use(express.json());

// MCP endpoint with optional auth
app.post("/mcp", async (req, res) => {
  try {
    // Log incoming MCP request
    console.log("=== Incoming MCP Request ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Method:", req.body?.method || "unknown");
    console.log("Headers:", req.headers["mcp-session-id"]);
    if (req.body?.params) {
      console.log("Parameters:", JSON.stringify(req.body.params, null, 2));
    }
    console.log("=== End Request Log ===\n");

    const session = await getOrCreateSessionTransport(req);
    if (!session) {
      console.log("Failed to create or find session");
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: Unable to establish session",
        },
        id: req.body?.id || null,
      });
      return;
    }

    const { transport, apiToken } = session;

    if (req.body.params?.arguments) {
      req.body.params.arguments.apiToken = apiToken;
    }

    console.log("server connected", req.body);

    // Handle the request with the transport
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    res.status(500).json({
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: "Internal error",
      },
      id: req.body?.id || null,
    });
  }
});

app.get("/login", (_req, res) => {
  const sessionId = _req.query.sessionId as string;

  console.log("Serving login form for session ID:", sessionId);

  res.send(`
    <form method="POST" action="/login">
      <input name="username" placeholder="username"/>
      <input name="password" placeholder="password" type="password"/>
      <input type="hidden" name="sessionId" value="${sessionId}"/>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  const { username, sessionId } = req.body;

  const fakeToken = `eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyOTc0MSwicm9sZSI6ImN1c3RvbWVyIn0.R3xhdX5jbUGu0ZhUr0LXm32h8VB0AN4jlbpClmI7MdI`;

  if (!sessions[sessionId]) {
    res.status(400).send("Invalid session ID");
  }
  sessions[sessionId].apiToken = fakeToken;

  console.log("User logged in:", username, "for session ID:", sessionId);

  res.send(`
    <p>Login successful for user: ${username}</p>
    <p>You can now return to the chat interface.</p>
  `);
});

// Handle GET requests for server-to-client notifications via SSE
app.get("/mcp", handleSessionRequest);

// Handle DELETE requests for session termination
app.delete("/mcp", handleSessionRequest);

const port = parseInt(process.env.PORT || "3005");

app
  .listen(port, () => {
    console.log(`BTW hunts MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
