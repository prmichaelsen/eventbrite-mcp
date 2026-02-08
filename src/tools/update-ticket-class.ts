import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_ticket_class',
      description: 'Update an existing ticket class for an event. Supports partial updates. After May 7, 2020, inventory_tier_id is required for tiered events. Returns the updated ticket class object with fields like name, description, cost, fee, capacity, quantity_sold, sales dates, and various display settings.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'The ID of the event'
          },
          ticket_class_id: {
            type: 'string',
            description: 'The ID of the ticket class to update'
          },
          name: {
            type: 'string',
            description: 'Ticket class name'
          },
          description: {
            type: 'string',
            description: 'Ticket class description'
          },
          quantity_total: {
            type: 'integer',
            description: 'Total number of tickets available'
          },
          cost: {
            type: 'string',
            description: 'Ticket cost in format "CURRENCY,amount_in_cents" (e.g., "USD,1000" for $10.00)'
          },
          free: {
            type: 'boolean',
            description: 'Whether the ticket is free'
          },
          donation: {
            type: 'boolean',
            description: 'Whether this is a donation ticket'
          },
          minimum_quantity: {
            type: 'integer',
            description: 'Minimum number of tickets per order'
          },
          maximum_quantity: {
            type: 'integer',
            description: 'Maximum number of tickets per order'
          },
          sales_start: {
            type: 'string',
            description: 'When ticket sales start (ISO 8601 datetime)'
          },
          sales_end: {
            type: 'string',
            description: 'When ticket sales end (ISO 8601 datetime)'
          },
          sales_start_after: {
            type: 'string',
            description: 'ID of ticket class that triggers sales start when it sells out'
          },
          hidden: {
            type: 'boolean',
            description: 'Whether the ticket class is hidden from public'
          },
          auto_hide: {
            type: 'boolean',
            description: 'Whether to auto-hide when not on sale'
          },
          auto_hide_before: {
            type: 'string',
            description: 'Override auto-hide before this datetime'
          },
          auto_hide_after: {
            type: 'string',
            description: 'Override auto-hide after this datetime'
          },
          include_fee: {
            type: 'boolean',
            description: 'Whether to include fee in displayed price'
          },
          hide_description: {
            type: 'boolean',
            description: 'Whether to hide description on listing page'
          },
          hide_sale_dates: {
            type: 'boolean',
            description: 'Whether to hide sale dates on event page'
          },
          delivery_methods: {
            type: 'array',
            items: { type: 'string' },
            description: 'Delivery methods: electronic, will_call, standard_shipping, third_party_shipping'
          },
          inventory_tier_id: {
            type: 'string',
            description: 'ID of inventory tier (required for tiered events)'
          },
          order_confirmation_message: {
            type: 'string',
            description: 'Message shown when order is completed'
          },
          secondary_assignment_enabled: {
            type: 'boolean',
            description: 'Whether secondary barcode assignment is enabled (e.g., RFID)'
          }
        },
        required: ['event_id', 'ticket_class_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ticket_class_id, ...updateData } = args;

    logger.info('Updating ticket class', { event_id, ticket_class_id, fields: Object.keys(updateData) });

    try {
      const response = await this.client.post(`/events/${event_id}/ticket_classes/${ticket_class_id}/`, {
        ticket_class: updateData
      });

      logger.info('Ticket class updated successfully', { event_id, ticket_class_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update ticket class', { event_id, ticket_class_id, error: error.message });
      throw error;
    }
  }
}
