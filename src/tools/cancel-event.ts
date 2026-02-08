import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CancelEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'cancel_event',
      description: `Cancel an Event.

ENDPOINT: POST /events/{event_id}/cancel/

Returns boolean indicating success or failure.

CANCEL REQUIREMENTS:
- Event must not have pending or completed orders

SERIES PARENT EVENTS:
- All occurrences must be in valid state to cancel
- Canceling parent cancels all occurrences

RESPONSE:
- canceled (boolean): true if successfully canceled

POSSIBLE ERRORS (400):
- ALREADY_CANCELED: Event already canceled
- CANNOT_CANCEL: Event has pending/completed ticket sales that must be refunded first, or series parent has occurrences that cannot be canceled

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
    logger.info('Canceling event', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/cancel/`, {}) as any;
      logger.info('Event canceled successfully', { event_id, canceled: response.canceled });
      return response;
    } catch (error: any) {
      logger.error('Failed to cancel event', { event_id, error: error.message });
      throw error;
    }
  }
}
