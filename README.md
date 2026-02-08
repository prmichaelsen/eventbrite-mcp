# @prmichaelsen/eventbrite-mcp

An MCP (Model Context Protocol) server that provides event management and ticketing capabilities through the Eventbrite API.

## Features

- **Event Management**: List, create, and retrieve event details
- **Ticket Management**: Create and manage ticket classes
- **Attendee Management**: List and retrieve attendee information
- **Organization Support**: Work with Eventbrite organizations
- **Pagination Support**: Handle large datasets efficiently

## Installation

### Using npx (Recommended)

```bash
npx @prmichaelsen/eventbrite-mcp
```

## Configuration

### Environment Variables

Create a `.env` file in your project root or set the following environment variables:

```bash
# Required
EVENTBRITE_API_TOKEN=your_eventbrite_api_token

# Optional
EVENTBRITE_API_URL=https://www.eventbriteapi.com/v3  # Default API URL
EVENTBRITE_TIMEOUT=30000                              # Request timeout in ms
EVENTBRITE_RETRIES=3                                  # Number of retry attempts
```

### Getting an Eventbrite API Token

1. Go to [Eventbrite API Keys Page](https://www.eventbrite.com/platform/api-keys)
2. Sign in to your Eventbrite account
3. Copy your Private Token
4. Add it to your MCP client configuration (see below)

**Note:** You must create your own Eventbrite OAuth application if you need to access other users' data. For personal use, a private token is sufficient.

### MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop, Kilo Code):

```json
{
  "mcpServers": {
    "eventbrite": {
      "command": "npx",
      "args": ["-y", "@prmichaelsen/eventbrite-mcp"],
      "env": {
        "EVENTBRITE_API_TOKEN": "your_eventbrite_api_token"
      }
    }
  }
}
```

## Available Tools

### list_events

List events from Eventbrite with optional filtering.

**Parameters:**
- `organizationId` (optional): Filter events by organization ID
- `status` (optional): Filter by status (draft, live, started, ended, completed, canceled, all)
- `orderBy` (optional): Order results (start_asc, start_desc, created_asc, created_desc)
- `pageSize` (optional): Number of results per page (1-50, default: 50)
- `continuation` (optional): Pagination token

**Example:**
```typescript
{
  "status": "live",
  "orderBy": "start_asc",
  "pageSize": 10
}
```

### get_event

Get detailed information about a specific event.

**Parameters:**
- `eventId` (required): The ID of the event

**Example:**
```typescript
{
  "eventId": "123456789"
}
```

### create_event

Create a new event on Eventbrite.

**Parameters:**
- `name` (required): Event name
- `startTime` (required): Start time in ISO 8601 format
- `endTime` (required): End time in ISO 8601 format
- `timezone` (required): Timezone (e.g., "America/New_York")
- `currency` (required): Currency code (e.g., "USD")
- `description` (optional): Event description (supports HTML)
- `online` (optional): Whether this is an online event
- `listed` (optional): Whether to list publicly
- `capacity` (optional): Maximum capacity
- `organizationId` (optional): Organization ID

**Example:**
```typescript
{
  "name": "Tech Conference 2024",
  "description": "Annual technology conference",
  "startTime": "2024-12-31T09:00:00",
  "endTime": "2024-12-31T17:00:00",
  "timezone": "America/New_York",
  "currency": "USD",
  "online": false,
  "listed": true,
  "capacity": 500
}
```

### create_ticket_class

Create a ticket class for an event.

**Parameters:**
- `eventId` (required): The event ID
- `name` (required): Ticket class name
- `quantityTotal` (required): Total tickets available
- `free` (optional): Whether the ticket is free
- `cost` (optional): Ticket cost in minor units (e.g., cents)
- `currency` (optional): Currency code
- `description` (optional): Ticket description
- `salesStart` (optional): Sales start time (ISO 8601)
- `salesEnd` (optional): Sales end time (ISO 8601)

**Example:**
```typescript
{
  "eventId": "123456789",
  "name": "General Admission",
  "quantityTotal": 100,
  "free": false,
  "cost": 5000,
  "currency": "USD",
  "description": "Standard entry ticket"
}
```

### list_attendees

List attendees for a specific event.

**Parameters:**
- `eventId` (required): The event ID
- `status` (optional): Filter by status (attending, not_attending, unpaid)
- `pageSize` (optional): Results per page (1-50, default: 50)
- `continuation` (optional): Pagination token

**Example:**
```typescript
{
  "eventId": "123456789",
  "status": "attending",
  "pageSize": 50
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/prmichaelsen/eventbrite-mcp.git
cd eventbrite-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with watch
npm run watch
```

### Project Structure

```
eventbrite-mcp/
├── src/
│   ├── server.ts              # Main MCP server
│   ├── eventbrite/
│   │   └── client.ts          # Eventbrite API client
│   ├── tools/                 # MCP tool implementations
│   │   ├── list-events.ts
│   │   ├── get-event.ts
│   │   ├── create-event.ts
│   │   ├── create-ticket-class.ts
│   │   └── list-attendees.ts
│   ├── types/                 # TypeScript type definitions
│   │   ├── eventbrite.ts
│   │   └── mcp.ts
│   └── utils/                 # Utility functions
│       ├── logger.ts
│       └── error-serializer.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Testing

```bash
npm test
```

### Building

```bash
npm run build
```

## License

MIT

## Author

Patrick Michaelsen

## Links

- [Eventbrite API Documentation](https://www.eventbrite.com/platform/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub Repository](https://github.com/prmichaelsen/eventbrite-mcp)
