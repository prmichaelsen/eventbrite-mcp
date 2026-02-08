import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetOrderTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_order',
      description: `Retrieve an Order by Order ID.

ENDPOINT: GET /orders/{order_id}/

The Order object represents an order made against Eventbrite for one or more Ticket Classes. A single Order can be made up of multiple tickets. Contains Order's financial and transactional information. Use Attendee object for attendee information.

Order objects are private - only available to User and Order owner.

ORDER FIELDS:
- created (datetime): When Order was placed and Attendee created
- changed (datetime): Last change to Attendee
- name (string): Order owner name (use instead of first_name/last_name)
- first_name (string): Order owner first name (deprecated, use name)
- last_name (string): Order owner last name (deprecated, use name)
- email (string): Order owner email
- costs (object): Cost breakdown
- event_id (string): Order's Event ID
- time_remaining (number): Time to complete Order (seconds)
- questions (array, optional): Custom questions for Order owner
- answers (array, optional): Answers to custom questions
- promo_code (string, optional): Discount code applied
- status (string): Order status

ORDER COSTS BREAKDOWN:
- base_price (currency): Amount without fees/tax (use display_price if include_fee used)
- display_price (currency): Correct amount when include_fee used
- display_fee (currency): Fees/tax included (absorbed) in displayed price
- gross (currency): Total Order amount
- eventbrite_fee (currency): Eventbrite fee (don't expose to Order owner)
- payment_fee (currency): Payment processor fee
- tax (currency): Tax amount
- display_tax (object): Tax with name
- price_before_discount (currency): Price before discount applied
- discount_amount (currency): Total discount (if applied)
- discount_type (string): coded, access, public, hold, or null
- fee_components (list): Fee cost components
- tax_components (list): Tax cost components
- shipping_components (list): Shipping cost components
- has_gts_tax (boolean): Has GTS tax
- tax_name (string): Tax name if applicable

AVAILABLE EXPANSIONS:
- event: Order's Event
- attendees: Order's Attendees
- merchandise: Merchandise in Order
- concierge: Order's concierge
- refund_requests: Order's refund request
- survey: Order's custom questions
- survey_responses: Responses to survey questions
- answers: Answers to custom questions
- ticket_buyer_settings: Purchaser information including confirmation messages
- contact_list_preferences: Email opt-in preferences

POSSIBLE ERRORS (400):
- ORDER_EXPIRED: The order is expired

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'Order ID (required)'
          }
        },
        required: ['order_id']
      }
    };
  }

  async execute(args: { order_id: string }): Promise<any> {
    const { order_id } = args;
    logger.info('Retrieving order', { order_id });
    try {
      const response = await this.client.get(`/orders/${order_id}/`);
      logger.info('Order retrieved successfully', { order_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve order', { order_id, error: error.message });
      throw error;
    }
  }
}
