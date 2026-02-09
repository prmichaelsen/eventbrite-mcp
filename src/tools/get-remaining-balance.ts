import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetRemainingBalanceTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_remaining_balance',
      description: `Get event-level balance.

ENDPOINT: GET /balance/{public_organization_id}/events/{public_event_id}/

Requires event.billing.payouts_summary permission.

AUTHENTICATION: Requires Authorization Bearer SOA_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          public_organization_id: { type: 'string', description: 'Public organization ID (required)' },
          public_event_id: { type: 'string', description: 'Public event ID (required)' }
        },
        required: ['public_organization_id', 'public_event_id']
      }
    };
  }

  async execute(args: { public_organization_id: string; public_event_id: string }): Promise<any> {
    const { public_organization_id, public_event_id } = args;
    logger.info('Getting remaining balance', { public_organization_id, public_event_id });
    try {
      const response = await this.client.get(`/balance/${public_organization_id}/events/${public_event_id}/`);
      logger.info('Remaining balance retrieved', { public_organization_id, public_event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get remaining balance', { public_organization_id, public_event_id, error: error.message });
      throw error;
    }
  }
}
