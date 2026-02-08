import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class DeleteDiscountTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'delete_discount',
      description: `Delete a Discount.

ENDPOINT: DELETE /discounts/{discount_id}/

Only unused discounts can be deleted. Cannot be restored after deletion.

ERRORS (400):
- DISCOUNT_CANNOT_BE_DELETED: Discount has been used, cannot delete

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
    logger.info('Deleting discount', { discount_id });
    try {
      const response = await this.client.delete(`/discounts/${discount_id}/`);
      logger.info('Discount deleted successfully', { discount_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to delete discount', { discount_id, error: error.message });
      throw error;
    }
  }
}
