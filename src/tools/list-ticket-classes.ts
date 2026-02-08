import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListTicketClassesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_ticket_classes',
      description: `List all ticket classes for an event.

ENDPOINT: GET /events/{event_id}/ticket_classes/

Returns paginated list of ticket classes with complete details including name, description, cost, fee, capacity, quantity_sold, sales dates, hidden status, and delivery methods.

TICKET CLASS TYPES:
- Free: No cost, no payout info required
- Paid: Has cost in event's currency
- Donation: Buyer enters amount at checkout

RESPONSE INCLUDES:
- ticket_classes (array): List of Ticket Class objects
- pagination: Pagination information

TICKET CLASS FIELDS RETURNED:
PUBLIC:
- name, description, sorting, cost, fee
- donation, free, minimum_quantity, maximum_quantity
- has_pdf_ticket, delivery_methods, on_sale_status, image_id

PRIVATE (Organization Members):
- capacity, quantity_sold, hidden
- sales_start, sales_end, sales_end_relative, sales_start_after
- include_fee, split_fee, hide_description, hide_sale_dates
- auto_hide, auto_hide_before, auto_hide_after
- order_confirmation_message, secondary_assignment_enabled

FILTERING:
- pos (optional): Filter by point of sale
  * online: Online sales
  * at_the_door: At-the-door sales
  * lock_box: Lock box sales

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'Event ID (required)'
          },
          pos: {
            type: 'string',
            description: 'Filter by point of sale (optional): online, at_the_door, lock_box'
          }
        },
        required: ['event_id']
      }
    };
  }

  async execute(args: { event_id: string; pos?: string }): Promise<any> {
    const { event_id, pos } = args;

    logger.info('Listing ticket classes', { event_id, pos });

    try {
      let endpoint = `/events/${event_id}/ticket_classes/`;
      if (pos) {
        endpoint += `?pos=${encodeURIComponent(pos)}`;
      }

      const response = await this.client.get(endpoint);

      logger.info('Ticket classes retrieved successfully', { 
        event_id, 
        count: (response as any).ticket_classes?.length 
      });
      return response;
    } catch (error: any) {
      logger.error('Failed to list ticket classes', { event_id, error: error.message });
      throw error;
    }
  }
}
