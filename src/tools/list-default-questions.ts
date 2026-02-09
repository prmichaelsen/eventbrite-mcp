import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListDefaultQuestionsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_default_questions',
      description: `List default Questions by Event.

ENDPOINT: GET /events/{event_id}/canned_questions/

PARAMETERS:
- include_all (boolean): Return whole list included or not

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          include_all: { type: 'boolean', description: 'Return all questions' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, include_all } = args;
    logger.info('Listing default questions', { event_id });
    try {
      let endpoint = `/events/${event_id}/canned_questions/`;
      if (include_all !== undefined) endpoint += `?include_all=${include_all}`;
      const response = await this.client.get(endpoint);
      logger.info('Default questions retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list default questions', { event_id, error: error.message });
      throw error;
    }
  }
}
