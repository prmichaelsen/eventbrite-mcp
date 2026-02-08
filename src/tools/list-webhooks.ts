import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListWebhooksTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_webhooks',
      description: `List Webhooks by Organization ID.

ENDPOINT: GET /organizations/{organization_id}/webhooks/

Returns paginated response.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: { organization_id: string }): Promise<any> {
    const { organization_id } = args;
    logger.info('Listing webhooks', { organization_id });
    try {
      const response = await this.client.get(`/organizations/${organization_id}/webhooks/`);
      logger.info('Webhooks retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list webhooks', { organization_id, error: error.message });
      throw error;
    }
  }
}
