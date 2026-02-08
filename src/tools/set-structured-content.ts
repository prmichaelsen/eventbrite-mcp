import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class SetStructuredContentTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'set_structured_content',
      description: `Set structured content for event (create/update).

ENDPOINT: POST /events/{id}/structured_content/{version}/

Structured content = modules (text, image, video) + widgets (agenda, faqs).
Must send publish=true with modules to make visible to public.

MODULE TYPES:
- text: Text content with HTML
- image: Image with ID and URL
- video: Video embed

WIDGET TYPES:
- agenda: Event schedule with tabs/slots/hosts
- faqs: FAQ list

PURPOSE:
- listing (default): Event description
- digital_content: Online Event Page

ERRORS (400):
- NOT_AUTHORIZED: No permission
- PAGE_VERSION_DISCONTINUITY: Version mismatch
- MODULES_LIMIT_REACHED: Max 100 modules
- PAGE_VERSION_LIMIT_REACHED: Max 5000 versions

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          version: { type: 'string', description: 'Version number (required)' },
          modules: { type: 'array', description: 'Content modules (required)' },
          widgets: { type: 'array', description: 'Content widgets' },
          publish: { type: 'boolean', description: 'Publish after saving' },
          purpose: { type: 'string', description: 'listing or digital_content' }
        },
        required: ['event_id', 'version', 'modules']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, version, ...contentData } = args;
    logger.info('Setting structured content', { event_id, version });
    try {
      const response = await this.client.post(`/events/${event_id}/structured_content/${version}/`, contentData);
      logger.info('Structured content set successfully', { event_id, version });
      return response;
    } catch (error: any) {
      logger.error('Failed to set structured content', { event_id, error: error.message });
      throw error;
    }
  }
}
