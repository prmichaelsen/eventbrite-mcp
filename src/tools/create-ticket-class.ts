import { EventbriteClient } from '../eventbrite/client.js';
import { CreateTicketClassArgs, TicketClassResult } from '../types/mcp.js';

export class CreateTicketClassTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_ticket_class',
      description: `Create a new Ticket Class.

ENDPOINT: POST /events/{event_id}/ticket_classes/

TICKET CLASS OBJECT:
The Ticket Class object represents a possible ticket class (i.e. ticket type) for an Event. Typically, multiple different types of tickets for an Event can be purchased in one transaction. These ticket types do not necessarily map directly to the one Attendee per one ticket model.

TICKET CLASS TYPES:
- Free: Ticket Classes that have no cost or currency. An Event with only free Ticket Classes is a free Event and doesn't require payout information
- Paid: Ticket Classes with an associated cost in the Event's currency. Currency is specified in the Event object and is duplicated in the Ticket Class object
- Donation: Order owner is prompted to enter at their own discretion an amount to donate during checkout. There is no fixed cost of donation

IMPORTANT NOTES:
- After May 7, 2020, you must provide an inventory_tier_id as part of your request for any ticket_classes you are creating or updating for a tiered event
- Add-On creation: First create an Add-On Inventory Tier with count_against_event_capacity set to false, then provide the inventory_tier_id when creating a new Ticket Class

REQUIRED PARAMETERS:
- event_id (string, required): Event ID
- name (string, optional): Name of this ticket type
- quantity_total (number, optional): Total available number of this ticket, required for non-donation and non-tiered ticket classes. For normal ticket, null or 0 is not allowed. For donation ticket, null or 0 means unlimited. For tiered inventory ticket, null or 0 means capacity is only limited by tier capacity and/or event capacity

OPTIONAL PARAMETERS:
- cost (string, optional): Cost of the ticket (currently currency must match event currency). Format: "USD,4500" for $45.00. The value is in minor currency units (cents for USD)
- description (string, optional): Description of the ticket
- sorting (number, optional): Unsigned integer in the order ticket classes are sorted by
- capacity (number, optional, nullable): Total available number of this ticket. For normal ticket, null or 0 is not allowed. For donation ticket, null or 0 means unlimited. For tiered inventory ticket, null or 0 means capacity is only limited by tier capacity and/or event capacity
- donation (boolean, optional): Is this a donation? (user-supplied cost)
- free (boolean, optional): Is this a free ticket?
- include_fee (boolean, optional): Absorb the fee into the displayed cost
- split_fee (boolean, optional): Absorb the payment fee, but show the eventbrite fee
- hide_description (boolean, optional): Hide the ticket description on the event page
- sales_channels (array, optional): A list of all supported sales channels (["online"], ["online", "atd"], ["atd"])
- sales_start (datetime, optional): When the ticket is available for sale (leave empty for 'when event published')
- sales_end (datetime, optional): When the ticket stops being on sale (leave empty for 'one hour before event start'). Cannot be set on series parent tickets
- sales_end_relative (object, optional): Relative values used to calculate ticket sales_end. Can only be used for series parent tickets
  • relative_to_event (enum, required): start_time or end_time
  • offset (number, required): The amount of time in seconds that the ticket sales are offset before the event start or end. Nonnegative number
- sales_start_after (string, optional): The ID of another ticket class - when it sells out, this class will go on sale
- minimum_quantity (number, optional): Minimum number per order
- maximum_quantity (number): Maximum number per order
- auto_hide (boolean, optional): Hide this ticket when it is not on sale
- auto_hide_before (datetime, optional): Override reveal date for auto-hide
- auto_hide_after (datetime, optional): Override re-hide date for auto-hide
- has_pdf_ticket (boolean, optional): Whether to include pdf ticket or not
- hidden (boolean, optional): Hide this ticket
- order_confirmation_message (string, optional): Order message per ticket type
- delivery_methods (string, optional): A list of the available delivery methods for this ticket class
- inventory_tier_id (string, optional): Optional ID of Inventory Tier with which to associate the ticket class

ERROR RESPONSES:
- 400 AUTO_HIDE_NOT_SET: You must select an auto hide setting
- 400 BAD_QUANTITIES: The sum of tickets across ticket classes is not equal to the sum of total tickets available
- 400 COST_GREATER_THAN_FEE: The cost of the ticket class must be greater than the fee
- 400 CURRENCY_MISMATCH: Event currency ticket currency must match
- 400 DONATION_AND_COST: A ticket cannot be a donation and a charged ticket
- 400 DONATION_AND_FREE: A ticket cannot be a donation and a free ticket
- 400 DONATION_AND_MIN_QUANTITY: Please set a minimum quantity for donation ticket
- 400 FREE_AND_COST: A ticket cannot be a free ticket and a charged ticket
- 400 INSUFFICIENT_PACKAGE: You need to upgrade your package to create more than one ticket
- 400 INVALID_DELIVERY_METHOD: A ticket under this event organization cannot have this delivery method
- 400 INVALID_EVENT: This event is not qualified to have tickets
- 400 INVALID_EVENT_ID: Event id must match the event id associated with the ticket
- 400 INVALID_INVENTORY_TIER_ID: You cannot change the inventory tier of a ticket
- 400 INVALID_TICKET: You cannot update a child ticket directly
- 400 NO_COST: A price must be set for a charged ticket
- 400 NO_QUANTITY_TOTAL: A quantity total must be set for this ticket
- 400 SPLIT_AND_INCLUDE: You cannot split fees and include them in the price of the ticket
- 400 SPLIT_FEES_DEPRECATED: This functionality is being deprecated
- 400 SALES_END_RELATIVE_TOO_FAR_IN_PAST: The ticket sales_end relative can't result in a date < 2000

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'Event ID (required)'
          },
          name: {
            type: 'string',
            description: 'Name of this ticket type (optional)'
          },
          quantityTotal: {
            type: 'number',
            description: 'Total available number of this ticket (required for non-donation and non-tiered ticket classes). For normal ticket, null or 0 is not allowed. For donation ticket, null or 0 means unlimited. For tiered inventory ticket, null or 0 means capacity is only limited by tier capacity and/or event capacity'
          },
          free: {
            type: 'boolean',
            description: 'Is this a free ticket? (optional)'
          },
          cost: {
            type: 'number',
            description: 'Cost of the ticket in minor currency units (e.g., cents for USD). Example: 1000 = $10.00. Must match event currency'
          },
          currency: {
            type: 'string',
            description: 'Currency code (e.g., USD, EUR, GBP). Must match event currency'
          },
          description: {
            type: 'string',
            description: 'Description of the ticket (optional)'
          },
          salesStart: {
            type: 'string',
            description: 'When the ticket is available for sale (optional, ISO 8601 datetime format). Leave empty for "when event published"'
          },
          salesEnd: {
            type: 'string',
            description: 'When the ticket stops being on sale (optional, ISO 8601 datetime format). Leave empty for "one hour before event start". Cannot be set on series parent tickets'
          },
          donation: {
            type: 'boolean',
            description: 'Is this a donation? User-supplied cost (optional)'
          },
          includeFee: {
            type: 'boolean',
            description: 'Absorb the fee into the displayed cost (optional)'
          },
          splitFee: {
            type: 'boolean',
            description: 'Absorb the payment fee, but show the eventbrite fee (optional)'
          },
          hideDescription: {
            type: 'boolean',
            description: 'Hide the ticket description on the event page (optional)'
          },
          minimumQuantity: {
            type: 'number',
            description: 'Minimum number per order (optional)'
          },
          maximumQuantity: {
            type: 'number',
            description: 'Maximum number per order (optional)'
          },
          autoHide: {
            type: 'boolean',
            description: 'Hide this ticket when it is not on sale (optional)'
          },
          hidden: {
            type: 'boolean',
            description: 'Hide this ticket (optional)'
          },
          hasPdfTicket: {
            type: 'boolean',
            description: 'Whether to include pdf ticket or not (optional)'
          },
          inventoryTierId: {
            type: 'string',
            description: 'Optional ID of Inventory Tier with which to associate the ticket class'
          }
        },
        required: ['eventId', 'name', 'quantityTotal']
      }
    };
  }

  async execute(args: CreateTicketClassArgs): Promise<TicketClassResult> {
    try {
      const ticketData: any = {
        name: args.name,
        quantity_total: args.quantityTotal,
        free: args.free !== undefined ? args.free : true
      };

      if (args.cost !== undefined && args.currency) {
        // API expects cost in format "USD,1000" not {currency: "USD", value: 1000}
        ticketData.cost = `${args.currency},${args.cost}`;
        ticketData.free = false;
      }

      if (args.description) {
        ticketData.description = args.description;
      }

      if (args.salesStart) {
        ticketData.sales_start = args.salesStart;
      }

      if (args.salesEnd) {
        ticketData.sales_end = args.salesEnd;
      }

      const ticketClass = await this.client.createTicketClass(args.eventId, ticketData);

      return {
        success: true,
        ticketClass
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
