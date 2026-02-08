#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { EventbriteClient } from './eventbrite/client.js';
import { EventbriteConfig } from './types/eventbrite.js';
import { ListEventsTool } from './tools/list-events.js';
import { GetEventTool } from './tools/get-event.js';
import { CreateEventTool } from './tools/create-event.js';
import { ListAttendeesTool } from './tools/list-attendees.js';
import { CreateTicketClassTool } from './tools/create-ticket-class.js';
import { logger } from './utils/logger.js';
import { isMCPErrorResponse, formatErrorForDisplay } from './utils/mcp-error-handler.js';

// Load environment variables
config();

class EventbriteMCPServer {
  private server: Server;
  private eventbriteClient: EventbriteClient;
  private listEventsTool: ListEventsTool;
  private getEventTool: GetEventTool;
  private createEventTool: CreateEventTool;
  private listAttendeesTool: ListAttendeesTool;
  private createTicketClassTool: CreateTicketClassTool;

  constructor() {
    // Initialize server
    this.server = new Server(
      {
        name: 'eventbrite-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Eventbrite client
    const apiToken = process.env.EVENTBRITE_API_TOKEN;
    if (!apiToken) {
      throw new Error('EVENTBRITE_API_TOKEN environment variable is required');
    }

    const eventbriteConfig: EventbriteConfig = {
      apiToken,
      apiUrl: process.env.EVENTBRITE_API_URL || 'https://www.eventbriteapi.com/v3',
      timeout: parseInt(process.env.EVENTBRITE_TIMEOUT || '30000'),
      retries: parseInt(process.env.EVENTBRITE_RETRIES || '3')
    };

    this.eventbriteClient = new EventbriteClient(eventbriteConfig);
    this.listEventsTool = new ListEventsTool(this.eventbriteClient);
    this.getEventTool = new GetEventTool(this.eventbriteClient);
    this.createEventTool = new CreateEventTool(this.eventbriteClient);
    this.listAttendeesTool = new ListAttendeesTool(this.eventbriteClient);
    this.createTicketClassTool = new CreateTicketClassTool(this.eventbriteClient);

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          this.listEventsTool.getToolDefinition(),
          this.getEventTool.getToolDefinition(),
          this.createEventTool.getToolDefinition(),
          this.listAttendeesTool.getToolDefinition(),
          this.createTicketClassTool.getToolDefinition()
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        let result: any;
        
        switch (name) {
          case 'list_events':
            result = await this.listEventsTool.execute(args as any);
            break;

          case 'get_event':
            result = await this.getEventTool.execute(args as any);
            break;

          case 'create_event':
            result = await this.createEventTool.execute(args as any);
            break;

          case 'list_attendees':
            result = await this.listAttendeesTool.execute(args as any);
            break;

          case 'create_ticket_class':
            result = await this.createTicketClassTool.execute(args as any);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        // Check if the result is an MCP error response
        if (isMCPErrorResponse(result)) {
          return {
            content: [
              {
                type: 'text',
                text: formatErrorForDisplay(result),
              },
            ],
            isError: true,
          };
        }

        // Check if the tool returned an error response (legacy format)
        if (result.error || !result.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(result, null, 2),
              },
            ],
            isError: true,
          };
        }

        // Normal successful response
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error(`Tool execution failed for ${name}:`, error);
        
        // Format error for MCP client
        const errorMessage = error instanceof Error 
          ? `❌ ${name} failed\n\nError: ${error.name}\nMessage: ${error.message}\n\n${error.stack || ''}`
          : `❌ ${name} failed\n\nUnknown error: ${String(error)}`;
        
        return {
          content: [
            {
              type: 'text',
              text: errorMessage,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting Eventbrite MCP Server...');

      // Start MCP server with stdio transport
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      // Don't log to stdout/stderr when using stdio transport - it interferes with MCP JSON
      // logger.info('Eventbrite MCP Server started successfully');

    } catch (error) {
      // Don't log to stderr when using stdio transport
      // logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    // Don't log when using stdio transport
    // logger.info('Stopping Eventbrite MCP Server...');
    await this.server.close();
    // logger.info('Server stopped');
  }
}

// Handle graceful shutdown
const server = new EventbriteMCPServer();

process.on('SIGINT', async () => {
  await server.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await server.stop();
  process.exit(0);
});

// Start the server
server.start().catch((error) => {
  // Don't log to stderr when using stdio transport
  // logger.error('Server startup failed:', error);
  process.exit(1);
});
