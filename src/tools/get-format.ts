import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetFormatTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_format',
      description: `Retrieve a Format by ID.

ENDPOINT: GET /formats/{format_id}/

Format represents event type (e.g., seminar, workshop, concert).

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          format_id: { type: 'string', description: 'Format ID (required)' }
        },
        required: ['format_id']
      }
    };
  }

  async execute(args: { format_id: string }): Promise<any> {
    const { format_id } = args;
    logger.info('Retrieving format', { format_id });
    try {
      const response = await this.client.get(`/formats/${format_id}/`);
      logger.info('Format retrieved successfully', { format_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve format', { format_id, error: error.message });
      throw error;
    }
  }
}
