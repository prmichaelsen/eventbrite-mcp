import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetDiscountTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_discount',
      description: `Retrieve a Discount by ID.

ENDPOINT: GET /discounts/{discount_id}/

DISCOUNT TYPES:
- Public: Publicly displays on Event Listing/Checkout (single event only)
- Coded: Requires secret code
- Access Code: Secret code for hidden tickets (optional discount amount)
- Hold: Unlock discount for seats on hold

DISCOUNT FIELDS:
- code (string): Discount name (public) or code (coded/access)
- type (string): access, coded, public, hold
- end_date (datetime): Usable until this date (relative to event timezone)
- end_date_relative (integer): Seconds before event start
- amount_off (decimal): Fixed amount 0.01-99999.99 (uses event currency)
- percent_off (decimal): Percentage 1.00-100.00
- quantity_available (integer): Usage limit (0 = unlimited)
- quantity_sold (integer, readonly): Times used
- start_date (local datetime): Usable from this date
- start_date_relative (integer): Seconds before event start
- ticket_class_ids (list): Ticket Class IDs (empty = all tickets)
- event_id (string): Single Event ID (empty for cross-event)
- ticket_group_id (string): Ticket Group ID
- hold_ids (list): Hold IDs this unlocks

EXPANSIONS:
- event: Single Event for discount
- ticket_group: Ticket Group for discount
- reserved_seating: Reserved seating settings

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          discount_id: { type: 'string', description: 'Discount ID (required)' }
        },
        required: ['discount_id']
      }
    };
  }

  async execute(args: { discount_id: string }): Promise<any> {
    const { discount_id } = args;
    logger.info('Retrieving discount', { discount_id });
    try {
      const response = await this.client.get(`/discounts/${discount_id}/`);
      logger.info('Discount retrieved successfully', { discount_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve discount', { discount_id, error: error.message });
      throw error;
    }
  }
}
