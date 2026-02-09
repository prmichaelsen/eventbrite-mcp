import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateTextOverridesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_text_overrides',
      description: `Create Text Overrides for Organization, Venue, or Event.

ENDPOINT: POST /organizations/{organization_id}/text_overrides/

PARAMETERS:
- locale: Locale (optional, uses event locale or default)
- venue_id: Venue ID (optional)
- event_id: Event ID (optional)
- strings: Array of text override objects (required)

ERRORS (400):
- MISSING, INVALID

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          locale: { type: 'string', description: 'Locale' },
          venue_id: { type: 'string', description: 'Venue ID' },
          event_id: { type: 'string', description: 'Event ID' },
          strings: { type: 'array', description: 'Text override objects (required)' }
        },
        required: ['organization_id', 'strings']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, ...overrideData } = args;
    logger.info('Creating text overrides', { organization_id });
    try {
      const response = await this.client.post(`/organizations/${organization_id}/text_overrides/`, overrideData);
      logger.info('Text overrides created successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create text overrides', { organization_id, error: error.message });
      throw error;
    }
  }
}
