import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteInventoryTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_inventory_tier',
      description: `Delete an Inventory Tier.

ENDPOINT: DELETE /events/{event_id}/inventory_tiers/{inventory_tier_id}/

ERRORS (400):
- HAS_ATTENDEES: Cannot delete if purchased by attendees
- IS_STARTED_AFTER: Another ticket starts when this ends
- LAST_TICKET: Cannot delete last ticket while event live
- HAS_SEAT_ASSIGNMENTS: Cannot delete if seats still assigned

ERRORS (403):
- NOT_AUTHORIZED

ERRORS (404):
- NOT_FOUND: Event or tier doesn't exist

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
    logger.info('Deleting inventory tier', { event_id, inventory_tier_id });
    try {
      const response = await this.client.delete(`/events/${event_id}/inventory_tiers/${inventory_tier_id}/`);
      logger.info('Inventory tier deleted successfully', { event_id, inventory_tier_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete inventory tier', { event_id, inventory_tier_id, error: error.message });
      throw error;
    }
  }
}
