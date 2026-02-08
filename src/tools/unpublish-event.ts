import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UnpublishEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'unpublish_event',
      description: `Unpublish an Event.

ENDPOINT: POST /events/{event_id}/unpublish/

Returns boolean indicating success or failure of unpublish action.

UNPUBLISH REQUIREMENTS:
- Free Event (including past): Must not have pending or completed orders
- Paid Event (completed/paid out): Can be unpublished
- Paid Event (not completed): Can only unpublish if no pending or completed orders

SERIES PARENT EVENTS:
- All occurrences must be in valid state to unpublish
- Unpublishing parent unpublishes all occurrences
- Series occurrence cannot be unpublished individually

RESPONSE:
- unpublished (boolean): true if successfully unpublished

POSSIBLE ERRORS (400):
- NOT_PUBLISHED: Event not currently published, cannot unpublish
- CANNOT_UNPUBLISH: Cannot unpublish event with pending/completed sales (unless past/completed/paid out for paid tickets), or if series parent has occurrences in invalid state, or if trying to unpublish individual series occurrence

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
    logger.info('Unpublishing event', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/unpublish/`, {}) as any;
      logger.info('Event unpublished successfully', { event_id, unpublished: response.unpublished });
      return response;
    } catch (error: any) {
      logger.error('Failed to unpublish event', { event_id, error: error.message });
      throw error;
    }
  }
}
