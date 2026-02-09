import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetTicketBuyerSettingsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_ticket_buyer_settings',
      description: `Retrieve Ticket Buyer Settings by Event.

ENDPOINT: GET /events/{event_id}/ticket_buyer_settings/

Settings for ticket buyers: confirmation message, instructions, refund requests, attendee updates, survey info.

ERRORS (400):
- FIELD_INVALID

ERRORS (403):
- NOT_AUTHORIZED

ERRORS (404):
- NOT_FOUND

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
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
    logger.info('Getting ticket buyer settings', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/ticket_buyer_settings/`);
      logger.info('Ticket buyer settings retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get ticket buyer settings', { event_id, error: error.message });
      throw error;
    }
  }
}
