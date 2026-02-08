import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListSubcategoriesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_subcategories',
      description: `List all subcategories.

ENDPOINT: GET /subcategories/

Returns paginated response.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }

  async execute(): Promise<any> {
    logger.info('Listing subcategories');
    try {
      const response = await this.client.get('/subcategories/');
      logger.info('Subcategories retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to list subcategories', { error: error.message });
      throw error;
    }
  }
}
