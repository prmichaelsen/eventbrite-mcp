import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListCategoriesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_categories',
      description: `List all categories.

ENDPOINT: GET /categories/

Returns paginated list of categories including subcategories nested.

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
    logger.info('Listing categories');
    try {
      const response = await this.client.get('/categories/');
      logger.info('Categories retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to list categories', { error: error.message });
      throw error;
    }
  }
}
