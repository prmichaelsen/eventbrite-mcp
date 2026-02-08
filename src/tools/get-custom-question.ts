import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetCustomQuestionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_custom_question',
      description: `Retrieve a Custom Question by ID.

ENDPOINT: GET /events/{event_id}/questions/{question_id}/

ERRORS (404):
- NOT_FOUND: Question doesn't exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          question_id: { type: 'string', description: 'Question ID (required)' }
        },
        required: ['event_id', 'question_id']
      }
    };
  }

  async execute(args: { event_id: string; question_id: string }): Promise<any> {
    const { event_id, question_id } = args;
    logger.info('Getting custom question', { event_id, question_id });
    try {
      const response = await this.client.get(`/events/${event_id}/questions/${question_id}/`);
      logger.info('Custom question retrieved successfully', { event_id, question_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get custom question', { event_id, question_id, error: error.message });
      throw error;
    }
  }
}
