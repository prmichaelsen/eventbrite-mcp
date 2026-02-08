import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_ticket_class',
      description: 'Retrieve a specific ticket class by event ID and ticket class ID. Returns detailed information about the ticket class including pricing, capacity, sales dates, and settings.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'The ID of the event'
          },
          ticket_class_id: {
            type: 'string',
            description: 'The ID of the ticket class to retrieve'
          }
        },
        required: ['event_id', 'ticket_class_id']
      }
    };
  }

  async execute(args: { event_id: string; ticket_class_id: string }): Promise<any> {
    const { event_id, ticket_class_id } = args;

    logger.info('Retrieving ticket class', { event_id, ticket_class_id });

    try {
      const response = await this.client.get(`/events/${event_id}/ticket_classes/${ticket_class_id}/`);

      logger.info('Ticket class retrieved successfully', { event_id, ticket_class_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve ticket class', { event_id, ticket_class_id, error: error.message });
      throw error;
    }
  }
}
