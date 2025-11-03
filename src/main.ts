import { createApp } from "./server";

const app = createApp();
const port = parseInt(process.env.PORT || "3005");

app
  .listen(port, () => {
    console.log(`BTW hunts MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", error => {
    console.error("Server error:", error);
    process.exit(1);
  });
