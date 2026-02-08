import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListFormatsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_formats',
      description: `List all available formats.

ENDPOINT: GET /formats/

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
    logger.info('Listing formats');
    try {
      const response = await this.client.get('/formats/');
      logger.info('Formats retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to list formats', { error: error.message });
      throw error;
    }
  }
}
