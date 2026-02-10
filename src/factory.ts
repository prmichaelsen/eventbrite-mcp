import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { EventbriteClient } from './eventbrite/client.js';
import { EventbriteConfig } from './types/eventbrite.js';
import { ListOrganizationsTool } from './tools/list-organizations.js';
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
import { GetMediaUploadTool } from './tools/get-media-upload.js';
import { GetStructuredContentTool } from './tools/get-structured-content.js';
import { SetStructuredContentTool } from './tools/set-structured-content.js';
import { GetInventoryTierTool } from './tools/get-inventory-tier.js';
import { CreateInventoryTierTool } from './tools/create-inventory-tier.js';
import { CreateMultipleInventoryTiersTool } from './tools/create-multiple-inventory-tiers.js';
import { UpdateMultipleInventoryTiersTool } from './tools/update-multiple-inventory-tiers.js';
import { ListInventoryTiersTool } from './tools/list-inventory-tiers.js';
import { UpdateInventoryTierTool } from './tools/update-inventory-tier.js';
import { DeleteInventoryTierTool } from './tools/delete-inventory-tier.js';
import { GetUserTool } from './tools/get-user.js';
import { GetCurrentUserTool } from './tools/get-current-user.js';
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
import { GetTicketBuyerSettingsTool } from './tools/get-ticket-buyer-settings.js';
import { UpdateTicketBuyerSettingsTool } from './tools/update-ticket-buyer-settings.js';
import { ListDefaultQuestionsTool } from './tools/list-default-questions.js';
import { GetDefaultQuestionTool } from './tools/get-default-question.js';
import { CreateDefaultQuestionTool } from './tools/create-default-question.js';
import { UpdateDefaultQuestionTool } from './tools/update-default-question.js';
import { DeleteDefaultQuestionTool } from './tools/delete-default-question.js';
import { ListCustomQuestionsTool } from './tools/list-custom-questions.js';
import { CreateCustomQuestionTool } from './tools/create-custom-question.js';
import { GetCustomQuestionTool } from './tools/get-custom-question.js';
import { DeleteCustomQuestionTool } from './tools/delete-custom-question.js';
import { GetTextOverridesTool } from './tools/get-text-overrides.js';
import { CreateTextOverridesTool } from './tools/create-text-overrides.js';
import { CalculateItemPricingTool } from './tools/calculate-item-pricing.js';
import { ListFeeRatesTool } from './tools/list-fee-rates.js';
import { ListOrganizationRolesTool } from './tools/list-organization-roles.js';
import { GetApiDocsTool } from './tools/get-api-docs.js';
import { logger } from './utils/logger.js';
import { isMCPErrorResponse, formatErrorForDisplay } from './utils/mcp-error-handler.js';

interface MCPTool {
  getToolDefinition(): any;
  execute(args: any): Promise<any>;
}

/**
 * Factory function that creates an Eventbrite MCP server instance
 * Compatible with @prmichaelsen/mcp-auth for multi-tenant usage
 * 
 * @param accessToken - Eventbrite API access token
 * @param config - Optional additional configuration
 * @returns Configured MCP Server instance
 */
export function createServer(accessToken: string, config?: Partial<EventbriteConfig>): Server {
  const server = new Server(
    {
      name: 'eventbrite-mcp-server',
      version: '0.2.8',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  const eventbriteConfig: EventbriteConfig = {
    apiToken: accessToken,
    apiUrl: config?.apiUrl || 'https://www.eventbriteapi.com/v3',
    timeout: config?.timeout || 30000,
    retries: config?.retries || 3
  };

  const eventbriteClient = new EventbriteClient(eventbriteConfig);
  const tools = new Map<string, MCPTool>();

  // Register all tools
  tools.set('list_organizations', new ListOrganizationsTool(eventbriteClient));
  tools.set('list_events', new ListEventsTool(eventbriteClient));
  tools.set('get_event', new GetEventTool(eventbriteClient));
  tools.set('create_event', new CreateEventTool(eventbriteClient));
  tools.set('update_event', new UpdateEventTool(eventbriteClient));
  tools.set('publish_event', new PublishEventTool(eventbriteClient));
  tools.set('unpublish_event', new UnpublishEventTool(eventbriteClient));
  tools.set('delete_event', new DeleteEventTool(eventbriteClient));
  tools.set('cancel_event', new CancelEventTool(eventbriteClient));
  tools.set('copy_event', new CopyEventTool(eventbriteClient));
  tools.set('list_attendees', new ListAttendeesTool(eventbriteClient));
  tools.set('get_attendee', new GetAttendeeTool(eventbriteClient));
  tools.set('create_ticket_class', new CreateTicketClassTool(eventbriteClient));
  tools.set('get_ticket_class', new GetTicketClassTool(eventbriteClient));
  tools.set('update_ticket_class', new UpdateTicketClassTool(eventbriteClient));
  tools.set('list_ticket_classes', new ListTicketClassesTool(eventbriteClient));
  tools.set('get_order', new GetOrderTool(eventbriteClient));
  tools.set('list_orders', new ListOrdersTool(eventbriteClient));
  tools.set('get_category', new GetCategoryTool(eventbriteClient));
  tools.set('list_categories', new ListCategoriesTool(eventbriteClient));
  tools.set('get_subcategory', new GetSubcategoryTool(eventbriteClient));
  tools.set('list_subcategories', new ListSubcategoriesTool(eventbriteClient));
  tools.set('get_format', new GetFormatTool(eventbriteClient));
  tools.set('list_formats', new ListFormatsTool(eventbriteClient));
  tools.set('get_discount', new GetDiscountTool(eventbriteClient));
  tools.set('create_discount', new CreateDiscountTool(eventbriteClient));
  tools.set('update_discount', new UpdateDiscountTool(eventbriteClient));
  tools.set('list_discounts', new ListDiscountsTool(eventbriteClient));
  tools.set('delete_discount', new DeleteDiscountTool(eventbriteClient));
  tools.set('get_venue', new GetVenueTool(eventbriteClient));
  tools.set('create_venue', new CreateVenueTool(eventbriteClient));
  tools.set('update_venue', new UpdateVenueTool(eventbriteClient));
  tools.set('list_venues', new ListVenuesTool(eventbriteClient));
  tools.set('create_webhook', new CreateWebhookTool(eventbriteClient));
  tools.set('list_webhooks', new ListWebhooksTool(eventbriteClient));
  tools.set('delete_webhook', new DeleteWebhookTool(eventbriteClient));
  tools.set('get_media', new GetMediaTool(eventbriteClient));
  tools.set('upload_media', new UploadMediaTool(eventbriteClient));
  tools.set('get_media_upload', new GetMediaUploadTool(eventbriteClient));
  tools.set('get_structured_content', new GetStructuredContentTool(eventbriteClient));
  tools.set('set_structured_content', new SetStructuredContentTool(eventbriteClient));
  tools.set('get_inventory_tier', new GetInventoryTierTool(eventbriteClient));
  tools.set('create_inventory_tier', new CreateInventoryTierTool(eventbriteClient));
  tools.set('create_multiple_inventory_tiers', new CreateMultipleInventoryTiersTool(eventbriteClient));
  tools.set('update_multiple_inventory_tiers', new UpdateMultipleInventoryTiersTool(eventbriteClient));
  tools.set('list_inventory_tiers', new ListInventoryTiersTool(eventbriteClient));
  tools.set('update_inventory_tier', new UpdateInventoryTierTool(eventbriteClient));
  tools.set('delete_inventory_tier', new DeleteInventoryTierTool(eventbriteClient));
  tools.set('get_user', new GetUserTool(eventbriteClient));
  tools.set('get_current_user', new GetCurrentUserTool(eventbriteClient));
  tools.set('get_organization', new GetOrganizationTool(eventbriteClient));
  tools.set('list_organization_members', new ListOrganizationMembersTool(eventbriteClient));
  tools.set('get_display_settings', new GetDisplaySettingsTool(eventbriteClient));
  tools.set('update_display_settings', new UpdateDisplaySettingsTool(eventbriteClient));
  tools.set('get_event_description', new GetEventDescriptionTool(eventbriteClient));
  tools.set('get_sales_report', new GetSalesReportTool(eventbriteClient));
  tools.set('get_attendee_report', new GetAttendeeReportTool(eventbriteClient));
  tools.set('get_capacity_tier', new GetCapacityTierTool(eventbriteClient));
  tools.set('update_capacity_tier', new UpdateCapacityTierTool(eventbriteClient));
  tools.set('get_event_series', new GetEventSeriesTool(eventbriteClient));
  tools.set('list_events_by_series', new ListEventsBySeriesTool(eventbriteClient));
  tools.set('create_event_schedule', new CreateEventScheduleTool(eventbriteClient));
  tools.set('list_seat_maps', new ListSeatMapsTool(eventbriteClient));
  tools.set('create_seat_map', new CreateSeatMapTool(eventbriteClient));
  tools.set('get_ticket_buyer_settings', new GetTicketBuyerSettingsTool(eventbriteClient));
  tools.set('update_ticket_buyer_settings', new UpdateTicketBuyerSettingsTool(eventbriteClient));
  tools.set('list_default_questions', new ListDefaultQuestionsTool(eventbriteClient));
  tools.set('get_default_question', new GetDefaultQuestionTool(eventbriteClient));
  tools.set('create_default_question', new CreateDefaultQuestionTool(eventbriteClient));
  tools.set('update_default_question', new UpdateDefaultQuestionTool(eventbriteClient));
  tools.set('delete_default_question', new DeleteDefaultQuestionTool(eventbriteClient));
  tools.set('list_custom_questions', new ListCustomQuestionsTool(eventbriteClient));
  tools.set('create_custom_question', new CreateCustomQuestionTool(eventbriteClient));
  tools.set('get_custom_question', new GetCustomQuestionTool(eventbriteClient));
  tools.set('delete_custom_question', new DeleteCustomQuestionTool(eventbriteClient));
  tools.set('get_text_overrides', new GetTextOverridesTool(eventbriteClient));
  tools.set('create_text_overrides', new CreateTextOverridesTool(eventbriteClient));
  tools.set('calculate_item_pricing', new CalculateItemPricingTool(eventbriteClient));
  tools.set('list_fee_rates', new ListFeeRatesTool(eventbriteClient));
  tools.set('list_organization_roles', new ListOrganizationRolesTool(eventbriteClient));
  tools.set('get_api_docs', new GetApiDocsTool());

  // Setup handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const toolDefinitions = Array.from(tools.values()).map(tool => 
      tool.getToolDefinition()
    );
    return { tools: toolDefinitions };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const tool = tools.get(name);
      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      const result = await tool.execute(args as any);

      if (isMCPErrorResponse(result)) {
        return {
          content: [{ type: 'text', text: formatErrorForDisplay(result) }],
          isError: true,
        };
      }

      if (result.error || !result.success) {
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: true,
        };
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      logger.error(`Tool execution failed for ${name}:`, error);
      const errorMessage = error instanceof Error 
        ? `❌ ${name} failed\n\nError: ${error.name}\nMessage: ${error.message}\n\n${error.stack || ''}`
        : `❌ ${name} failed\n\nUnknown error: ${String(error)}`;
      
      return {
        content: [{ type: 'text', text: errorMessage }],
        isError: true,
      };
    }
  });

  return server;
}
