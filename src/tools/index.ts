import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { registerBookPackageTool } from "./book-package";
import { registerFindHuntsTool } from "./find-hunts";
import { registerGetUserTool } from "./get-user";
import { registerLogOutTool } from "./log-out";
import { registerGetHuntDetailsTool } from "./get-hunt-details";

export const registerTools = (server: McpServer) => {
  registerFindHuntsTool(server);
  registerBookPackageTool(server);
  registerGetUserTool(server);
  registerLogOutTool(server);
  registerGetHuntDetailsTool(server);
};
