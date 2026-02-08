import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteWebhookTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_webhook',
      description: `Delete a Webhook by ID.

ENDPOINT: DELETE /webhooks/{id}/

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          webhook_id: { type: 'string', description: 'Webhook ID (required)' }
        },
        required: ['webhook_id']
      }
    };
  }

  async execute(args: { webhook_id: string }): Promise<any> {
    const { webhook_id } = args;
    logger.info('Deleting webhook', { webhook_id });
    try {
      const response = await this.client.delete(`/webhooks/${webhook_id}/`);
      logger.info('Webhook deleted successfully', { webhook_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete webhook', { webhook_id, error: error.message });
      throw error;
    }
  }
}
