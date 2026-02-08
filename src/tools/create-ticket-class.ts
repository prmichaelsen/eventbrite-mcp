import { EventbriteClient } from '../eventbrite/client.js';
import { CreateTicketClassArgs, TicketClassResult } from '../types/mcp.js';

export class CreateTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_ticket_class',
      description: 'Create a new ticket class for an event',
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'The ID of the event'
          },
          name: {
            type: 'string',
            description: 'The name of the ticket class'
          },
          quantityTotal: {
            type: 'number',
            description: 'Total quantity of tickets available'
          },
          free: {
            type: 'boolean',
            description: 'Whether the ticket is free'
          },
          cost: {
            type: 'number',
            description: 'Cost of the ticket (in minor currency units, e.g., cents)'
          },
          currency: {
            type: 'string',
            description: 'Currency code (e.g., USD, EUR, GBP)'
          },
          description: {
            type: 'string',
            description: 'Description of the ticket class'
          },
          salesStart: {
            type: 'string',
            description: 'When ticket sales start (ISO 8601 format)'
          },
          salesEnd: {
            type: 'string',
            description: 'When ticket sales end (ISO 8601 format)'
          }
        },
        required: ['eventId', 'name', 'quantityTotal']
      }
    };
  }

  async execute(args: CreateTicketClassArgs): Promise<TicketClassResult> {
    try {
      const ticketData: any = {
        name: args.name,
        quantity_total: args.quantityTotal,
        free: args.free !== undefined ? args.free : true
      };

      if (args.cost !== undefined && args.currency) {
        ticketData.cost = {
          currency: args.currency,
          value: args.cost
        };
        ticketData.free = false;
      }

      if (args.description) {
        ticketData.description = args.description;
      }

      if (args.salesStart) {
        ticketData.sales_start = args.salesStart;
      }

      if (args.salesEnd) {
        ticketData.sales_end = args.salesEnd;
      }

      const ticketClass = await this.client.createTicketClass(args.eventId, ticketData);

      return {
        success: true,
        ticketClass
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
