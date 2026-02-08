import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListCustomQuestionsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_custom_questions',
      description: `List custom Questions by Event.

ENDPOINT: GET /events/{event_id}/questions/

Returns paginated response with question array.

PARAMETERS:
- as_owner (boolean): Return private events and fields

ERRORS (404):
- NOT_FOUND: Event doesn't exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          as_owner: { type: 'boolean', description: 'Return private events/fields' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, as_owner } = args;
    logger.info('Listing custom questions', { event_id });
    try {
      let endpoint = `/events/${event_id}/questions/`;
      if (as_owner !== undefined) endpoint += `?as_owner=${as_owner}`;
      const response = await this.client.get(endpoint);
      logger.info('Custom questions retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list custom questions', { event_id, error: error.message });
      throw error;
    }
  }
}
