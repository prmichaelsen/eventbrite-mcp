import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetCategoryTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_category',
      description: `Get a category by ID.

ENDPOINT: GET /categories/{id}/

Category is an overarching category that an event falls into (vertical). Examples: Music, Endurance.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          category_id: { type: 'string', description: 'Category ID (required)' }
        },
        required: ['category_id']
      }
    };
  }

  async execute(args: { category_id: string }): Promise<any> {
    const { category_id } = args;
    logger.info('Retrieving category', { category_id });
    try {
      const response = await this.client.get(`/categories/${category_id}/`);
      logger.info('Category retrieved successfully', { category_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve category', { category_id, error: error.message });
      throw error;
    }
  }
}
