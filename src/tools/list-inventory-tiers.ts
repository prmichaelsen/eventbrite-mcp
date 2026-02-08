import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListInventoryTiersTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_inventory_tiers',
      description: `List Inventory Tiers for an Event.

ENDPOINT: GET /events/{event_id}/inventory_tiers/

FILTERS:
- seatmap_number: Filter by tier group
- count_against_event_capacity: Filter by whether tier counts toward capacity

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
          seatmap_number: { type: 'integer', description: 'Filter by tier group' },
          count_against_event_capacity: { type: 'boolean', description: 'Filter by capacity counting' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, seatmap_number, count_against_event_capacity } = args;
    logger.info('Listing inventory tiers', { event_id });
    try {
      const params = new URLSearchParams();
      if (seatmap_number !== undefined) params.append('seatmap_number', seatmap_number.toString());
      if (count_against_event_capacity !== undefined) params.append('count_against_event_capacity', count_against_event_capacity.toString());
      const endpoint = params.toString() ? `/events/${event_id}/inventory_tiers/?${params.toString()}` : `/events/${event_id}/inventory_tiers/`;
      const response = await this.client.get(endpoint);
      logger.info('Inventory tiers retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list inventory tiers', { event_id, error: error.message });
      throw error;
    }
  }
}
