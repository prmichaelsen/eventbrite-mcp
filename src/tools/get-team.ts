import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetTeamTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_team',
      description: `Retrieve team information.

ENDPOINT: GET /events/{event_id}/teams/{team_id}/

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
    logger.info('Getting team', { event_id, team_id });
    try {
      const response = await this.client.get(`/events/${event_id}/teams/${team_id}/`);
      logger.info('Team retrieved', { event_id, team_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get team', { event_id, team_id, error: error.message });
      throw error;
    }
  }
}
