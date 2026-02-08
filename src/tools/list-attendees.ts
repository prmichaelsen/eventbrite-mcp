import { EventbriteClient } from '../eventbrite/client.js';
import { ListAttendeesArgs, AttendeeListResult } from '../types/mcp.js';

export class ListAttendeesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_attendees',
      description: `List Attendees by Event ID. Returns a paginated response.

ENDPOINT: GET /events/{event_id}/attendees/

ATTENDEE OBJECT:
The Attendee object represents the details of Attendee (ticket holder to an Event). The model is one Attendee per each sold ticket. If the Event is specified to only collect information on the Order owner (the default), all returned Attendees have the same information, apart from the barcodes and Ticket Class ID. Attendee objects are considered private; meaning that all Attendee information is only available to the User and Order owner.

ATTENDEE FIELDS RETURNED:
- created (datetime): Attendee creation date and time (i.e. when order was placed)
- changed (datetime): Date and time of last change to Attendee
- ticket_class_id (string): Ticket Class used by Attendee when registering
- variant_id (string): Variant of Ticket Class used by Attendee when registering
- ticket_class_name (string): Name of Ticket Class used by Attendee when registering
- quantity (integer): Always 1
- costs (attendee_cost): Attendee ticket cost breakdown
- profile (attendee-profile): Attendee basic profile information
- addresses (attendee-addresses): Attendee address
- questions (attendee-questions, optional): Custom questions for the Attendee
- answers (attendee-answers, optional): Attendee's answers to custom questions
- barcodes (attendee-barcodes): Attendee's entry bar code
- team (attendee-team, optional): Attendee team information
- affiliate (attendee-affiliate, optional): Attendee's affiliate code
- checked_in (boolean): true = Attendee checked in
- cancelled (boolean): true = Attendee cancelled
- refunded (boolean): true = Attendee receives a refund
- status (string): Attendee status
- event_id (string): Event ID of the Attendee's Event
- order_id (string): Order ID under which this Attendee's ticket was purchased
- guestlist_id (string): Guest list ID under which the Attendee is listed. A null value means that this Attendee is not a guest
- invited_by (string): Attendee who invited guest. A null value means that this Attendee is not a guest
- delivery_method (string): Ticket delivery method used for the Attendee. Can be will_call, electronic, standard_shipping or third_party_shipping

PARAMETERS:
- event_id (string, required): Event ID
- status (enum, optional): Filter Attendees by status
  • attending: Attendee's status is either Attending or Checked In
  • not_attending: Attendee's status is Not Attending or Deleted
  • unpaid: Attendee's Order is not paid
- changed_since (datetime, optional): Filter Attendees changed on or after the specified time
- last_item_seen (number, optional): When passed in conjunction with changed_since, filter Attendees changed on or after the specified time and with an ID later than the value of the last_item_seen field
- attendee_ids (array[string], optional): Filter Attendees with the specified IDs

AVAILABLE EXPANSIONS:
Use ?expand=expansion_name to include additional data:
- event: Attendee's Event
- order: Attendee's Order
- promotional_code: Promotional Code applied to Attendee's Order
- assigned_number: Attendee bib number, if one exists for a race or endurance Event
- answers: Attendee answers to custom questions
- survey: Custom questions presented to the Attendee
- survey_responses: Attendee's responses to survey questions
- assigned_unit: Attendee's seating assignment details if Event has reserved seating
- contact_list_preferences: Opt-in preferences for the email address associated with the Attendee

PAGINATION:
Returns paginated response with continuation token support

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'Event ID (required)'
          },
          status: {
            type: 'string',
            enum: ['attending', 'not_attending', 'unpaid'],
            description: 'Filter Attendees by status: attending (Attending or Checked In), not_attending (Not Attending or Deleted), unpaid (Order is not paid)'
          },
          pageSize: {
            type: 'number',
            description: 'Number of attendees to return per page (default: 50, max: 50)',
            minimum: 1,
            maximum: 50
          },
          continuation: {
            type: 'string',
            description: 'Continuation token for pagination'
          }
        },
        required: ['eventId']
      }
    };
  }

  async execute(args: ListAttendeesArgs): Promise<AttendeeListResult> {
    try {
      const response = await this.client.listAttendees(args.eventId, {
        status: args.status,
        pageSize: args.pageSize || 50,
        continuation: args.continuation
      });

      return {
        success: true,
        attendees: response.attendees || [],
        pagination: response.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
