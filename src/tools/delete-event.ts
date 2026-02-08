import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_event',
      description: `Delete an Event if the delete is permitted.

ENDPOINT: DELETE /events/{event_id}/

Returns a boolean indicating the success or failure of the delete action.

To delete an Event, the Event must not have any pending or completed orders.

If the event is a series parent, all series occurrences must be in a valid state to be deleted. Deleting the series parent will delete all series occurrences.

WARNING: This action cannot be undone. Deleted events cannot be recovered.

DELETION REQUIREMENTS:
- Event must not have any pending orders
- Event must not have any completed orders
- For series parents: all occurrences must meet deletion requirements

SERIES PARENT EVENTS:
- All occurrences must be in valid state for deletion
- Deleting parent deletes all occurrences
- Cannot delete if any occurrence has pending/completed orders

RESPONSE:
Returns object with:
- deleted (boolean): true if successfully deleted

POSSIBLE ERRORS (400):
- ALREADY_DELETED: Event has already been deleted
- CANNOT_DELETE: Cannot delete event that has pending or completed orders, or series parent where any occurrence has pending or completed orders

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'Event ID (required)'
          }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string }): Promise<any> {
    const { event_id } = args;

    logger.info('Deleting event', { event_id });

    try {
      const response = await this.client.delete(`/events/${event_id}/`) as any;

      logger.info('Event deleted successfully', { event_id, deleted: response.deleted });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete event', { event_id, error: error.message });
      throw error;
    }
  }
}
