import z from "zod";
import { FindHuntsTool } from "./find-hunts";
import { CallToolResult } from "@modelcontextprotocol/sdk/types";

export type Tools = {
  [FindHuntsTool.toolName]: {
    params: z.objectOutputType<
      (typeof FindHuntsTool)["inputSchema"],
      z.ZodTypeAny
    >;
    result: CallToolResult;
  };
};
