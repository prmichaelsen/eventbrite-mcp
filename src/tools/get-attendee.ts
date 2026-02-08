import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetAttendeeTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_attendee',
      description: `Retrieve an Attendee by Attendee ID.

ENDPOINT: GET /events/{event_id}/attendees/{attendee_id}/

The Attendee object represents ticket holder details for an Event. One Attendee per sold ticket. If Event only collects Order owner info (default), all Attendees have same info except barcodes and Ticket Class ID.

Attendee objects are private - only available to User and Order owner.

ATTENDEE FIELDS:
- created (datetime): When order placed/attendee created
- changed (datetime): Last change to attendee
- ticket_class_id (string): Ticket Class used when registering
- variant_id (string): Variant of Ticket Class
- ticket_class_name (string): Name of Ticket Class
- quantity (integer): Always 1
- costs (object): Ticket cost breakdown
- profile (object): Attendee basic profile
- addresses (object): Attendee addresses
- questions (array, optional): Custom questions
- answers (array, optional): Answers to custom questions
- barcodes (array): Entry bar codes
- team (object, optional): Team information
- affiliate (string, optional): Affiliate code
- checked_in (boolean): true = Checked in
- cancelled (boolean): true = Cancelled
- refunded (boolean): true = Receives refund
- status (string): Attendee status
- event_id (string): Event ID
- order_id (string): Order ID
- guestlist_id (string): Guest list ID (null = not a guest)
- invited_by (string): Who invited guest (null = not a guest)
- delivery_method (string): will_call, electronic, standard_shipping, third_party_shipping

ATTENDEE COSTS:
- base_price (currency): Price excluding fees/tax (don't expose if include_fee used)
- eventbrite_fee (currency): Fee (don't expose if include_fee used)
- tax (currency): Tax amount
- payment_fee (currency): Payment processing fee
- gross (currency): Total cost (base_price + eventbrite_fee + payment_fee + tax)

ATTENDEE PROFILE:
- name (string): Full name (use instead of first_name/last_name)
- email (string): Email address
- first_name, last_name (string): Use name instead
- prefix, suffix (string, optional): Title/honorific
- age (integer, optional): Age
- job_title, company, website, blog (string, optional)
- gender (string, optional): male or female
- birth_date (date, optional): Birth date
- cell_phone (string, optional): Mobile number

ATTENDEE ADDRESSES:
- home, ship, work (address, optional): Home, shipping, work addresses

ATTENDEE BARCODES:
- barcode (string): Barcode contents (null if: printable tickets off, delivery method mismatch, not electronic delivery)
- status (string): unused, used, or refunded
- created, changed (datetime): Creation and last change times
- is_printed (boolean): true = Ticket printed

AVAILABLE EXPANSIONS:
- event: Attendee's Event
- order: Attendee's Order
- promotional_code: Promo code applied to Order
- assigned_number: Bib number for race/endurance events
- answers: Answers to custom questions
- survey: Custom questions presented
- survey_responses: Responses to survey questions
- assigned_unit: Seating assignment details (reserved seating events)
- contact_list_preferences: Email opt-in preferences

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          attendee_id: { type: 'string', description: 'Attendee ID (required)' }
        },
        required: ['event_id', 'attendee_id']
      }
    };
  }

  async execute(args: { event_id: string; attendee_id: string }): Promise<any> {
    const { event_id, attendee_id } = args;
    logger.info('Retrieving attendee', { event_id, attendee_id });
    try {
      const response = await this.client.get(`/events/${event_id}/attendees/${attendee_id}/`);
      logger.info('Attendee retrieved successfully', { event_id, attendee_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve attendee', { event_id, attendee_id, error: error.message });
      throw error;
    }
  }
}
