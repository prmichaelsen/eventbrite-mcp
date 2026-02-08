import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListTicketClassesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_ticket_classes',
      description: 'List all ticket classes for an event. Returns a paginated list of ticket classes with details including name, description, cost, fee, capacity, quantity_sold, sales dates, hidden status, and delivery methods. Useful for viewing all ticket types available for an event.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'The ID of the event to list ticket classes for'
          },
          pos: {
            type: 'string',
            description: 'Filter by point of sale (optional). Options: online, at_the_door, lock_box'
          }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string; pos?: string }): Promise<any> {
    const { event_id, pos } = args;

    logger.info('Listing ticket classes', { event_id, pos });

    try {
      let endpoint = `/events/${event_id}/ticket_classes/`;
      if (pos) {
        endpoint += `?pos=${encodeURIComponent(pos)}`;
      }

      const response = await this.client.get(endpoint);

      logger.info('Ticket classes retrieved successfully', {
        event_id,
        count: (response as any).ticket_classes?.length
      });
      return response;
    } catch (error: any) {
      logger.error('Failed to list ticket classes', { event_id, error: error.message });
      throw error;
    }
  }
}
