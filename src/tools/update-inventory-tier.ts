import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateInventoryTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_inventory_tier',
      description: `Update an Inventory Tier by ID.

ENDPOINT: POST /events/{event_id}/inventory_tiers/{inventory_tier_id}/

Supports partial updates.

ERRORS (400):
- ARGUMENTS_ERROR
- HOLD_QUANTITIES_EXCEEDS_CAPACITY_TOTAL: Sum of hold quantities must be less than capacity_total

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
          inventory_tier_id: { type: 'string', description: 'Inventory Tier ID (required)' },
          name: { type: 'string', description: 'Tier name' },
          capacity_total: { type: 'integer', description: 'Total capacity' },
          quantity_total: { type: 'integer', description: 'Total quantity' }
        },
        required: ['event_id', 'inventory_tier_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, inventory_tier_id, ...tierData } = args;
    logger.info('Updating inventory tier', { event_id, inventory_tier_id });
    try {
      const response = await this.client.post(`/events/${event_id}/inventory_tiers/${inventory_tier_id}/`, { inventory_tier: tierData });
      logger.info('Inventory tier updated successfully', { event_id, inventory_tier_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update inventory tier', { event_id, inventory_tier_id, error: error.message });
      throw error;
    }
  }
}
