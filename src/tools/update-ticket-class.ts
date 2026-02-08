import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UpdateTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_ticket_class',
      description: `Update an existing Ticket Class for an event.

ENDPOINT: POST /events/{event_id}/ticket_classes/{ticket_class_id}/

Supports partial updates. After May 7, 2020, inventory_tier_id is required for tiered events.

TICKET CLASS OBJECT - PUBLIC FIELDS (can be updated):
- name (string): Ticket Class name
- description (string): Ticket Class description
- sorting (integer): Order in purchase flow
- cost (currency): Display cost (format: "CURRENCY,amount_in_cents" e.g., "USD,1000" for $10.00)
- donation (boolean): Is donation ticket
- free (boolean): Is free ticket
- minimum_quantity (integer): Minimum tickets per Order
- maximum_quantity (integer): Maximum tickets per Order
- delivery_methods (array): electronic, will_call, standard_shipping, third_party_shipping
- image_id (string): Image ID for ticket class

TICKET CLASS OBJECT - PRIVATE FIELDS (can be updated):
- quantity_total (integer): Total number available
- capacity (integer): Number available for sale
- hidden (boolean): Hidden from public
- sales_start (string): When sales begin (ISO 8601 datetime)
- sales_end (string): When sales end (ISO 8601 datetime)
- sales_start_after (string): Ticket Class ID that triggers sales start
- include_fee (boolean): Fee included in price (cannot use with split_fee)
- split_fee (boolean): Fee shown separately
- hide_description (boolean): Hide description on listing page
- hide_sale_dates (boolean): Hide sale dates on event page
- auto_hide (boolean): Hide when not for sale
- auto_hide_before (datetime): Override auto-hide disable time
- auto_hide_after (datetime): Override auto-hide enable time
- inventory_tier_id (string): Inventory tier ID (required for tiered events)
- order_confirmation_message (string): Message when Order completed
- secondary_assignment_enabled (boolean): Secondary barcode assignment (RFID)

POSSIBLE ERRORS (400):
- AUTO_HIDE_NOT_SET: Must select auto hide setting
- BAD_QUANTITIES: Sum of tickets doesn't equal total available
- COST_GREATER_THAN_FEE: Cost must be greater than fee
- CURRENCY_MISMATCH: Event and ticket currency must match
- DONATION_AND_COST: Cannot be both donation and charged ticket
- DONATION_AND_FREE: Cannot be both donation and free ticket
- DONATION_AND_MIN_QUANTITY: Set minimum quantity for donation ticket
- FREE_AND_COST: Cannot be both free and charged ticket
- INSUFFICIENT_PACKAGE: Need to upgrade package
- INVALID_DELIVERY_METHOD: Delivery method not allowed for this organization
- INVALID_EVENT: Event not qualified to have tickets
- INVALID_EVENT_ID: Event ID must match ticket's event
- INVALID_INVENTORY_TIER_ID: Cannot change inventory tier of ticket

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          ticket_class_id: { type: 'string', description: 'Ticket Class ID (required)' },
          name: { type: 'string', description: 'Ticket name' },
          description: { type: 'string', description: 'Ticket description' },
          quantity_total: { type: 'integer', description: 'Total available' },
          cost: { type: 'string', description: 'Cost (CURRENCY,cents)' },
          free: { type: 'boolean', description: 'Is free' },
          donation: { type: 'boolean', description: 'Is donation' },
          minimum_quantity: { type: 'integer', description: 'Min per order' },
          maximum_quantity: { type: 'integer', description: 'Max per order' },
          sales_start: { type: 'string', description: 'Sales start (ISO 8601)' },
          sales_end: { type: 'string', description: 'Sales end (ISO 8601)' },
          sales_start_after: { type: 'string', description: 'Trigger ticket ID' },
          hidden: { type: 'boolean', description: 'Is hidden' },
          auto_hide: { type: 'boolean', description: 'Auto-hide when not on sale' },
          auto_hide_before: { type: 'string', description: 'Auto-hide before time' },
          auto_hide_after: { type: 'string', description: 'Auto-hide after time' },
          include_fee: { type: 'boolean', description: 'Include fee in price' },
          hide_description: { type: 'boolean', description: 'Hide description' },
          hide_sale_dates: { type: 'boolean', description: 'Hide sale dates' },
          delivery_methods: { type: 'array', items: { type: 'string' }, description: 'Delivery methods' },
          inventory_tier_id: { type: 'string', description: 'Inventory tier ID' },
          order_confirmation_message: { type: 'string', description: 'Confirmation message' },
          secondary_assignment_enabled: { type: 'boolean', description: 'Secondary barcode enabled' }
        },
        required: ['event_id', 'ticket_class_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ticket_class_id, ...updateData } = args;
    logger.info('Updating ticket class', { event_id, ticket_class_id });
    try {
      const response = await this.client.post(`/events/${event_id}/ticket_classes/${ticket_class_id}/`, { ticket_class: updateData });
      logger.info('Ticket class updated successfully', { event_id, ticket_class_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to update ticket class', { event_id, ticket_class_id, error: error.message });
      throw error;
    }
  }
}
