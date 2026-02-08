import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetSalesReportTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_sales_report',
      description: `Retrieve a sales Report by Event ID or status.

ENDPOINT: GET /reports/sales/

PARAMETERS:
- event_ids (array[string], required): Event IDs
- event_status (string): all, live, ended
- start_date, end_date (string): Date range
- filter_by (string): Filter by ticket_ids, currencies
- group_by (string): payment_method, ticket, currency, event, country, etc.
- period (number): Time period in date_facet units
- date_facet (string): fifteen, hour, day, event_day, week, month, year, none
- timezone (string): Timezone (default: first event timezone)

ERRORS (400):
- ARGUMENTS_ERROR, CURRENCY_MISMATCH, INVALID, INVALID_PARAMETER

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_ids: { type: 'array', items: { type: 'string' }, description: 'Event IDs (required)' },
          event_status: { type: 'string', description: 'Event status filter' },
          start_date: { type: 'string', description: 'Start date' },
          end_date: { type: 'string', description: 'End date' },
          timezone: { type: 'string', description: 'Timezone' }
        },
        required: ['event_ids']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_ids, event_status, start_date, end_date, timezone } = args;
    logger.info('Getting sales report', { event_ids });
    try {
      const params = new URLSearchParams();
      event_ids.forEach((id: string) => params.append('event_ids', id));
      if (event_status) params.append('event_status', event_status);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);
      if (timezone) params.append('timezone', timezone);
      const response = await this.client.get(`/reports/sales/?${params.toString()}`);
      logger.info('Sales report retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to get sales report', { error: error.message });
      throw error;
    }
  }
}
