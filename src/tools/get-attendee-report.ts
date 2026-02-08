import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetAttendeeReportTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_attendee_report',
      description: `Retrieve an Attendee Report by Event ID or status.

ENDPOINT: GET /reports/attendees/

Same parameters as sales report.

ERRORS (400):
- ARGUMENTS_ERROR, CURRENCY_MISMATCH, INVALID, INVALID_PARAMETER

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_ids: { type: 'array', items: { type: 'string' }, description: 'Event IDs (required)' },
          event_status: { type: 'string', description: 'Event status' },
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
    logger.info('Getting attendee report', { event_ids });
    try {
      const params = new URLSearchParams();
      event_ids.forEach((id: string) => params.append('event_ids', id));
      if (event_status) params.append('event_status', event_status);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);
      if (timezone) params.append('timezone', timezone);
      const response = await this.client.get(`/reports/attendees/?${params.toString()}`);
      logger.info('Attendee report retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to get attendee report', { error: error.message });
      throw error;
    }
  }
}
