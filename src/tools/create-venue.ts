import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateVenueTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_venue',
      description: `Create new Venue under an Organization.

ENDPOINT: POST /organizations/{organization_id}/venues/

VENUE FIELDS:
- name (string, required): Venue name
- address (object): Venue address with address_1, city, region, postal_code, country
- age_restriction (string): Age restriction
- capacity (number): Maximum tickets
- latitude (string): Latitude
- longitude (string): Longitude

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          name: { type: 'string', description: 'Venue name (required)' },
          address: { type: 'object', description: 'Address object' },
          age_restriction: { type: 'string', description: 'Age restriction' },
          capacity: { type: 'integer', description: 'Max capacity' }
        },
        required: ['organization_id', 'name']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, ...venueData } = args;
    logger.info('Creating venue', { organization_id });
    try {
      const response = await this.client.post(`/organizations/${organization_id}/venues/`, { venue: venueData });
      logger.info('Venue created successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create venue', { organization_id, error: error.message });
      throw error;
    }
  }
}
