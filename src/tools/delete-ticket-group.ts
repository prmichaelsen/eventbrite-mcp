import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteTicketGroupTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_ticket_group',
      description: `Delete ticket group.

ENDPOINT: DELETE /ticket_groups/{ticket_group_id}/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          ticket_group_id: { type: 'string', description: 'Ticket Group ID (required)' }
        },
        required: ['ticket_group_id']
      }
    };
  }

  async execute(args: { ticket_group_id: string }): Promise<any> {
    const { ticket_group_id } = args;
    logger.info('Deleting ticket group', { ticket_group_id });
    try {
      const response = await this.client.delete(`/ticket_groups/${ticket_group_id}/`);
      logger.info('Ticket group deleted', { ticket_group_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete ticket group', { ticket_group_id, error: error.message });
      throw error;
    }
  }
}
