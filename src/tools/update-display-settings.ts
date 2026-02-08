import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateDisplaySettingsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_display_settings',
      description: `Update Display Settings for an Event.

ENDPOINT: POST /events/{event_id}/display_settings/

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          display_settings: { type: 'object', description: 'Display settings object' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...settings } = args;
    logger.info('Updating display settings', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/display_settings/`, { display_settings: settings });
      logger.info('Display settings updated successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update display settings', { event_id, error: error.message });
      throw error;
    }
  }
}
