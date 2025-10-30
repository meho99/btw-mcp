#!/usr/bin/env node

/**
 * Direct API test for the simplified BTW MCP server
 */

const SERVER_URL = "http://localhost:3005";

async function testDirectCall() {
  console.log("🧪 Testing direct MCP call with session...");

  try {
    const response = await fetch(`${SERVER_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_token_123",
        "mcp-session-id": "test-session-123",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "test-client", version: "1.0.0" },
        },
        id: 1,
      }),
    });

    console.log(`Status: ${response.status}`);
    const body = await response.text();
    console.log("Response:", body);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function testFindHunts() {
  console.log("\n🎯 Testing find hunts tool...");

  try {
    const response = await fetch(`${SERVER_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test_token_123",
        "mcp-session-id": "test-session-123",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "find hunts",
          arguments: {
            dateFrom: "2025-11-06",
            dateTo: "2025-11-12",
          },
        },
        id: 2,
      }),
    });

    console.log(`Status: ${response.status}`);
    const body = await response.text();
    console.log(
      "Response:",
      body.substring(0, 500) + (body.length > 500 ? "..." : "")
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function main() {
  console.log("🎯 Testing Simplified BTW MCP Server\n");

  await testDirectCall();
  await testFindHunts();

  console.log("\n✅ Tests completed!");
  console.log(
    "💡 Note: Set BTW_ACCESS_TOKEN environment variable for real API calls"
  );
}

main().catch(console.error);
