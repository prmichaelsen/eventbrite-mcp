import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListTeamsByEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_teams_by_event',
      description: `List teams for an event. Returns paginated response.

ENDPOINT: GET /events/{event_id}/teams/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string }): Promise<any> {
    const { event_id } = args;
    logger.info('Listing teams by event', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/teams/`);
      logger.info('Teams retrieved', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list teams', { event_id, error: error.message });
      throw error;
    }
  }
}
