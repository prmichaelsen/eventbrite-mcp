# @prmichaelsen/eventbrite-mcp

An MCP (Model Context Protocol) server that provides comprehensive event management and ticketing capabilities through the Eventbrite API v3.

> Note: Not every tool in this repository has been tested. Ticket creation workflow is supported. If other tools fail, please create an issue for that tool.

## Features

- **Event Management**: Create, update, publish, delete, cancel, and copy events
- **Ticket Management**: Create, update, and manage ticket classes
- **Order Management**: Retrieve and list orders
- **Attendee Management**: Get and list attendee information
- **Organization Support**: Manage organizations, venues, and members
- **Discount Management**: Create and manage discount codes
- **Media & Content**: Upload media and manage structured content
- **Webhooks**: Create and manage webhooks
- **Categories & Formats**: Access event categories and formats
- **Inventory Management**: Manage inventory tiers
- **And more**: 42 tools total - see [`./src/tools`](./src/tools) for complete list

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

## Tool Examples

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

### update_event

Update an existing event by event ID. Supports partial updates.

**Parameters:**
- `event_id` (required): Event ID
- `name` (optional): Event name object with html property
- `summary` (optional): Event summary
- `start` (optional): Start datetime with timezone and utc
- `end` (optional): End datetime with timezone and utc
- `currency` (optional): Currency code
- `online_event` (optional): Is online only
- `listed` (optional): Publicly searchable
- Plus 20+ additional optional fields

**Example:**
```typescript
{
  "event_id": "123456789",
  "name": { "html": "Updated Conference Name" },
  "summary": "New event description",
  "listed": true
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

### publish_event

Publish an event to make it live and available for ticket sales.

**Parameters:**
- `event_id` (required): Event ID

**Example:**
```typescript
{
  "event_id": "123456789"
}
```

## All Available Tools

For a complete list of all 42 supported tools, please see [`./src/tools`](./src/tools) directory.

**Tool Categories:**
- Events (9 tools)
- Tickets (4 tools)
- Orders (2 tools)
- Attendees (2 tools)
- Organizations (3 tools)
- Venues (4 tools)
- Discounts (5 tools)
- Categories & Formats (6 tools)
- Webhooks (3 tools)
- Media & Content (4 tools)
- Inventory Tiers (5 tools)
- Display Settings (2 tools)
- Questions (3 tools)
- User (1 tool)
- API Documentation (1 tool)

## Using as a Library

### Option 1: MCP-Auth Integration (Multi-Tenant)

For multi-tenant applications using [@prmichaelsen/mcp-auth](https://github.com/prmichaelsen/mcp-auth):

```typescript
import { createEventbriteServer } from '@prmichaelsen/eventbrite-mcp/factory';
import { wrapServer } from '@prmichaelsen/mcp-auth';

const wrappedServer = wrapServer({
  serverFactory: (accessToken: string, userId: string) => {
    return createEventbriteServer(accessToken, userId);
  },
  authProvider: new FirebaseAuthProvider({ projectId: 'your-project' }),
  tokenResolver: new PlatformTokenResolver({
    platformUrl: 'https://your-platform.com',
    serviceToken: process.env.PLATFORM_SERVICE_TOKEN
  }),
  resourceType: 'eventbrite',
  transport: { type: 'sse', port: 8080, basePath: '/mcp' }
});

await wrappedServer.start();
```

### Option 2: Individual Tool Usage (OpenAI Agents)

Import and use individual tools in your applications:

```typescript
import { CreateEventTool, EventbriteClient, EventbriteConfig } from '@prmichaelsen/eventbrite-mcp';

// Configure the Eventbrite client
const config: EventbriteConfig = {
  apiToken: process.env.EVENTBRITE_API_TOKEN!, // Required
  apiUrl: 'https://www.eventbriteapi.com/v3',
  timeout: 30000,
  retries: 3
};

const client = new EventbriteClient(config);
const createEventTool = new CreateEventTool(client);

// Use the tool
const result = await createEventTool.execute({
  name: "My Event",
  startTime: "2024-12-31T09:00:00",
  endTime: "2024-12-31T17:00:00",
  timezone: "America/New_York",
  currency: "USD"
});
```

**Environment Variables Required:**
- `EVENTBRITE_API_TOKEN`: Your Eventbrite API token (required)

All 57 tool classes and the `createServer` factory function are exported. See [`src/index.ts`](src/index.ts) for the complete list of exports.

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
│   ├── tools/                 # MCP tool implementations (42 tools)
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── agent/                     # Development documentation
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
