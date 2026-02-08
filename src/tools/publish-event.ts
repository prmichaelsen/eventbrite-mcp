import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class PublishEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'publish_event',
      description: `Publish an Event.

ENDPOINT: POST /events/{event_id}/publish/

In order for publish to be permitted, the event must have all necessary information, including a name and description, an organizer, at least one ticket, and valid payment options. This API endpoint will return argument errors for event fields that fail to validate the publish requirements. Returns a boolean indicating success or failure of the publish.

If the event is a series parent, all occurrences in the series must be in a valid state to be published. Publishing the series parent will publish all series occurrences.

Deleted Events cannot be published.

REQUIREMENTS FOR PUBLISHING:
- Event must have a name
- Event must have a description or summary
- Event must have an organizer
- Event must have at least one ticket class
- If event has paid tickets, must have valid payment options configured:
  * Payment country must be set
  * Payment type must be configured
  * If using PayPal, PayPal email must be specified
  * Split fees are not supported (deprecated)

SERIES PARENT EVENTS:
- All occurrences must be in valid state
- Publishing parent publishes all occurrences
- Must have at least one date scheduled

RESPONSE:
Returns object with:
- published (boolean): true if successfully published

POSSIBLE ERRORS (400):
- ALREADY_PUBLISHED_OR_DELETED: Event already published or deleted
- NO_PAYMENT_OPTIONS: Event has paid tickets but no payment options configured
- PAYMENT_OPTIONS_DEPRECATED_SPLIT_FEES: Split fees configured (no longer supported)
- PAYMENT_OPTIONS_NO_COUNTRY: Paid tickets but no payment country configured
- PAYMENT_OPTIONS_NO_PAYMENT_TYPE: Paid tickets but no payment type configured
- PAYMENT_OPTIONS_PAYPAL_NO_EMAIL: PayPal configured but no email specified
- PUBLISH_FREE_EVENT_FEATURE_DENIED: Reached limit of free events in Professional plan
- ERROR_CANNOT_PUBLISH_SERIES_WITH_NO_DATES: Series must have at least one date scheduled

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

    logger.info('Publishing event', { event_id });

    try {
      const response = await this.client.post(`/events/${event_id}/publish/`, {}) as any;

      logger.info('Event published successfully', { event_id, published: response.published });
      return response;
    } catch (error: any) {
      logger.error('Failed to publish event', { event_id, error: error.message });
      throw error;
    }
  }
}
