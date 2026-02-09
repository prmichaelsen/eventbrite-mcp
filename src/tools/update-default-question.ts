import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateDefaultQuestionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_default_question',
      description: `Update Default Question by ID.

ENDPOINT: POST /events/{event_id}/canned_questions/{question_id}/

ERRORS (400):
- ARGUMENTS_ERROR

ERRORS (404):
- NOT_FOUND: Event doesn't exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          question_id: { type: 'string', description: 'Question ID (required)' },
          question: { type: 'object', description: 'Question object' }
        },
        required: ['event_id', 'question_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, question_id, question } = args;
    logger.info('Updating default question', { event_id, question_id });
    try {
      const response = await this.client.post(`/events/${event_id}/canned_questions/${question_id}/`, { question });
      logger.info('Default question updated successfully', { event_id, question_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update default question', { event_id, question_id, error: error.message });
      throw error;
    }
  }
}
