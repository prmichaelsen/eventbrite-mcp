import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateTicketBuyerSettingsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_ticket_buyer_settings',
      description: `Update Ticket Buyer Settings for an Event.

ENDPOINT: POST /events/{event_id}/ticket_buyer_settings/

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
          event_id: { type: 'string', description: 'Event ID (required)' },
          ticket_buyer_settings: { type: 'object', description: 'Settings object' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...settings } = args;
    logger.info('Updating ticket buyer settings', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/ticket_buyer_settings/`, { ticket_buyer_settings: settings });
      logger.info('Ticket buyer settings updated successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update ticket buyer settings', { event_id, error: error.message });
      throw error;
    }
  }
}
