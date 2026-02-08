import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetInventoryTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_inventory_tier',
      description: `Retrieve an Inventory Tier by ID for an Event.

ENDPOINT: GET /events/{event_id}/inventory_tiers/{inventory_tier_id}/

Inventory Tier controls capacity across multiple tickets. Supports GA holds.

ERRORS (403):
- NOT_AUTHORIZED

ERRORS (404):
- NOT_FOUND: Event or inventory_tier_id doesn't exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          inventory_tier_id: { type: 'string', description: 'Inventory Tier ID (required)' }
        },
        required: ['event_id', 'inventory_tier_id']
      }
    };
  }

  async execute(args: { event_id: string; inventory_tier_id: string }): Promise<any> {
    const { event_id, inventory_tier_id } = args;
    logger.info('Retrieving inventory tier', { event_id, inventory_tier_id });
    try {
      const response = await this.client.get(`/events/${event_id}/inventory_tiers/${inventory_tier_id}/`);
      logger.info('Inventory tier retrieved successfully', { event_id, inventory_tier_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve inventory tier', { event_id, inventory_tier_id, error: error.message });
      throw error;
    }
  }
}
