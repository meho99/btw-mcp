import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { sessions } from "../session";

export const registerLogOutTool = (server: McpServer) => {
  server.registerTool(
    "log out",
    {
      title: "Log Out User",
      description: "Log out the currently logged-in user",
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
              text: `Error: No user is currently logged in.`,
            },
          ],
        };
      }

      // Log out the user by clearing the loginEmail and apiToken
      sessions[sessionId].loginEmail = undefined;
      sessions[sessionId].apiToken = undefined;

      return {
        content: [
          {
            type: "text",
            text: `User has been successfully logged out.`,
          },
        ],
      };
    }
  );
};
