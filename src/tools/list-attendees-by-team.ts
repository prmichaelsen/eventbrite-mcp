import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListAttendeesByTeamTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_attendees_by_team',
      description: `List attendees for a team. Returns paginated response.

ENDPOINT: GET /events/{event_id}/teams/{team_id}/attendees/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          team_id: { type: 'string', description: 'Team ID (required)' }
        },
        required: ['event_id', 'team_id']
      }
    };
  }

  async execute(args: { event_id: string; team_id: string }): Promise<any> {
    const { event_id, team_id } = args;
    logger.info('Listing attendees by team', { event_id, team_id });
    try {
      const response = await this.client.get(`/events/${event_id}/teams/${team_id}/attendees/`);
      logger.info('Attendees by team retrieved', { event_id, team_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list attendees by team', { event_id, team_id, error: error.message });
      throw error;
    }
  }
}
