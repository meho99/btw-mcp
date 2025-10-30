# BTW Hunts Finder - MCP Server

A simple MCP server that searches for hunting packages on Book The Wild.

## 🚀 Quick Start

1. **Set your API token**:

   ```bash
   export BTW_ACCESS_TOKEN="your_book_the_wild_api_token"
   ```

2. **Install and run**:

   ```bash
   npm install
   npm run dev
   ```

3. **Test it**:
   ```bash
   node test-auth.js your_token_here
   ```

## 🔧 Configuration

Create `.env` file:

```bash
BTW_ACCESS_TOKEN=your_btw_api_bearer_token
PORT=3005
```

## 🎯 Usage

The server provides one tool:

- **`find_hunts`** - Search for hunting packages
  - `dateFrom` (optional) - Start date filter
  - `dateTo` (optional) - End date filter

## 🔐 Authorization

### Option 1: Environment Token (Simple)

Set `BTW_ACCESS_TOKEN` in your environment or `.env` file.

### Option 2: Bearer Token (MCP Client)

MCP clients can send `Authorization: Bearer <token>` header.

## 📁 Files

```
src/
├── server.ts      # Main MCP server
├── find-hunts.ts  # Hunt search tool
├── auth.ts        # Simple auth middleware
├── session.ts     # Session management
├── parsers.ts     # Query parsing
└── types.ts       # Type definitions
```

## 🧪 Testing

Run the server:

```bash
npm run dev
```

Test without auth (should fail):

```bash
curl -X POST http://localhost:3005/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"find hunts"},"id":1}'
```

Test with token:

```bash
curl -X POST http://localhost:3005/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"find hunts"},"id":1}'
```

## 🎉 That's It!

Simple, minimal MCP server with basic bearer token auth. For production, implement proper OAuth 2.1 flows as needed.
