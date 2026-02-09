import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class SearchTeamsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'search_teams',
      description: `Search teams by name. Returns paginated response.

ENDPOINT: GET /events/{event_id}/teams/search/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          term: { type: 'string', description: 'Search term (required)' }
        },
        required: ['event_id', 'term']
      }
    };
  }

  async execute(args: { event_id: string; term: string }): Promise<any> {
    const { event_id, term } = args;
    logger.info('Searching teams', { event_id, term });
    try {
      const response = await this.client.get(`/events/${event_id}/teams/search/?term=${encodeURIComponent(term)}`);
      logger.info('Teams search completed', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to search teams', { event_id, error: error.message });
      throw error;
    }
  }
}
