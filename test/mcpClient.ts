import { Client } from "@modelcontextprotocol/sdk/client/index";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { createTestServer } from "./testServer";
import { Tools } from "../src/tools/types";

export class ExtendedClient extends Client {
  async callTypedTool<Name extends keyof Tools>(
    toolName: Name,
    params: Tools[Name]["params"]
  ): Promise<Tools[Name]["result"]> {
    return this.callTool({
      name: toolName,
      arguments: params,
    });
  }

  private serverCleanup?: () => Promise<void>;

  setServerCleanup(cleanup: () => Promise<void>) {
    this.serverCleanup = cleanup;
  }

  async close(): Promise<void> {
    // Close the client connection first
    await super.close();

    // Then clean up the dedicated server instance
    if (this.serverCleanup) {
      await this.serverCleanup();
    }
  }
}

export const establishMcpServerAndClient =
  async (): Promise<ExtendedClient> => {
    // Create a new isolated server instance for this client
    const { port, close } = await createTestServer();

    const client = new ExtendedClient({
      name: "btw-hunts-finder-test-client",
      version: "1.0.0",
    });

    // Set up server cleanup for this specific instance
    client.setServerCleanup(close);

    const transport = new StreamableHTTPClientTransport(
      new URL(`http://localhost:${port}/mcp`),
      {}
    );

    await client.connect(transport);

    return client;
  };
