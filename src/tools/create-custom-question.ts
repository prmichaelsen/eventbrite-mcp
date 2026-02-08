import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateCustomQuestionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_custom_question',
      description: `Create a custom question for an Event.

ENDPOINT: POST /events/{event_id}/questions/

Returns result as question array.

ERRORS (400):
- INSUFFICIENT_PACKAGE: Need to upgrade package

ERRORS (403):
- NOT_AUTHORIZED: No permission

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          question: { type: 'object', description: 'Question object with label, type, required fields' }
        },
        required: ['event_id', 'question']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, question } = args;
    logger.info('Creating custom question', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/questions/`, { question });
      logger.info('Custom question created successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create custom question', { event_id, error: error.message });
      throw error;
    }
  }
}
