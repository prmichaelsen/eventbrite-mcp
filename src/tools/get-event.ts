import { EventbriteClient } from '../eventbrite/client.js';
import { GetEventArgs, EventResult } from '../types/mcp.js';

export class GetEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_event',
      description: `Retrieve an Event by Event ID.

ENDPOINT: GET /events/{event_id}/

NOTE: If the Event being retrieved was created using the new version of Create, then you may notice that the Event's description field is now being used to hold the event summary. To retrieve your event's fully-rendered HTML description, you will need to make an additional API call to retrieve the Event's full HTML description.

EVENT OBJECT - PUBLIC FIELDS:
- name (multipart-text): Event name
- summary (string, optional): Event summary. Short summary describing the event and its purpose
- description (multipart-text, optional, DEPRECATED): Event description. Description can be lengthy and have significant formatting
- url (string): URL of the Event's Listing page on eventbrite.com
- start (datetime-tz): Event start date and time
- end (datetime-tz): Event end date and time
- created (datetime): Event creation date and time
- changed (datetime): Date and time of most recent changes to the Event
- published (datetime): Event publication date and time
- status (string): Event status. Can be draft, live, started, ended, completed, canceled
- currency (string): Event ISO 4217 currency code
- online_event (boolean): true = Specifies that the Event is online only (i.e. the Event does not have a Venue)
- hide_start_date (boolean): If true, the event's start date should never be displayed to attendees
- hide_end_date (boolean): If true, the event's end date should never be displayed to attendees

EVENT OBJECT - PRIVATE FIELDS (only available to User):
- listed (boolean): true = Allows the Event to be publicly searchable on the Eventbrite website
- shareable (boolean): true = Event is shareable, by including social sharing buttons for the Event to Eventbrite applications
- invite_only (boolean): true = Only invitees who have received an email inviting them to the Event are able to see Eventbrite applications
- show_remaining (boolean): true = Provides, to Eventbrite applications, the total number of remaining tickets for the Event
- password (string): Event password used by visitors to access the details of the Event
- capacity (integer): Maximum number of tickets for the Event that can be sold to Attendees. The total capacity is calculated by the sum of the quantity_total of the Ticket Class
- capacity_is_custom (boolean): true = Use custom capacity value to specify the maximum number of Attendees for the Event. False = Calculate the maximum number of Attendees for the Event from the total of all Ticket Class capacities

AVAILABLE EXPANSIONS:
Use ?expand=expansion_name to include additional data:
- logo: Event image logo
- venue: Event Venue
- organizer: Event Organizer
- format: Event Format
- category: Event Category
- subcategory: Event Subcategory
- bookmark_info: Indicates whether a user has saved the Event as a bookmark
- refund_policy: Event Refund Policy
- ticket_availability: Overview of availability of all Ticket Classes
- external_ticketing: External ticketing data for the Event
- music_properties: Event Music Properties
- publish_settings: Event publish settings
- basic_inventory_info: Indicates whether the event has Ticket Classes, Inventory Tiers, Donation Ticket Classes, Ticket Rules, Inventory Add-Ons, and/or Admission Inventory Tiers
- event_sales_status: Event's sales status details
- checkout_settings: Event checkout and payment settings
- listing_properties: Display/listing details about the event
- has_digital_content: Whether or not an event Has Digital Content

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'Event ID (required)'
          }
        },
        required: ['eventId']
      }
    };
  }

  async execute(args: GetEventArgs): Promise<EventResult> {
    try {
      const event = await this.client.getEvent(args.eventId);

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
