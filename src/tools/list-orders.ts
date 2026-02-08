import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrdersTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_orders',
      description: `List orders for an event or organization.

ENDPOINT: GET /events/{event_id}/orders/ OR GET /organizations/{organization_id}/orders/

Returns paginated list of orders. Orders are private - only available to authorized users.

FILTERING OPTIONS:
- status: Filter by order status
  * active: Attending orders
  * inactive: Not attending orders
  * both: All orders
  * all_not_deleted: Active and inactive, but not deleted
- changed_since (datetime): Only orders changed on/after this time (ISO 8601)
- last_item_seen (string): With changed_since, orders after this time with ID > last_item_seen
- only_emails (array): Only include orders from these email addresses
- exclude_emails (array): Exclude orders from these email addresses
- refund_request_statuses (array, event only): Filter by refund status
  * completed, pending, outside_policy, disputed, denied

ORDER FIELDS RETURNED:
- created, changed: Timestamps
- name, first_name, last_name, email: Order owner info
- costs: Complete breakdown (base_price, display_price, eventbrite_fee, payment_fee, tax, gross, discount_amount, discount_type)
- event_id: Event ID
- time_remaining: Seconds to complete
- status: Order status
- promo_code (optional): Discount code

RESPONSE:
- orders (array): List of Order objects
- pagination: Pagination information

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (use this OR organization_id)' },
          organization_id: { type: 'string', description: 'Organization ID (use this OR event_id)' },
          status: { type: 'string', description: 'Filter: active, inactive, both, all_not_deleted' },
          changed_since: { type: 'string', description: 'ISO 8601 datetime' },
          only_emails: { type: 'array', items: { type: 'string' }, description: 'Include these emails' },
          exclude_emails: { type: 'array', items: { type: 'string' }, description: 'Exclude these emails' },
          refund_request_statuses: { type: 'array', items: { type: 'string' }, description: 'Event only: completed, pending, outside_policy, disputed, denied' },
          last_item_seen: { type: 'string', description: 'For pagination with changed_since' }
        },
        required: []
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, organization_id, status, changed_since, only_emails, exclude_emails, refund_request_statuses, last_item_seen } = args;
    if (!event_id && !organization_id) throw new Error('Either event_id or organization_id must be provided');
    if (event_id && organization_id) throw new Error('Provide either event_id or organization_id, not both');
    logger.info('Listing orders', { event_id, organization_id, status });
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append('status', status);
      if (changed_since) queryParams.append('changed_since', changed_since);
      if (last_item_seen) queryParams.append('last_item_seen', last_item_seen);
      if (only_emails) only_emails.forEach((email: string) => queryParams.append('only_emails', email));
      if (exclude_emails) exclude_emails.forEach((email: string) => queryParams.append('exclude_emails', email));
      if (refund_request_statuses) refund_request_statuses.forEach((s: string) => queryParams.append('refund_request_statuses', s));
      const queryString = queryParams.toString();
      const baseEndpoint = event_id ? `/events/${event_id}/orders/` : `/organizations/${organization_id}/orders/`;
      const endpoint = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
      const response = await this.client.get(endpoint);
      logger.info('Orders retrieved successfully', { event_id, organization_id, count: (response as any).orders?.length });
      return response;
    } catch (error: any) {
      logger.error('Failed to list orders', { event_id, organization_id, error: error.message });
      throw error;
    }
  }
}
