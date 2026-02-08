import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateInventoryTierTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_inventory_tier',
      description: `Create a new Inventory Tier for an Event.

ENDPOINT: POST /events/{event_id}/inventory_tiers/

Max 100 tiers per event.

ERRORS (400):
- EXCEED_MAXIMUM_INVENTORY_TIERS: Cannot create more than 100 tiers
- EXCEED_MAXIMUM_TICKET_RULE_TICKETS: Ticket rule tickets cannot exceed 1000
- ARGUMENTS_ERROR

ERRORS (403):
- NOT_AUTHORIZED

ERRORS (404):
- NOT_FOUND: Event doesn't exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          name: { type: 'string', description: 'Tier name' },
          capacity_total: { type: 'integer', description: 'Total capacity' },
          quantity_total: { type: 'integer', description: 'Total quantity' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...tierData } = args;
    logger.info('Creating inventory tier', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/inventory_tiers/`, { inventory_tier: tierData });
      logger.info('Inventory tier created successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create inventory tier', { event_id, error: error.message });
      throw error;
    }
  }
}
