import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class AddTicketClassToGroupsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'add_ticket_class_to_groups',
      description: `Add ticket class to ticket groups.

ENDPOINT: POST /organizations/{organization_id}/events/{event_id}/ticket_classes/{ticket_class_id}/ticket_groups/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          event_id: { type: 'string', description: 'Event ID (required)' },
          ticket_class_id: { type: 'string', description: 'Ticket Class ID (required)' },
          ticket_group_ids: { type: 'array', items: { type: 'string' }, description: 'Ticket Group IDs' }
        },
        required: ['organization_id', 'event_id', 'ticket_class_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, event_id, ticket_class_id, ticket_group_ids } = args;
    logger.info('Adding ticket class to groups', { organization_id, event_id, ticket_class_id });
    try {
      const response = await this.client.post(
        `/organizations/${organization_id}/events/${event_id}/ticket_classes/${ticket_class_id}/ticket_groups/`,
        { ticket_group_ids }
      );
      logger.info('Ticket class added to groups', { organization_id, event_id, ticket_class_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to add ticket class to groups', { organization_id, event_id, ticket_class_id, error: error.message });
      throw error;
    }
  }
}
