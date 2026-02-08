import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListSeatMapsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_seat_maps',
      description: `List Seat Maps by Organization.

ENDPOINT: GET /organizations/{organization_id}/seatmaps/

PARAMETERS:
- venue_id: Filter by venue
- venue_name_filter: Filter by venue name substring

WARNING: Response not paginated yet, will be paginated soon.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          venue_id: { type: 'string', description: 'Venue ID filter' },
          venue_name_filter: { type: 'string', description: 'Venue name filter' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, venue_id, venue_name_filter } = args;
    logger.info('Listing seat maps', { organization_id });
    try {
      const params = new URLSearchParams();
      if (venue_id) params.append('venue_id', venue_id);
      if (venue_name_filter) params.append('venue_name_filter', venue_name_filter);
      const endpoint = params.toString() ? `/organizations/${organization_id}/seatmaps/?${params.toString()}` : `/organizations/${organization_id}/seatmaps/`;
      const response = await this.client.get(endpoint);
      logger.info('Seat maps retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list seat maps', { organization_id, error: error.message });
      throw error;
    }
  }
}
