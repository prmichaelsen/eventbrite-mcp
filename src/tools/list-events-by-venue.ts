import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListEventsByVenueTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_events_by_venue',
      description: `List Events by Venue ID.

ENDPOINT: GET /venues/{venue_id}/events/

Returns paginated response.

PARAMETERS:
- status: draft, live, started, ended, completed, canceled, all
- order_by: start_asc, start_desc, created_asc, created_desc
- start_date: Date range filter
- only_public: Filter public events

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          venue_id: { type: 'string', description: 'Venue ID (required)' },
          status: { type: 'string', description: 'Event status filter' },
          order_by: { type: 'string', description: 'Sort order' },
          only_public: { type: 'boolean', description: 'Filter public events' }
        },
        required: ['venue_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { venue_id, status, order_by, only_public } = args;
    logger.info('Listing events by venue', { venue_id });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (order_by) params.append('order_by', order_by);
      if (only_public !== undefined) params.append('only_public', only_public.toString());
      const endpoint = params.toString() ? `/venues/${venue_id}/events/?${params.toString()}` : `/venues/${venue_id}/events/`;
      const response = await this.client.get(endpoint);
      logger.info('Events by venue retrieved successfully', { venue_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list events by venue', { venue_id, error: error.message });
      throw error;
    }
  }
}
