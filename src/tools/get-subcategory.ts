import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetSubcategoryTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_subcategory',
      description: `Retrieve a Subcategory by ID.

ENDPOINT: GET /subcategories/{subcategory_id}/

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          subcategory_id: { type: 'string', description: 'Subcategory ID (required)' }
        },
        required: ['subcategory_id']
      }
    };
  }

  async execute(args: { subcategory_id: string }): Promise<any> {
    const { subcategory_id } = args;
    logger.info('Retrieving subcategory', { subcategory_id });
    try {
      const response = await this.client.get(`/subcategories/${subcategory_id}/`);
      logger.info('Subcategory retrieved successfully', { subcategory_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve subcategory', { subcategory_id, error: error.message });
      throw error;
    }
  }
}
