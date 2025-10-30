#!/usr/bin/env node

/**
 * Simple test script for BTW MCP server
 * Usage: node test-auth.js [bearer-token]
 */

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3005";

async function testMCP(token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  console.log(`🧪 Testing ${token ? "with" : "without"} token...`);

  try {
    const response = await fetch(`${SERVER_URL}/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "find hunts",
          arguments: { dateFrom: "2025-11-06", dateTo: "2025-11-12" },
        },
        id: 1,
      }),
    });

    console.log(`Status: ${response.status}`);
    const body = await response.text();
    console.log(
      "Response:",
      body.substring(0, 300) + (body.length > 300 ? "..." : "")
    );
  } catch (error) {
    console.error("Error:", error.message);
  }
  console.log("");
}

async function main() {
  const token = process.argv[2];

  console.log(`🎯 Testing BTW MCP Server at ${SERVER_URL}\n`);

  // Test without auth (should fail)
  await testMCP();

  // Test with auth if token provided
  if (token) {
    await testMCP(token);
  } else {
    console.log("💡 To test with token: node test-auth.js YOUR_BTW_TOKEN");
  }
}

main().catch(console.error);
