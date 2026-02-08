import { EventbriteClient } from '../eventbrite/client.js';
import { CreateEventArgs, EventResult } from '../types/mcp.js';

export class CreateEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_event',
      description: `Create a new Event.

ENDPOINT: POST /organizations/{organization_id}/events/

By default, this API creates an event that occurs once. In order to create a series of events with multiple occurrences (also known as a "repeating event" or "recurring event"), you must first create one event to serve as the "series parent", then add occurrences to the series parent. Creating the series parent is done by calling the Create Event API with the is_series attribute set to True. Occurrences can then be added to the newly created series parent, using the Event Schedule API.

REQUIRED PARAMETERS:
- organization_id (string): ID of the Organization that owns the Event
- name (htmltext, required): Event name. Value cannot be empty nor whitespace
- start (datetime-tz-utc, required): Start date/time of the event with timezone and UTC
- end (datetime-tz-utc, required): End date/time of the event with timezone and UTC
- currency (string, required): The ISO 4217 currency code for this event (e.g., USD, EUR, GBP)

OPTIONAL PARAMETERS:
- summary (string, optional): Event summary. This is a plaintext field and will have any supplied HTML removed from it. Maximum of 140 characters, mutually exclusive with description
- description (htmltext, optional, DEPRECATED): Event description (contents of the event page). May be long and have significant formatting. Please refer to the event description tutorial to learn about the new way to create an event description
- hide_start_date (boolean, optional): Whether the start date should be hidden
- hide_end_date (boolean, optional): Whether the end date should be hidden
- online_event (boolean, optional): If this event doesn't have a venue and is only held online (default: false)
- organizer_id (string): ID of the event organizer
- logo_id (string, optional): Image ID of the event logo
- venue_id (string, optional): Event venue ID
- format_id (string, optional): Event format
- category_id (string, optional): Event category
- subcategory_id (string, optional): Event subcategory (US only)
- listed (boolean, optional): Is this event publicly searchable on Eventbrite? (default: true)
- shareable (boolean, optional): Can this event show social sharing buttons? (default: false)
- invite_only (boolean): Can only people with invites see the event page?
- show_remaining (boolean, optional): If the remaining number of tickets is publicly visible on the event page
- password (string): Password needed to see the event in unlisted mode
- capacity (number, optional): Set specific capacity (if omitted, sums ticket capacities)
- is_reserved_seating (boolean, optional): If the event is reserved seating
- is_series (boolean, optional): If the event is part of a series. Specifying this attribute as True during event creation will always designate the event as a series parent, never as a series occurrence. Series occurrences must be created through the schedules API and cannot be created using the events API
- show_pick_a_seat (boolean, optional): For reserved seating event, if attendees can pick their seats
- show_seatmap_thumbnail (boolean, optional): For reserved seating event, if venue map thumbnail visible on the event page
- show_colors_in_seatmap_thumbnail (boolean, optional): For reserved seating event, if venue map thumbnail should have colors on the event page
- source (string, optional): Source of the event (defaults to API)
- locale (Locale, optional): Indicates event language on Event's listing page (default: en_US)

SUPPORTED LOCALES:
de_AT, de_CH, de_DE, en_AU, en_CA, en_DK, en_FI, en_GB, en_HK, en_IE, en_IN, en_NZ, en_SE, en_US, es_AR, es_CL, es_CO, es_ES, fr_BE, fr_CA, fr_CH, fr_FR, hi_IN, it_IT, nl_BE, nl_NL, pt_BR, pt_PT

ERROR RESPONSES:
- 400 DATE_CONFLICT: Start date cannot be after end date
- 400 DIFFERENT_TIMEZONES: You have passed different timezones for the start and end times; they must be the same
- 400 INVALID_DATE: Start and end dates cannot be in the past
- 400 INVENTORY_TYPE_CONFLICT: Only a single inventory type may be set at once
- 400 INVITE_CONFLICT: You have set both listed and invite_only; these two options are mutually exclusive, and you are only allowed to set one
- 400 NO_DEFAULT_ORGANIZER: The event does not have an organizer ID, and no default organizer could be found for the user
- 400 NO_PACKAGE_SELECTED: You need to select a package to create an event. Go to /organizations/{organization_id}/assortment/ to select a package
- 400 NO_VENUE: You have attempted to create an event without a venue
- 400 PASSWORD_CONFLICT: You have set both listed and password; these two options are mutually exclusive, and you are only allowed to set one
- 400 SHARE_INVITE_CONFLICT: You have set both shareable and invite_only; these two options are mutually exclusive, and you are only allowed to set one
- 400 UNSUPPORTED_TIMEZONE: The time zone for the start and end times does not exist
- 400 VENUE_AND_ONLINE: You have set both online_event and venue_id; an event can either have a venue or be online, but not both at the same time
- 400 SUMMARY_DESCRIPTION_CONFLICT: You have set values for both summary and description; these two options are mutually exclusive, and you may only set one

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Event name (required). Value cannot be empty nor whitespace'
          },
          description: {
            type: 'string',
            description: '(DEPRECATED) Event description (supports HTML). Use summary instead. Mutually exclusive with summary. Please refer to the event description tutorial to learn about the new way to create an event description'
          },
          summary: {
            type: 'string',
            description: 'Event summary (optional). Plaintext field, HTML will be removed. Maximum of 140 characters. Mutually exclusive with description'
          },
          startTime: {
            type: 'string',
            description: 'Event start time in ISO 8601 UTC format (required). Example: 2024-12-31T20:00:00Z'
          },
          endTime: {
            type: 'string',
            description: 'Event end time in ISO 8601 UTC format (required). Example: 2024-12-31T23:00:00Z'
          },
          timezone: {
            type: 'string',
            description: 'Timezone for the event (required). Olson format. Example: America/New_York, America/Los_Angeles, UTC'
          },
          currency: {
            type: 'string',
            description: 'ISO 4217 currency code (required). Examples: USD, EUR, GBP, CAD, AUD'
          },
          online: {
            type: 'boolean',
            description: 'If this event doesn\'t have a venue and is only held online (optional, default: false). Cannot be used with venue_id'
          },
          listed: {
            type: 'boolean',
            description: 'Is this event publicly searchable on Eventbrite? (optional, default: true). Mutually exclusive with invite_only and password'
          },
          shareable: {
            type: 'boolean',
            description: 'Can this event show social sharing buttons? (optional, default: false). Mutually exclusive with invite_only'
          },
          inviteOnly: {
            type: 'boolean',
            description: 'Can only people with invites see the event page? (optional). Mutually exclusive with listed and shareable'
          },
          showRemaining: {
            type: 'boolean',
            description: 'If the remaining number of tickets is publicly visible on the event page (optional)'
          },
          password: {
            type: 'string',
            description: 'Password needed to see the event in unlisted mode (optional). Mutually exclusive with listed'
          },
          capacity: {
            type: 'number',
            description: 'Set specific capacity (optional). If omitted, sums ticket capacities'
          },
          hideStartDate: {
            type: 'boolean',
            description: 'Whether the start date should be hidden (optional)'
          },
          hideEndDate: {
            type: 'boolean',
            description: 'Whether the end date should be hidden (optional)'
          },
          organizerId: {
            type: 'string',
            description: 'ID of the event organizer (optional)'
          },
          logoId: {
            type: 'string',
            description: 'Image ID of the event logo (optional)'
          },
          venueId: {
            type: 'string',
            description: 'Event venue ID (optional). Cannot be used with online_event'
          },
          formatId: {
            type: 'string',
            description: 'Event format ID (optional)'
          },
          categoryId: {
            type: 'string',
            description: 'Event category ID (optional)'
          },
          subcategoryId: {
            type: 'string',
            description: 'Event subcategory ID (optional, US only)'
          },
          isReservedSeating: {
            type: 'boolean',
            description: 'If the event is reserved seating (optional)'
          },
          isSeries: {
            type: 'boolean',
            description: 'If the event is part of a series (optional). Specifying this as True during event creation will always designate the event as a series parent, never as a series occurrence. Series occurrences must be created through the schedules API'
          },
          showPickASeat: {
            type: 'boolean',
            description: 'For reserved seating event, if attendees can pick their seats (optional)'
          },
          showSeatmapThumbnail: {
            type: 'boolean',
            description: 'For reserved seating event, if venue map thumbnail visible on the event page (optional)'
          },
          showColorsInSeatmapThumbnail: {
            type: 'boolean',
            description: 'For reserved seating event, if venue map thumbnail should have colors on the event page (optional)'
          },
          source: {
            type: 'string',
            description: 'Source of the event (optional, defaults to API)'
          },
          locale: {
            type: 'string',
            description: 'Indicates event language on Event\'s listing page (optional, default: en_US). Supported: de_AT, de_CH, de_DE, en_AU, en_CA, en_DK, en_FI, en_GB, en_HK, en_IE, en_IN, en_NZ, en_SE, en_US, es_AR, es_CL, es_CO, es_ES, fr_BE, fr_CA, fr_CH, fr_FR, hi_IN, it_IT, nl_BE, nl_NL, pt_BR, pt_PT'
          },
          organizationId: {
            type: 'string',
            description: 'Organization ID to create the event under (required)'
          }
        },
        required: ['name', 'startTime', 'endTime', 'timezone', 'currency', 'organizationId']
      }
    };
  }

  async execute(args: CreateEventArgs): Promise<EventResult> {
    try {
      // If the time already has Z suffix (UTC), use it directly
      // Otherwise, parse and convert to ISO string
      const startUTC = args.startTime.endsWith('Z') 
        ? args.startTime 
        : new Date(args.startTime).toISOString();
      const endUTC = args.endTime.endsWith('Z') 
        ? args.endTime 
        : new Date(args.endTime).toISOString();

      const eventData: any = {
        name: {
          html: args.name
        },
        start: {
          timezone: args.timezone,
          utc: startUTC
        },
        end: {
          timezone: args.timezone,
          utc: endUTC
        },
        currency: args.currency
      };

      if (args.description) {
        eventData.description = {
          html: args.description
        };
      }

      if (args.online !== undefined) {
        eventData.online_event = args.online;
      }

      if (args.listed !== undefined) {
        eventData.listed = args.listed;
      }

      if (args.capacity !== undefined) {
        eventData.capacity = args.capacity;
      }

      // Store organization_id for the API endpoint, but don't include in event data
      const organizationId = args.organizationId;
      if (organizationId) {
        eventData.organization_id = organizationId;
      }

      const event = await this.client.createEvent(eventData);

      return {
        success: true,
        event
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
