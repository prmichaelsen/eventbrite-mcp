import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateVenueTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_venue',
      description: `Update a Venue by ID.

ENDPOINT: POST /venues/{venue_id}/

VENUE FIELDS (all optional for update):
- name (string): Venue name
- address (object): Address
- age_restriction (string): Age restriction
- capacity (number): Max capacity

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          venue_id: { type: 'string', description: 'Venue ID (required)' },
          name: { type: 'string', description: 'Venue name' },
          address: { type: 'object', description: 'Address' },
          age_restriction: { type: 'string', description: 'Age restriction' },
          capacity: { type: 'integer', description: 'Capacity' }
        },
        required: ['venue_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { venue_id, ...venueData } = args;
    logger.info('Updating venue', { venue_id });
    try {
      const response = await this.client.post(`/venues/${venue_id}/`, { venue: venueData });
      logger.info('Venue updated successfully', { venue_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update venue', { venue_id, error: error.message });
      throw error;
    }
  }
}
