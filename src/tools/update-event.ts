import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_event',
      description: `Update an Event by Event ID.

ENDPOINT: POST /events/{event_id}/

Note that if the event is a series parent, updating name, description, hide_start_date, hide_end_date, currency, show_remaining, password, capacity, or source on the series parent will update these fields on all occurrences in the series.

EVENT OBJECT - PUBLIC FIELDS (can be updated):
- name (multipart-text): Event name
- summary (string, optional): Event summary. Short summary describing the event and its purpose
- description (multipart-text, optional, DEPRECATED): Event description. Use summary instead
- start (datetime-tz): Event start date and time
- end (datetime-tz): Event end date and time
- currency (string): Event ISO 4217 currency code
- online_event (boolean): true = Event is online only (no Venue)
- hide_start_date (boolean): If true, event's start date never displayed to attendees
- hide_end_date (boolean): If true, event's end date never displayed to attendees

EVENT OBJECT - PRIVATE FIELDS (can be updated):
- listed (boolean): true = Event publicly searchable on Eventbrite
- shareable (boolean): true = Event is shareable with social buttons
- invite_only (boolean): true = Only invitees can see the event
- show_remaining (boolean): true = Show remaining ticket count
- password (string): Password to access event details
- capacity (integer): Maximum attendees (sum of ticket class quantities)
- capacity_is_custom (boolean): true = Use custom capacity, false = Calculate from ticket classes
- organizer_id (string): ID of event organizer
- venue_id (string): ID of event venue
- format_id (string): ID of event format
- category_id (string): ID of event category
- subcategory_id (string): ID of event subcategory
- logo_id (string): ID of event logo image
- is_reserved_seating (boolean): Whether event has reserved seating
- is_series (boolean): Whether this is a series parent event
- show_pick_a_seat (boolean): For reserved seating, show seat picker
- show_seatmap_thumbnail (boolean): Show seat map thumbnail
- show_colors_in_seatmap_thumbnail (boolean): Show colors in seat map thumbnail

POSSIBLE ERRORS (400):
- CANNOT_UPDATE_CURRENCY: Cannot update event with paid sales or reserved seats
- CANNOT_UPDATE_SOURCE: Event source can only be set during creation
- DATE_CONFLICT: End date must be after start date
- DIFFERENT_TIMEZONES: Start and end times must have same timezone
- INVALID_DATE: Start and end dates cannot be in the past
- INVENTORY_TYPE_CONFLICT: Only single inventory type may be set at once
- INVITE_CONFLICT: Cannot set both listed and invite_only
- NO_DEFAULT_ORGANIZER: No organizer ID and no default found
- NO_PAYMENT_OPTIONS: Event has paid tickets but no payment options
- NO_PACKAGE_SELECTED: Need to select package at /organizations/{id}/assortment/
- NO_VENUE: Attempted to create event without venue
- PASSWORD_CONFLICT: Cannot set both listed and password
- PAYMENT_OPTIONS_DEPRECATED_SPLIT_FEES: Split fees no longer supported
- PAYMENT_OPTIONS_NO_COUNTRY: Paid tickets but no payment country
- PAYMENT_OPTIONS_NO_PAYMENT_TYPE: Paid tickets but no payment type
- PAYMENT_OPTIONS_PAYPAL_NO_EMAIL: PayPal configured but no email
- SHARE_INVITE_CONFLICT: Cannot set both shareable and invite_only
- UNSUPPORTED_TIMEZONE: Timezone does not exist
- VENUE_AND_ONLINE: Cannot set both venue_id and online_event
- SUMMARY_DESCRIPTION_CONFLICT: Cannot set both summary and description
- OCCURRENCE_TIMEZONE_UPDATE_NOT_ALLOWED: Cannot change timezone on series occurrence
- SERIES_PARENT_START_END_DATE_EDIT: Cannot set start/end on series parent
- OCCURRENCE_DURATION_TOO_LONG: Series occurrences cannot exceed 7 days
- IS_RESERVED_SEATING_UPDATE_NOT_ALLOWED_ON_SERIES_EVENTS: Reserved seating events cannot be recurring
- IS_SERIES_UPDATE_NOT_ALLOWED_ON_RESERVED_EVENTS: Reserved seating events cannot be recurring
- IS_SERIES_UPDATE_NOT_ALLOWED_ON_TICKETED_EVENTS: Delete all tickets to make this change
- IS_SERIES_UPDATE_NOT_ALLOWED_ON_PUBLISHED_EVENTS: Unpublish event to make this change
- IS_SERIES_UPDATE_NOT_ALLOWED_HAS_OCCURRENCES: Delete all occurrences to change to one-time event
- IS_SERIES_UPDATE_NOT_ALLOWED_ON_SERIES_OCCURRENCE: Cannot change occurrence to one-time event
- ARGUMENTS_ERROR: Errors with your arguments

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'Event ID (required)'
          },
          name: {
            type: 'object',
            description: 'Event name (optional)',
            properties: {
              html: { type: 'string', description: 'HTML version of event name' }
            }
          },
          summary: {
            type: 'string',
            description: 'Event summary (optional)'
          },
          description: {
            type: 'object',
            description: 'Event description (optional, deprecated - use summary)',
            properties: {
              html: { type: 'string', description: 'HTML version of description' }
            }
          },
          start: {
            type: 'object',
            description: 'Event start date/time (optional)',
            properties: {
              timezone: { type: 'string', description: 'Timezone (e.g., America/Los_Angeles)' },
              utc: { type: 'string', description: 'Start time in UTC (ISO 8601)' }
            }
          },
          end: {
            type: 'object',
            description: 'Event end date/time (optional)',
            properties: {
              timezone: { type: 'string', description: 'Timezone (e.g., America/Los_Angeles)' },
              utc: { type: 'string', description: 'End time in UTC (ISO 8601)' }
            }
          },
          hide_start_date: {
            type: 'boolean',
            description: 'Hide start date from attendees (optional)'
          },
          hide_end_date: {
            type: 'boolean',
            description: 'Hide end date from attendees (optional)'
          },
          currency: {
            type: 'string',
            description: 'ISO 4217 currency code (optional, e.g., USD, EUR, GBP)'
          },
          online_event: {
            type: 'boolean',
            description: 'Is online-only event (optional)'
          },
          organizer_id: {
            type: 'string',
            description: 'Organizer ID (optional)'
          },
          listed: {
            type: 'boolean',
            description: 'Publicly searchable (optional)'
          },
          shareable: {
            type: 'boolean',
            description: 'Is shareable (optional)'
          },
          invite_only: {
            type: 'boolean',
            description: 'Only invited can see (optional)'
          },
          show_remaining: {
            type: 'boolean',
            description: 'Show remaining tickets (optional)'
          },
          password: {
            type: 'string',
            description: 'Event password (optional)'
          },
          capacity: {
            type: 'integer',
            description: 'Maximum attendees (optional)'
          },
          capacity_is_custom: {
            type: 'boolean',
            description: 'Use custom capacity (optional)'
          },
          is_reserved_seating: {
            type: 'boolean',
            description: 'Has reserved seating (optional)'
          },
          is_series: {
            type: 'boolean',
            description: 'Is series parent (optional)'
          },
          show_pick_a_seat: {
            type: 'boolean',
            description: 'Show seat picker (optional)'
          },
          show_seatmap_thumbnail: {
            type: 'boolean',
            description: 'Show seatmap thumbnail (optional)'
          },
          show_colors_in_seatmap_thumbnail: {
            type: 'boolean',
            description: 'Show colors in seatmap (optional)'
          },
          locale: {
            type: 'string',
            description: 'Event locale (optional, e.g., en_US)'
          },
          format_id: {
            type: 'string',
            description: 'Format ID (optional)'
          },
          category_id: {
            type: 'string',
            description: 'Category ID (optional)'
          },
          subcategory_id: {
            type: 'string',
            description: 'Subcategory ID (optional)'
          },
          venue_id: {
            type: 'string',
            description: 'Venue ID (optional)'
          },
          logo_id: {
            type: 'string',
            description: 'Logo image ID (optional)'
          }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...updateData } = args;

    logger.info('Updating event', { event_id, fields: Object.keys(updateData) });

    try {
      const response = await this.client.post(`/events/${event_id}/`, {
        event: updateData
      });

      logger.info('Event updated successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update event', { event_id, error: error.message });
      throw error;
    }
  }
}
