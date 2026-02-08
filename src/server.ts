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
import { UpdateEventTool } from './tools/update-event.js';
import { PublishEventTool } from './tools/publish-event.js';
import { UnpublishEventTool } from './tools/unpublish-event.js';
import { DeleteEventTool } from './tools/delete-event.js';
import { CancelEventTool } from './tools/cancel-event.js';
import { CopyEventTool } from './tools/copy-event.js';
import { ListAttendeesTool } from './tools/list-attendees.js';
import { GetAttendeeTool } from './tools/get-attendee.js';
import { CreateTicketClassTool } from './tools/create-ticket-class.js';
import { GetTicketClassTool } from './tools/get-ticket-class.js';
import { UpdateTicketClassTool } from './tools/update-ticket-class.js';
import { ListTicketClassesTool } from './tools/list-ticket-classes.js';
import { GetOrderTool } from './tools/get-order.js';
import { ListOrdersTool } from './tools/list-orders.js';
import { ListOrganizationsTool } from './tools/list-organizations.js';
import { GetCategoryTool } from './tools/get-category.js';
import { ListCategoriesTool } from './tools/list-categories.js';
import { GetSubcategoryTool } from './tools/get-subcategory.js';
import { ListSubcategoriesTool } from './tools/list-subcategories.js';
import { GetFormatTool } from './tools/get-format.js';
import { ListFormatsTool } from './tools/list-formats.js';
import { GetDiscountTool } from './tools/get-discount.js';
import { CreateDiscountTool } from './tools/create-discount.js';
import { UpdateDiscountTool } from './tools/update-discount.js';
import { ListDiscountsTool } from './tools/list-discounts.js';
import { DeleteDiscountTool } from './tools/delete-discount.js';
import { GetVenueTool } from './tools/get-venue.js';
import { CreateVenueTool } from './tools/create-venue.js';
import { UpdateVenueTool } from './tools/update-venue.js';
import { ListVenuesTool } from './tools/list-venues.js';
import { CreateWebhookTool } from './tools/create-webhook.js';
import { ListWebhooksTool } from './tools/list-webhooks.js';
import { DeleteWebhookTool } from './tools/delete-webhook.js';
import { GetMediaTool } from './tools/get-media.js';
import { UploadMediaTool } from './tools/upload-media.js';
import { GetStructuredContentTool } from './tools/get-structured-content.js';
import { SetStructuredContentTool } from './tools/set-structured-content.js';
import { GetInventoryTierTool } from './tools/get-inventory-tier.js';
import { CreateInventoryTierTool } from './tools/create-inventory-tier.js';
import { ListInventoryTiersTool } from './tools/list-inventory-tiers.js';
import { UpdateInventoryTierTool } from './tools/update-inventory-tier.js';
import { DeleteInventoryTierTool } from './tools/delete-inventory-tier.js';
import { GetUserTool } from './tools/get-user.js';
import { GetOrganizationTool } from './tools/get-organization.js';
import { ListOrganizationMembersTool } from './tools/list-organization-members.js';
import { GetDisplaySettingsTool } from './tools/get-display-settings.js';
import { UpdateDisplaySettingsTool } from './tools/update-display-settings.js';
import { GetEventDescriptionTool } from './tools/get-event-description.js';
import { GetSalesReportTool } from './tools/get-sales-report.js';
import { GetAttendeeReportTool } from './tools/get-attendee-report.js';
import { GetCapacityTierTool } from './tools/get-capacity-tier.js';
import { UpdateCapacityTierTool } from './tools/update-capacity-tier.js';
import { GetEventSeriesTool } from './tools/get-event-series.js';
import { ListEventsBySeriesTool } from './tools/list-events-by-series.js';
import { CreateEventScheduleTool } from './tools/create-event-schedule.js';
import { ListSeatMapsTool } from './tools/list-seat-maps.js';
import { CreateSeatMapTool } from './tools/create-seat-map.js';
import { GetApiDocsTool } from './tools/get-api-docs.js';
import { logger } from './utils/logger.js';
import { isMCPErrorResponse, formatErrorForDisplay } from './utils/mcp-error-handler.js';

// Load environment variables
config();

// Tool interface for type safety
interface MCPTool {
  getToolDefinition(): any;
  execute(args: any): Promise<any>;
}

class EventbriteMCPServer {
  private server: Server;
  private eventbriteClient: EventbriteClient;
  private tools: Map<string, MCPTool>;

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
    
    // Initialize tool registry
    this.tools = new Map();
    this.registerTools();

    this.setupHandlers();
  }

  private registerTools(): void {
    // Register all tools in the registry
    
    // Organization tools
    this.tools.set('list_organizations', new ListOrganizationsTool(this.eventbriteClient));
    
    // Event tools
    this.tools.set('list_events', new ListEventsTool(this.eventbriteClient));
    this.tools.set('get_event', new GetEventTool(this.eventbriteClient));
    this.tools.set('create_event', new CreateEventTool(this.eventbriteClient));
    this.tools.set('update_event', new UpdateEventTool(this.eventbriteClient));
    this.tools.set('publish_event', new PublishEventTool(this.eventbriteClient));
    this.tools.set('unpublish_event', new UnpublishEventTool(this.eventbriteClient));
    this.tools.set('delete_event', new DeleteEventTool(this.eventbriteClient));
    this.tools.set('cancel_event', new CancelEventTool(this.eventbriteClient));
    this.tools.set('copy_event', new CopyEventTool(this.eventbriteClient));
    
    // Attendee tools
    this.tools.set('list_attendees', new ListAttendeesTool(this.eventbriteClient));
    this.tools.set('get_attendee', new GetAttendeeTool(this.eventbriteClient));
    
    // Ticket class tools
    this.tools.set('create_ticket_class', new CreateTicketClassTool(this.eventbriteClient));
    this.tools.set('get_ticket_class', new GetTicketClassTool(this.eventbriteClient));
    this.tools.set('update_ticket_class', new UpdateTicketClassTool(this.eventbriteClient));
    this.tools.set('list_ticket_classes', new ListTicketClassesTool(this.eventbriteClient));
    
    // Order tools
    this.tools.set('get_order', new GetOrderTool(this.eventbriteClient));
    this.tools.set('list_orders', new ListOrdersTool(this.eventbriteClient));
    
    // Category tools
    this.tools.set('get_category', new GetCategoryTool(this.eventbriteClient));
    this.tools.set('list_categories', new ListCategoriesTool(this.eventbriteClient));
    this.tools.set('get_subcategory', new GetSubcategoryTool(this.eventbriteClient));
    this.tools.set('list_subcategories', new ListSubcategoriesTool(this.eventbriteClient));
    
    // Format tools
    this.tools.set('get_format', new GetFormatTool(this.eventbriteClient));
    this.tools.set('list_formats', new ListFormatsTool(this.eventbriteClient));
    
    // Discount tools
    this.tools.set('get_discount', new GetDiscountTool(this.eventbriteClient));
    this.tools.set('create_discount', new CreateDiscountTool(this.eventbriteClient));
    this.tools.set('update_discount', new UpdateDiscountTool(this.eventbriteClient));
    this.tools.set('list_discounts', new ListDiscountsTool(this.eventbriteClient));
    this.tools.set('delete_discount', new DeleteDiscountTool(this.eventbriteClient));
    
    // Venue tools
    this.tools.set('get_venue', new GetVenueTool(this.eventbriteClient));
    this.tools.set('create_venue', new CreateVenueTool(this.eventbriteClient));
    this.tools.set('update_venue', new UpdateVenueTool(this.eventbriteClient));
    this.tools.set('list_venues', new ListVenuesTool(this.eventbriteClient));
    
    // Webhook tools
    this.tools.set('create_webhook', new CreateWebhookTool(this.eventbriteClient));
    this.tools.set('list_webhooks', new ListWebhooksTool(this.eventbriteClient));
    this.tools.set('delete_webhook', new DeleteWebhookTool(this.eventbriteClient));
    
    // Media tools
    this.tools.set('get_media', new GetMediaTool(this.eventbriteClient));
    this.tools.set('upload_media', new UploadMediaTool(this.eventbriteClient));
    
    // Structured content tools
    this.tools.set('get_structured_content', new GetStructuredContentTool(this.eventbriteClient));
    this.tools.set('set_structured_content', new SetStructuredContentTool(this.eventbriteClient));
    
    // Inventory tier tools
    this.tools.set('get_inventory_tier', new GetInventoryTierTool(this.eventbriteClient));
    this.tools.set('create_inventory_tier', new CreateInventoryTierTool(this.eventbriteClient));
    this.tools.set('list_inventory_tiers', new ListInventoryTiersTool(this.eventbriteClient));
    this.tools.set('update_inventory_tier', new UpdateInventoryTierTool(this.eventbriteClient));
    this.tools.set('delete_inventory_tier', new DeleteInventoryTierTool(this.eventbriteClient));
    
    // User tools
    this.tools.set('get_user', new GetUserTool(this.eventbriteClient));
    
    // Organization tools (additional)
    this.tools.set('get_organization', new GetOrganizationTool(this.eventbriteClient));
    this.tools.set('list_organization_members', new ListOrganizationMembersTool(this.eventbriteClient));
    
    // Display settings tools
    this.tools.set('get_display_settings', new GetDisplaySettingsTool(this.eventbriteClient));
    this.tools.set('update_display_settings', new UpdateDisplaySettingsTool(this.eventbriteClient));
    
    // Event description tools
    this.tools.set('get_event_description', new GetEventDescriptionTool(this.eventbriteClient));
    
    // Report tools
    this.tools.set('get_sales_report', new GetSalesReportTool(this.eventbriteClient));
    this.tools.set('get_attendee_report', new GetAttendeeReportTool(this.eventbriteClient));
    
    // Capacity tier tools
    this.tools.set('get_capacity_tier', new GetCapacityTierTool(this.eventbriteClient));
    this.tools.set('update_capacity_tier', new UpdateCapacityTierTool(this.eventbriteClient));
    
    // Event series tools
    this.tools.set('get_event_series', new GetEventSeriesTool(this.eventbriteClient));
    this.tools.set('list_events_by_series', new ListEventsBySeriesTool(this.eventbriteClient));
    this.tools.set('create_event_schedule', new CreateEventScheduleTool(this.eventbriteClient));
    
    // Seat map tools
    this.tools.set('list_seat_maps', new ListSeatMapsTool(this.eventbriteClient));
    this.tools.set('create_seat_map', new CreateSeatMapTool(this.eventbriteClient));
    
    // API documentation
    this.tools.set('get_api_docs', new GetApiDocsTool());
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolDefinitions = Array.from(this.tools.values()).map(tool => 
        tool.getToolDefinition()
      );
      
      return {
        tools: toolDefinitions,
      };
    });

    // Handle tool calls with automatic error handling
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Get tool from registry
        const tool = this.tools.get(name);
        if (!tool) {
          throw new Error(`Unknown tool: ${name}`);
        }

        // Execute tool
        const result = await tool.execute(args as any);

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
