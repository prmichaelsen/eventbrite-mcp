import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetStructuredContentWorkingTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_structured_content_working',
      description: `Retrieve latest working version of structured content (published or unpublished).

ENDPOINT: GET /events/{id}/structured_content/edit/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          purpose: { type: 'string', description: 'Purpose: listing or digital_content (default: listing)' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, purpose = 'listing' } = args;
    logger.info('Getting structured content working version', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/structured_content/edit/?purpose=${purpose}`);
      logger.info('Structured content working version retrieved', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get structured content working', { event_id, error: error.message });
      throw error;
    }
  }
}
