import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_ticket_class',
      description: `Retrieve a Ticket Class by Ticket Class ID.

ENDPOINT: GET /events/{event_id}/ticket_classes/{ticket_class_id}/

The Ticket Class object represents a possible ticket class (i.e. ticket type) for an Event. Multiple different types of tickets for an Event can be purchased in one transaction.

TICKET CLASS TYPES:
- Free: No cost or currency. Event with only free tickets doesn't require payout info
- Paid: Associated cost in Event's currency
- Donation: Order owner enters amount to donate at checkout (no fixed cost)

TICKET CLASS OBJECT - PUBLIC FIELDS:
- name (string): Ticket Class name
- description (string, optional): Ticket Class description
- sorting (integer): Order in purchase flow on event listing page
- cost (currency): Display cost on Ticket Listing page (paid only)
- fee (currency): Display fee on Ticket Listing page (paid only)
- donation (boolean): true = Ticket Class is a Donation
- free (boolean): true = Ticket Class is Free
- minimum_quantity (integer): Minimum tickets per Order
- maximum_quantity (integer): Maximum tickets per Order
- has_pdf_ticket (boolean): true = Attendee receives PDF confirmation
- delivery_methods (list): electronic, will_call, standard_shipping, third_party_shipping
- on_sale_status (string): AVAILABLE or SOLD_OUT
- image_id (string): Image ID for ticket class (used for add-ons)

TICKET CLASS OBJECT - PRIVATE FIELDS (Organization Members only):
- capacity (integer): Number available for sale
- quantity_sold (integer): Number previously sold (excludes real-time purchases)
- hidden (boolean): true = Hidden from public
- sales_start (datetime): When sales begin
- sales_end (datetime): When sales end
- sales_end_relative (object): Relative values for sales_end (series parent tickets only)
- sales_start_after (string): Ticket Class ID that triggers sales start when it sells out
- include_fee (boolean): true = Fee included in displayed price (cannot use with split_fee)
- split_fee (boolean): true = Fee not included, actual_cost and actual_fee shown separately
- hide_description (boolean): true = Description hidden on Ticket Listing page
- hide_sale_dates (boolean): true = Sale dates hidden on event page
- auto_hide (boolean): true = Hidden when not for sale
- auto_hide_before (datetime): Override auto-hide disable time (default: sales_start)
- auto_hide_after (datetime): Override auto-hide enable time (default: sales_end)
- order_confirmation_message (string): Message shown when Order completed
- secondary_assignment_enabled (boolean): true = Secondary barcode assignment enabled (e.g., RFID)

AVAILABLE EXPANSIONS:
Use ?expand=expansion_name to include additional data:
- event: Event for the Ticket Class
- image: Image for the Ticket Class

POSSIBLE ERRORS (400):
- AUTO_HIDE_NOT_SET: Must select an auto hide setting

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'Event ID (required)'
          },
          ticket_class_id: {
            type: 'string',
            description: 'Ticket Class ID (required)'
          }
        },
        required: ['event_id', 'ticket_class_id']
      }
    };
  }

  async execute(args: { event_id: string; ticket_class_id: string }): Promise<any> {
    const { event_id, ticket_class_id } = args;

    logger.info('Retrieving ticket class', { event_id, ticket_class_id });

    try {
      const response = await this.client.get(`/events/${event_id}/ticket_classes/${ticket_class_id}/`);

      logger.info('Ticket class retrieved successfully', { event_id, ticket_class_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve ticket class', { event_id, ticket_class_id, error: error.message });
      throw error;
    }
  }
}
