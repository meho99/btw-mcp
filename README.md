# Book The Wild - MCP Server

A comprehensive Model Context Protocol (MCP) server for interacting with Book The Wild hunting platform. This server provides tools for searching hunts, viewing details, booking packages, and managing user authentication with session-based login.

## 🚀 Quick Start

1. **Install dependencies**:

   `npm install`

2. **Run**

   `npm run dev`

## 🔧 Configuration

Create `.env` file:

```bash
PORT=3005
```

## 🎯 Available Tools

The server provides five MCP tools:

### 1. **`find-hunts`** - Search for hunting packages

- **Description**: Search for hunting packages on Book The Wild. You can filter by date range. To book some hunt, first find available packages using the "get hunt details" tool.
- **Parameters**:
  - `dateFrom` (optional) - Start date filter (string)
  - `dateTo` (optional) - End date filter (string)

### 2. **`get-hun-details`** - Get hunt details

- **Description**: Retrieve details for a specific hunt. It includes a list of packages available for booking.
- **Parameters**:
  - `huntId` (required) - The ID of the hunt to retrieve details for (string)

### 3. **`book-package`** - Book a hunting package

- **Description**: Book a selected hunting package on Book The Wild (requires authentication)
- **Parameters**:
  - `bookingDate` (required) - Date for the booking (string)
  - `huntId` (required) - ID of the hunt (string)
  - `packageId` (required) - ID of the package to book (string)
  - `numberOfGuests` (required) - Number of guests for the booking (number)

### 4. **`get-user`** - Get user information

- **Description**: Retrieve information about the currently logged-in user
- **Parameters**: None

### 5. **`log-out`** - Log out user

- **Description**: Log out the currently logged-in user
- **Parameters**: None

## 🔐 Authentication

The server uses session-based authentication for tools that require user authorization (`book-package`, `get-user`, `log-out`).

### Login Process

1. When accessing protected tools without authentication, the server will provide a login URL
2. Navigate to `http://localhost:3005/login?sessionId=<SESSION_ID>`
3. Enter your Book The Wild credentials (email and password)
4. Once logged in, you can use all protected tools within that session

### Session Management

- Each MCP client connection gets a unique session ID
- Login state is maintained per session
- Users can check their login status with the `get-user` tool
- Users can log out using the `log-out` tool

**Note**: The login form uses a mock token for development purposes. In production, this should be replaced with proper OAuth 2.1 flow.

## 📁 Project Structure

```
src/
├── server.ts          # Express server with MCP endpoints
├── session.ts         # Session management and transport handling
├── parsers.ts         # Query parsing utilities
├── types.ts           # TypeScript type definitions
└── tools/             # MCP tool implementations
    ├── index.ts       # Tool registration
    ├── find-hunts.ts  # Hunt search functionality
    ├── get-hunt-details.ts  # Hunt details retrieval
    ├── book-package.ts      # Package booking (auth required)
    ├── get-user.ts          # User info (auth required)
    └── log-out.ts           # User logout (auth required)
```

## 🌐 HTTP Endpoints

### `/mcp` (POST, GET, DELETE)

- **POST**: Main MCP communication endpoint for tool calls
- **GET**: Server-to-client notifications via Server-Sent Events (SSE)
- **DELETE**: Session termination
- **Headers**:
  - `mcp-session-id`: Session identifier for maintaining state
  - `Content-Type: application/json`

### `/login` (GET, POST)

- **GET**: Serves the login form UI
  - Query parameter: `sessionId` - The session ID to authenticate
- **POST**: Processes login credentials
  - Form data: `email`, `password`, `sessionId`
  - Returns success confirmation and mock authentication token

## 🧪 Testing

1. **Start the server**:

   ```bash
   npm run dev
   ```

2. **Server will be available at**: `http://localhost:3005/mcp`

3. **Test authentication flow**:

   - Use MCP client to call `get-user` tool
   - Follow the provided login URL to authenticate
   - Retry the tool call after authentication

4. **Available npm scripts**:
   - `npm run dev` - Development with tsx
   - `npm run dev:watch` - Development with auto-restart
   - `npm run build` - Build TypeScript to JavaScript
   - `npm run start` - Run built JavaScript
   - `npm run start:prod` - Production start

## 🎉 Features

- ✅ Full MCP protocol implementation with streaming HTTP transport
- ✅ Session-based authentication with web login form
- ✅ Five comprehensive tools for hunting package management
- ✅ TypeScript support with proper type definitions
- ✅ Express.js server with proper error handling
- ✅ Development and production build scripts

For production deployment, consider implementing proper OAuth 2.1 flows and secure session management.
