import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrdersTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_orders',
      description: 'List orders for an event or organization. Returns paginated list of orders with details including created/changed timestamps, order owner name and email, costs breakdown (base_price, display_price, eventbrite_fee, payment_fee, tax, gross), event_id, status, and optionally promo_code. Can filter by status (active, inactive, both, all_not_deleted), changed_since datetime, and email addresses. Orders are private and only available to authorized users.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'Event ID to list orders for (use this OR organization_id, not both)'
          },
          organization_id: {
            type: 'string',
            description: 'Organization ID to list orders for (use this OR event_id, not both)'
          },
          status: {
            type: 'string',
            description: 'Filter by order status',
            enum: ['active', 'inactive', 'both', 'all_not_deleted']
          },
          changed_since: {
            type: 'string',
            description: 'Only return orders changed on or after this datetime (ISO 8601 format)'
          },
          only_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'Only include orders from these email addresses'
          },
          exclude_emails: {
            type: 'array',
            items: { type: 'string' },
            description: 'Exclude orders from these email addresses'
          },
          refund_request_statuses: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by refund request status (event orders only): completed, pending, outside_policy, disputed, denied'
          },
          last_item_seen: {
            type: 'string',
            description: 'For pagination with changed_since - orders changed after this time with ID > last_item_seen'
          }
        },
        required: []
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, organization_id, status, changed_since, only_emails, exclude_emails, refund_request_statuses, last_item_seen } = args;

    if (!event_id && !organization_id) {
      throw new Error('Either event_id or organization_id must be provided');
    }

    if (event_id && organization_id) {
      throw new Error('Provide either event_id or organization_id, not both');
    }

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
      const baseEndpoint = event_id 
        ? `/events/${event_id}/orders/`
        : `/organizations/${organization_id}/orders/`;
      const endpoint = queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;

      const response = await this.client.get(endpoint);

      logger.info('Orders retrieved successfully', { 
        event_id, 
        organization_id,
        count: (response as any).orders?.length 
      });
      return response;
    } catch (error: any) {
      logger.error('Failed to list orders', { event_id, organization_id, error: error.message });
      throw error;
    }
  }
}
