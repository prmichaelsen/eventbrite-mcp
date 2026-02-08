import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateDiscountTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_discount',
      description: `Create a new Discount.

ENDPOINT: POST /organizations/{organization_id}/discounts/

DISCOUNT TYPES:
- Public: Displays publicly (single event, no apostrophes/special chars except -_()/)
- Coded: Secret code required (no spaces/apostrophes/special chars except -_()/)
- Access Code: Secret code for hidden tickets (no spaces/apostrophes/special chars except -_()/)
- Hold: Unlock seats on hold

DISCOUNT SCOPE:
- event_id + ticket_class_ids: Specific tickets in single event
- event_id only: All tickets in single event
- ticket_group_id: Ticket Group discount
- Neither: All tickets for all organization events (including future)

FIELDS:
- code (string, required): Name (public) or code (coded/access)
- type (string, required): access, coded, public, hold
- amount_off (decimal): Fixed amount 0.01-99999.99 (event currency, 2 decimals)
- percent_off (decimal): Percentage 1.00-100.00 (2 decimals)
- quantity_available (integer): Usage limit (0 = unlimited)
- start_date (local datetime): Usable from (empty = immediately)
- start_date_relative (integer): Seconds before event start
- end_date (datetime): Usable until (empty = event end_date)
- end_date_relative (integer): Seconds before event start
- ticket_class_ids (list): Ticket Class IDs (empty = all)
- event_id (string): Single Event ID
- ticket_group_id (string): Ticket Group ID
- hold_ids (list): Hold IDs to unlock

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          code: { type: 'string', description: 'Discount code/name (required)' },
          type: { type: 'string', description: 'Type: access, coded, public, hold (required)' },
          amount_off: { type: 'string', description: 'Fixed amount off (decimal)' },
          percent_off: { type: 'string', description: 'Percentage off (decimal)' },
          quantity_available: { type: 'integer', description: 'Usage limit (0=unlimited)' },
          start_date: { type: 'string', description: 'Start date (ISO 8601)' },
          end_date: { type: 'string', description: 'End date (ISO 8601)' },
          ticket_class_ids: { type: 'array', items: { type: 'string' }, description: 'Ticket Class IDs' },
          event_id: { type: 'string', description: 'Event ID' },
          ticket_group_id: { type: 'string', description: 'Ticket Group ID' },
          hold_ids: { type: 'array', items: { type: 'string' }, description: 'Hold IDs' }
        },
        required: ['organization_id', 'code', 'type']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, ...discountData } = args;
    logger.info('Creating discount', { organization_id });
    try {
      const response = await this.client.post(`/organizations/${organization_id}/discounts/`, { discount: discountData });
      logger.info('Discount created successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create discount', { organization_id, error: error.message });
      throw error;
    }
  }
}
