import { EventbriteClient } from '../eventbrite/client.js';

export class UpdateMultipleInventoryTiersTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'update_multiple_inventory_tiers',
      description: `Update Multiple Inventory Tiers (Bulk)

**Endpoint:** POST /events/{event_id}/inventory_tiers/

Updates multiple inventory tiers in a single request for efficient bulk operations.

**Authentication:** Requires a valid Eventbrite API token with event management permissions.

**Use Cases:**
- Bulk update tier quantities or prices
- Synchronize tier configurations across multiple tiers
- Efficiently modify complex inventory structures
- Reduce API calls when updating many tiers

**Updatable Fields:**
- name: Tier name
- quantity: Number of tickets in this tier
- price: Price for this tier
- sales_start: When sales begin for this tier
- sales_end: When sales end for this tier
- minimum_quantity: Minimum tickets per order
- maximum_quantity: Maximum tickets per order

**Important Notes:**
- Each tier object must include its ID
- Only provided fields will be updated (partial updates supported)
- All tiers must belong to the specified event

**Error Codes:**
- 400: Invalid tier data or tier IDs
- 401: Authentication required
- 403: Insufficient permissions
- 404: Event or tier not found`,
      inputSchema: {
        type: 'object' as const,
        properties: {
          event_id: {
            type: 'string',
            description: 'The event ID containing the inventory tiers'
          },
          inventory_tiers: {
            type: 'array',
            description: 'Array of inventory tier objects to update (must include tier IDs)',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
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
      return { content: `Error updating multiple inventory tiers: ${error}`, isError: true };
    }
  }
}
