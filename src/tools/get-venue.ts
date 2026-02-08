import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetVenueTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_venue',
      description: `Retrieve a Venue by ID.

ENDPOINT: GET /venues/{venue_id}/

Venue represents location where Event takes place. Venues grouped by Organization.

VENUE FIELDS:
- id (string): Venue ID
- name (string): Venue name
- address (address): Venue address
- age_restriction (string): Age restriction
- capacity (number): Maximum tickets that can be sold
- latitude (string): Latitude coordinates
- longitude (string): Longitude coordinates

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          venue_id: { type: 'string', description: 'Venue ID (required)' }
        },
        required: ['venue_id']
      }
    };
  }

  async execute(args: { venue_id: string }): Promise<any> {
    const { venue_id } = args;
    logger.info('Retrieving venue', { venue_id });
    try {
      const response = await this.client.get(`/venues/${venue_id}/`);
      logger.info('Venue retrieved successfully', { venue_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve venue', { venue_id, error: error.message });
      throw error;
    }
  }
}
