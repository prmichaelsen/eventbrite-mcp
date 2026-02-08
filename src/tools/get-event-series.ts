import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetEventSeriesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_event_series',
      description: `Retrieve parent Event Series by ID.

ENDPOINT: GET /series/{event_series_id}/

Event Series is repeating Event with multiple dates.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_series_id: { type: 'string', description: 'Event Series ID (required)' }
        },
        required: ['event_series_id']
      }
    };
  }

  async execute(args: { event_series_id: string }): Promise<any> {
    const { event_series_id } = args;
    logger.info('Getting event series', { event_series_id });
    try {
      const response = await this.client.get(`/series/${event_series_id}/`);
      logger.info('Event series retrieved successfully', { event_series_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get event series', { event_series_id, error: error.message });
      throw error;
    }
  }
}
