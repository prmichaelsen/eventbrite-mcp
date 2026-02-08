import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListDiscountsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_discounts',
      description: `List Discounts by Organization.

ENDPOINT: GET /organizations/{organization_id}/discounts/

Returns paginated response.

FILTERS:
- scope (required): event, multi_events, user
- code_filter: Approximate match code/name
- code: Exact match code/name
- type: coded, access, public, hold
- ticket_group_id: Ticket Group ID
- event_id: Event ID (required for event scope)
- order_by: code_asc, code_desc, discount_type_asc, discount_type_desc, start_asc, start_desc
- hold_ids: Hold IDs (format: H123 or I123)

ERRORS (400):
- CODE_AND_CODE_FILTER_PROVIDED: Only one of code or code_filter
- INVALID_USAGE_FOR_EVENT_ID: Event ID cannot be used with multi_events scope
- ORDER_BY_NOT_SUPPORTED: Must provide code or code_filter for sorting

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          scope: { type: 'string', description: 'Scope: event, multi_events, user (required)' },
          code_filter: { type: 'string', description: 'Approximate match' },
          code: { type: 'string', description: 'Exact match' },
          type: { type: 'string', description: 'Type filter' },
          event_id: { type: 'string', description: 'Event ID' },
          ticket_group_id: { type: 'string', description: 'Ticket Group ID' },
          order_by: { type: 'string', description: 'Sort order' },
          hold_ids: { type: 'array', items: { type: 'string' }, description: 'Hold IDs' }
        },
        required: ['organization_id', 'scope']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, scope, code_filter, code, type, event_id, ticket_group_id, order_by, hold_ids } = args;
    logger.info('Listing discounts', { organization_id, scope });
    try {
      const params = new URLSearchParams({ scope });
      if (code_filter) params.append('code_filter', code_filter);
      if (code) params.append('code', code);
      if (type) params.append('type', type);
      if (event_id) params.append('event_id', event_id);
      if (ticket_group_id) params.append('ticket_group_id', ticket_group_id);
      if (order_by) params.append('order_by', order_by);
      if (hold_ids) hold_ids.forEach((id: string) => params.append('hold_ids', id));
      const response = await this.client.get(`/organizations/${organization_id}/discounts/?${params.toString()}`);
      logger.info('Discounts retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list discounts', { organization_id, error: error.message });
      throw error;
    }
  }
}
