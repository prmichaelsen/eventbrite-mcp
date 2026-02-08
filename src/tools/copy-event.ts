import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CopyEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'copy_event',
      description: `Copy an Event, creating duplicate with new Event ID.

ENDPOINT: POST /events/{event_id}/copy/

Creates new Event based on existing Event. Returns Event object for newly created Event.

COPIED ELEMENTS:
- Event payment options
- Payout method
- Refund policy
- Tax settings

POSSIBLE ERRORS (400):
- INSUFFICIENT_PACKAGE: Need to upgrade package. Go to /users/{user_id}/assortment/
- INVALID_END_DATE: End date must be 1 minute to 365 days after start time
- INVALID_START_DATE: Start date must be between now and 10 years from now
- UNABLE_TO_COPY_EVENT: Currently unable to copy. Recovery not possible
- UNSUPPORTED_TIMEZONE: Timezone not supported

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID to copy (required)' },
          name: { type: 'string', description: 'Name for copied event (optional)' },
          start: { type: 'object', description: 'Start datetime (optional)', properties: { timezone: { type: 'string' }, utc: { type: 'string' } } },
          end: { type: 'object', description: 'End datetime (optional)', properties: { timezone: { type: 'string' }, utc: { type: 'string' } } }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...copyData } = args;
    logger.info('Copying event', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/copy/`, copyData);
      logger.info('Event copied successfully', { event_id, new_event_id: (response as any).id });
      return response;
    } catch (error: any) {
      logger.error('Failed to copy event', { event_id, error: error.message });
      throw error;
    }
  }
}
