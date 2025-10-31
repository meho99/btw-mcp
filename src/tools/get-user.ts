import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { sessions } from "../session";

export const registerGetUserTool = (server: McpServer) => {
  server.registerTool(
    "get user",
    {
      title: "Get User Information",
      description: "Retrieve information about the logged-in user",
      inputSchema: {},
    },
    async ({}, { sessionId }) => {
      if (!sessionId || !sessions[sessionId]) {
        return {
          content: [
            {
              type: "text",
              text: `Error: No active session found.`,
            },
          ],
        };
      }

      if (!sessions[sessionId].loginEmail) {
        return {
          content: [
            {
              type: "text",
              text: `Error: User unauthorized. Please go to http://localhost:3005/login?sessionId=${sessionId} to log in.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Logged in user email: ${sessions[sessionId].loginEmail}. Do you want to log out?`,
          },
        ],
      };
    }
  );
};
