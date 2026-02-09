import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CalculateItemPricingTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'calculate_item_pricing',
      description: `Calculate hypothetical fees for ticket pricing.

ENDPOINT: POST /pricing/calculate_price_for_item/

Calculates Eventbrite fees for given price based on scope (organization, event, ticket_class, assortment_plan).

PARAMETERS:
- base_price (string, required): Format "CURRENCY,amount_in_cents"
- country (string, required): ISO 3166 2-letter code
- scope (object, required): type (organization/event/ticket_class/assortment_plan) and identifier
- absorb_fees (boolean): Include fees in base price
- absorb_taxes (boolean): Include taxes in base price
- payment_type: eventbrite, authnet, paypal
- channel: web, atd

ERRORS (400):
- PRICING_MODEL_NOT_SUPPORTED, INVALID_CURRENCY_COUNTRY_COMBINATION, BASE_PRICE_TOO_LOW_TO_ABSORB, ARGUMENTS_ERROR

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          base_price: { type: 'string', description: 'Base price (required, e.g., "USD,1000")' },
          country: { type: 'string', description: 'Country code (required)' },
          scope: { type: 'object', description: 'Scope object with type and identifier (required)' },
          absorb_fees: { type: 'boolean', description: 'Absorb fees' },
          absorb_taxes: { type: 'boolean', description: 'Absorb taxes' },
          payment_type: { type: 'string', description: 'Payment type' },
          channel: { type: 'string', description: 'Sales channel' }
        },
        required: ['base_price', 'country', 'scope']
      }
    };
  }

  async execute(args: any): Promise<any> {
    logger.info('Calculating item pricing');
    try {
      const response = await this.client.post('/pricing/calculate_price_for_item/', args);
      logger.info('Item pricing calculated successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to calculate item pricing', { error: error.message });
      throw error;
    }
  }
}
