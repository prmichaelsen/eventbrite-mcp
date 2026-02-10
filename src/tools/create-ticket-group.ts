import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateTicketGroupTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_ticket_group',
      description: `Create ticket group. Max 300 live groups per organization.

ENDPOINT: POST /organizations/{organization_id}/ticket_groups/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          name: { type: 'string', description: 'Group name' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, ...groupData } = args;
    logger.info('Creating ticket group', { organization_id });
    try {
      const response = await this.client.post(`/organizations/${organization_id}/ticket_groups/`, groupData);
      logger.info('Ticket group created', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create ticket group', { organization_id, error: error.message });
      throw error;
    }
  }
}
