import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListTicketClassesForSaleTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_ticket_classes_for_sale',
      description: `List ticket classes for sale (purchase flow). Supports promo codes and hold IDs.

ENDPOINT: GET /events/{event_id}/ticket_classes/for_sale/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string }): Promise<any> {
    const { event_id } = args;
    logger.info('Listing ticket classes for sale', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/ticket_classes/for_sale/`);
      logger.info('Ticket classes for sale retrieved', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list ticket classes for sale', { event_id, error: error.message });
      throw error;
    }
  }
}
