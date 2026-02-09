import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateTeamTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_team',
      description: `Create a team for an event.

ENDPOINT: POST /events/{event_id}/teams/create/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          name: { type: 'string', description: 'Team name' },
          password: { type: 'string', description: 'Team password' },
          preferred_start_time: { type: 'string', description: 'Preferred start time' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...teamData } = args;
    logger.info('Creating team', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/teams/create/`, teamData);
      logger.info('Team created', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create team', { event_id, error: error.message });
      throw error;
    }
  }
}
