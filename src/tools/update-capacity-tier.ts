import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateCapacityTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_capacity_tier',
      description: `Update capacity tier for an event.

ENDPOINT: POST /events/{event_id}/capacity_tier/

Supports partial updates. Can create/update/delete GA capacity hold inventory tiers.

ERRORS (400):
- ARGUMENTS_ERROR, HAS_ATTENDEES, CAPACITY_TOTAL_TOO_SMALL, HOLD_QUANTITIES_EXCEEDS_REMAINING_CAPACITY

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
          capacity_total: { type: 'integer', description: 'Total capacity' },
          holds: { type: 'array', description: 'Hold inventory tiers' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...tierData } = args;
    logger.info('Updating capacity tier', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/capacity_tier/`, { capacity_tier: tierData });
      logger.info('Capacity tier updated successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update capacity tier', { event_id, error: error.message });
      throw error;
    }
  }
}
