import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateDiscountTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_discount',
      description: `Update a Discount by ID.

ENDPOINT: POST /discounts/{discount_id}/

Same fields as create_discount.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          discount_id: { type: 'string', description: 'Discount ID (required)' },
          code: { type: 'string', description: 'Discount code/name' },
          type: { type: 'string', description: 'Type: access, coded, public, hold' },
          amount_off: { type: 'string', description: 'Fixed amount off' },
          percent_off: { type: 'string', description: 'Percentage off' },
          quantity_available: { type: 'integer', description: 'Usage limit' },
          start_date: { type: 'string', description: 'Start date' },
          end_date: { type: 'string', description: 'End date' },
          ticket_class_ids: { type: 'array', items: { type: 'string' }, description: 'Ticket Class IDs' },
          event_id: { type: 'string', description: 'Event ID' }
        },
        required: ['discount_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { discount_id, ...updateData } = args;
    logger.info('Updating discount', { discount_id });
    try {
      const response = await this.client.post(`/discounts/${discount_id}/`, { discount: updateData });
      logger.info('Discount updated successfully', { discount_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update discount', { discount_id, error: error.message });
      throw error;
    }
  }
}
