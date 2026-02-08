import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetOrderTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_order',
      description: 'Retrieve a specific order by order ID. Returns complete order information including order owner details (name, email), costs breakdown (base_price, eventbrite_fee, payment_fee, tax, gross, discount_amount), event_id, time_remaining, status, and optionally custom questions/answers and promo_code. The order object contains financial and transactional information. Use the attendee object to get attendee information. Order objects are private and only available to the user and order owner.',
      inputSchema: {
        type: 'object',
        properties: {
          order_id: {
            type: 'string',
            description: 'The ID of the order to retrieve'
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
