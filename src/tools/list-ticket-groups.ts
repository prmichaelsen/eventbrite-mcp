import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListTicketGroupsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_ticket_groups',
      description: `List ticket groups by organization.

ENDPOINT: GET /organizations/{organization_id}/ticket_groups/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
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
    logger.info('Listing ticket groups', { organization_id });
    try {
      const response = await this.client.get(`/organizations/${organization_id}/ticket_groups/`);
      logger.info('Ticket groups retrieved', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list ticket groups', { organization_id, error: error.message });
      throw error;
    }
  }
}
