import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListEventsBySeriesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_events_by_series',
      description: `List Events by Event Series ID.

ENDPOINT: GET /series/{event_series_id}/events/

Returns paginated response.

PARAMETERS:
- time_filter: all, past, current_future
- order_by: start_asc, start_desc, created_asc, created_desc
- start_date.range_start, start_date.range_end: Date range

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_series_id: { type: 'string', description: 'Event Series ID (required)' },
          time_filter: { type: 'string', description: 'Time filter' },
          order_by: { type: 'string', description: 'Sort order' }
        },
        required: ['event_series_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_series_id, time_filter, order_by } = args;
    logger.info('Listing events by series', { event_series_id });
    try {
      const params = new URLSearchParams();
      if (time_filter) params.append('time_filter', time_filter);
      if (order_by) params.append('order_by', order_by);
      const endpoint = params.toString() ? `/series/${event_series_id}/events/?${params.toString()}` : `/series/${event_series_id}/events/`;
      const response = await this.client.get(endpoint);
      logger.info('Events by series retrieved successfully', { event_series_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list events by series', { event_series_id, error: error.message });
      throw error;
    }
  }
}
