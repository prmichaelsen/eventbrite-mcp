import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetCapacityTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_capacity_tier',
      description: `Retrieve capacity tier for an event.

ENDPOINT: GET /events/{event_id}/capacity_tier/

Capacity tier for GA holds against event capacity (not tiered inventory).

ERRORS (403):
- NOT_AUTHORIZED

ERRORS (404):
- NOT_FOUND: Event doesn't exist

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
    logger.info('Getting capacity tier', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/capacity_tier/`);
      logger.info('Capacity tier retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get capacity tier', { event_id, error: error.message });
      throw error;
    }
  }
}
