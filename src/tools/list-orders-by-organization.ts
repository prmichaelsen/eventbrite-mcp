import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrdersByOrganizationTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_orders_by_organization',
      description: `List orders for an organization. Returns paginated response.

ENDPOINT: GET /organizations/{organization_id}/orders/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          status: { type: 'string', description: 'Status filter' },
          changed_since: { type: 'string', description: 'Changed since' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, status, changed_since } = args;
    logger.info('Listing orders by organization', { organization_id });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (changed_since) params.append('changed_since', changed_since);
      const endpoint = params.toString() ? `/organizations/${organization_id}/orders/?${params.toString()}` : `/organizations/${organization_id}/orders/`;
      const response = await this.client.get(endpoint);
      logger.info('Orders by organization retrieved', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list orders by organization', { organization_id, error: error.message });
      throw error;
    }
  }
}
