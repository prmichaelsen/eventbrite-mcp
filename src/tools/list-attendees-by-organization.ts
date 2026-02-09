import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListAttendeesByOrganizationTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_attendees_by_organization',
      description: `List Attendees of Organization's Events.

ENDPOINT: GET /organizations/{organization_id}/attendees/

Returns paginated response.

PARAMETERS:
- status: attending, not_attending
- changed_since: Filter by resource changed on/after time

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' },
          status: { type: 'string', description: 'Status filter' },
          changed_since: { type: 'string', description: 'Changed since datetime' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { organization_id, status, changed_since } = args;
    logger.info('Listing attendees by organization', { organization_id });
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (changed_since) params.append('changed_since', changed_since);
      const endpoint = params.toString() ? `/organizations/${organization_id}/attendees/?${params.toString()}` : `/organizations/${organization_id}/attendees/`;
      const response = await this.client.get(endpoint);
      logger.info('Attendees by organization retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list attendees by organization', { organization_id, error: error.message });
      throw error;
    }
  }
}
