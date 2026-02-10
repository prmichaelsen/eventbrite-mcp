import { EventbriteClient } from '../eventbrite/client.js';

export class CreateMultipleInventoryTiersTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_multiple_inventory_tiers',
      description: `Create Multiple Inventory Tiers (Bulk)

**Endpoint:** POST /events/{event_id}/inventory_tiers/

Creates multiple inventory tiers in a single request for efficient bulk operations.

**Authentication:** Requires a valid Eventbrite API token with event management permissions.

**Use Cases:**
- Set up multiple inventory tiers at once during event creation
- Bulk import inventory tier configurations
- Efficiently configure complex inventory structures
- Reduce API calls when setting up many tiers

**Inventory Tier Fields:**
- name: Tier name (required)
- quantity: Number of tickets in this tier
- price: Price for this tier (if applicable)
- sales_start: When sales begin for this tier
- sales_end: When sales end for this tier
- minimum_quantity: Minimum tickets per order
- maximum_quantity: Maximum tickets per order

**Limits:**
- Maximum 100 inventory tiers per event
- All tiers must belong to the same event

**Error Codes:**
- 400: Invalid tier data or exceeds maximum tiers
- 401: Authentication required
- 403: Insufficient permissions
- 404: Event not found`,
      inputSchema: {
        type: 'object' as const,
        properties: {
          event_id: {
            type: 'string',
            description: 'The event ID to create inventory tiers for'
          },
          inventory_tiers: {
            type: 'array',
            description: 'Array of inventory tier objects to create',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'string' },
                sales_start: { type: 'string' },
                sales_end: { type: 'string' },
                minimum_quantity: { type: 'number' },
                maximum_quantity: { type: 'number' }
              }
            }
          }
        },
        required: ['event_id', 'inventory_tiers']
      }
    };
  }

  async execute(args: { event_id: string; inventory_tiers: any[] }): Promise<any> {
    try {
      const response = await this.client.post(
        `/events/${args.event_id}/inventory_tiers/`,
        { inventory_tiers: args.inventory_tiers }
      );
      return { content: JSON.stringify(response, null, 2) };
    } catch (error) {
      return { content: `Error creating multiple inventory tiers: ${error}`, isError: true };
    }
  }
}
