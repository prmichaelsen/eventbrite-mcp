import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateTicketGroupTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_ticket_group',
      description: `Update ticket group.

ENDPOINT: POST /ticket_groups/{ticket_group_id}/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          ticket_group_id: { type: 'string', description: 'Ticket Group ID (required)' },
          name: { type: 'string', description: 'Group name' }
        },
        required: ['ticket_group_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { ticket_group_id, ...groupData } = args;
    logger.info('Updating ticket group', { ticket_group_id });
    try {
      const response = await this.client.post(`/ticket_groups/${ticket_group_id}/`, groupData);
      logger.info('Ticket group updated', { ticket_group_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update ticket group', { ticket_group_id, error: error.message });
      throw error;
    }
  }
}
