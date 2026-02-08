import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateWebhookTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_webhook',
      description: `Create a Webhook by Organization ID.

ENDPOINT: POST /organizations/{organization_id}/webhooks/

Webhook represents webhook associated with Organization.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          endpoint_url: { type: 'string', description: 'Webhook endpoint URL (required)' },
          actions: { type: 'array', items: { type: 'string' }, description: 'Actions to trigger webhook (required)' },
          event_id: { type: 'string', description: 'Event ID to scope webhook' }
        },
        required: ['organization_id', 'endpoint_url', 'actions']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, ...webhookData } = args;
    logger.info('Creating webhook', { organization_id });
    try {
      const response = await this.client.post(`/organizations/${organization_id}/webhooks/`, webhookData);
      logger.info('Webhook created successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create webhook', { organization_id, error: error.message });
      throw error;
    }
  }
}
