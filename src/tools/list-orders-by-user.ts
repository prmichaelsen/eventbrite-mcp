import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrdersByUserTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_orders_by_user',
      description: `List Orders by User ID. Returns paginated response.

ENDPOINT: GET /users/{user_id}/orders/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'string', description: 'User ID (required)' },
          changed_since: { type: 'string', description: 'Changed since' },
          time_filter: { type: 'string', description: 'Time filter' }
        },
        required: ['user_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { user_id, changed_since, time_filter } = args;
    logger.info('Listing orders by user', { user_id });
    try {
      const params = new URLSearchParams();
      if (changed_since) params.append('changed_since', changed_since);
      if (time_filter) params.append('time_filter', time_filter);
      const endpoint = params.toString() ? `/users/${user_id}/orders/?${params.toString()}` : `/users/${user_id}/orders/`;
      const response = await this.client.get(endpoint);
      logger.info('Orders by user retrieved', { user_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list orders by user', { user_id, error: error.message });
      throw error;
    }
  }
}
