import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteCustomQuestionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_custom_question',
      description: `Delete a custom Question.

ENDPOINT: DELETE /events/{event_id}/questions/{question_id}/

ERRORS (403):
- NOT_AUTHORIZED: No permission

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
    logger.info('Deleting custom question', { event_id, question_id });
    try {
      const response = await this.client.delete(`/events/${event_id}/questions/${question_id}/`);
      logger.info('Custom question deleted successfully', { event_id, question_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete custom question', { event_id, question_id, error: error.message });
      throw error;
    }
  }
}
