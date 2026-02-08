import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetEventDescriptionTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_event_description',
      description: `Retrieve full HTML description for an Event.

ENDPOINT: GET /events/{event_id}/description/

Returns fully rendered description as HTML string. Works with events created using New or Classic Create.

PERMISSIONS:
event.details:read

ERRORS (400):
- NOT_AUTHORIZED: No permission to view details
- ARGUMENTS_ERROR: Invalid event ID

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string }): Promise<any> {
    const { event_id } = args;
    logger.info('Getting event description', { event_id });
    try {
      const response = await this.client.get(`/events/${event_id}/description/`);
      logger.info('Event description retrieved successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get event description', { event_id, error: error.message });
      throw error;
    }
  }
}
