import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetStructuredContentTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_structured_content',
      description: `Retrieve latest published structured content for event.

ENDPOINT: GET /events/{id}/structured_content/

Returns latest published version. Must publish version first (publish=true in set).

PURPOSE:
- listing (default): Basic event description
- digital_content: Online Event Page for attendees

RESPONSE:
- page_version_number: Current version
- modules: List of modules (text, image, video)
- widgets: List of widgets (agenda, faqs)

ERRORS (400):
- NOT_AUTHORIZED: No permission to view
- ARGUMENTS_ERROR: Invalid event ID

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
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
    logger.info('Getting structured content', { event_id, purpose });
    try {
      const response = await this.client.get(`/events/${event_id}/structured_content/?purpose=${purpose}`);
      logger.info('Structured content retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get structured content', { event_id, error: error.message });
      throw error;
    }
  }
}
