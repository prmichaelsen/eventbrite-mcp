import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListFeeRatesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_fee_rates',
      description: `List all available Pricing rates.

ENDPOINT: GET /pricing/fee_rates/

Returns paginated response.

PARAMETERS (all required):
- country: ISO 3166 alpha-2 code
- currency: ISO 4217 3-character code
- plan: any, package1, package2
- payment_type: any, eventbrite, authnet, moneris, paypal, google, manual, free, offline, cash, check, invoice
- channel: any, atd, web
- item_type: any, ticket, product

ERRORS (400):
- INVALID_CURRENCY_COUNTRY_COMBINATION, ARGUMENTS_ERROR

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          country: { type: 'string', description: 'Country code (required)' },
          currency: { type: 'string', description: 'Currency code (required)' },
          plan: { type: 'string', description: 'Plan' },
          payment_type: { type: 'string', description: 'Payment type' },
          channel: { type: 'string', description: 'Channel' },
          item_type: { type: 'string', description: 'Item type' }
        },
        required: ['country', 'currency']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { country, currency, plan, payment_type, channel, item_type } = args;
    logger.info('Listing fee rates', { country, currency });
    try {
      const params = new URLSearchParams({ country, currency });
      if (plan) params.append('plan', plan);
      if (payment_type) params.append('payment_type', payment_type);
      if (channel) params.append('channel', channel);
      if (item_type) params.append('item_type', item_type);
      const response = await this.client.get(`/pricing/fee_rates/?${params.toString()}`);
      logger.info('Fee rates retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to list fee rates', { error: error.message });
      throw error;
    }
  }
}
