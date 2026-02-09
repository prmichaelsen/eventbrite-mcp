import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetTextOverridesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_text_overrides',
      description: `Retrieve Text Overrides for Organization.

ENDPOINT: GET /organizations/{organization_id}/text_overrides/

Customize strings shown during ticket sales per event.

PARAMETERS:
- locale: Locale (e.g., en_US)
- venue_id: Venue ID filter
- event_id: Event ID filter
- text_codes: List of codes (tickets_not_yet_on_sale, tickets_sold_out, etc.)

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
          text_codes: { type: 'array', items: { type: 'string' }, description: 'Text codes' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, locale, venue_id, event_id, text_codes } = args;
    logger.info('Getting text overrides', { organization_id });
    try {
      const params = new URLSearchParams();
      if (locale) params.append('locale', locale);
      if (venue_id) params.append('venue_id', venue_id);
      if (event_id) params.append('event_id', event_id);
      if (text_codes) text_codes.forEach((code: string) => params.append('text_codes', code));
      const endpoint = params.toString() ? `/organizations/${organization_id}/text_overrides/?${params.toString()}` : `/organizations/${organization_id}/text_overrides/`;
      const response = await this.client.get(endpoint);
      logger.info('Text overrides retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get text overrides', { organization_id, error: error.message });
      throw error;
    }
  }
}
