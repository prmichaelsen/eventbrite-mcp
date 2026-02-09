import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class VerifyTeamPasswordTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'verify_team_password',
      description: `Verify team password and return token.

ENDPOINT: POST /events/{event_id}/teams/{team_id}/check_password/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          team_id: { type: 'string', description: 'Team ID (required)' },
          password: { type: 'string', description: 'Password to verify (required)' }
        },
        required: ['event_id', 'team_id', 'password']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, team_id, password } = args;
    logger.info('Verifying team password', { event_id, team_id });
    try {
      const response = await this.client.post(`/events/${event_id}/teams/${team_id}/check_password/`, { password });
      logger.info('Team password verified', { event_id, team_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to verify team password', { event_id, team_id, error: error.message });
      throw error;
    }
  }
}
