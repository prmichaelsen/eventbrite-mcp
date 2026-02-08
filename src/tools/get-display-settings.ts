import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetDisplaySettingsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_display_settings',
      description: `Retrieve Display Settings for an Event.

ENDPOINT: GET /events/{event_id}/display_settings/

Display Settings control how Event appears on Event Listing page.

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
    logger.info('Getting display settings', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/display_settings/`);
      logger.info('Display settings retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get display settings', { event_id, error: error.message });
      throw error;
    }
  }
}
