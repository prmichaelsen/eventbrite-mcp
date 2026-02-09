import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateDefaultQuestionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_default_question',
      description: `Create a default Question for an Event.

ENDPOINT: POST /events/{event_id}/canned_questions/

ERRORS (400):
- INSUFFICIENT_PACKAGE: Need to upgrade package
- NOT_ALLOWED

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          question: { type: 'object', description: 'Question object (required)' }
        },
        required: ['event_id', 'question']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, question } = args;
    logger.info('Creating default question', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/canned_questions/`, { question });
      logger.info('Default question created successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create default question', { event_id, error: error.message });
      throw error;
    }
  }
}
