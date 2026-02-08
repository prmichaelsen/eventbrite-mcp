import { EventbriteClient } from '../eventbrite/client.js';
import { ListEventsArgs, EventListResult } from '../types/mcp.js';

export class ListEventsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_events',
      description: `List Events by Organization ID. Returns a paginated response.

ENDPOINT: GET /organizations/{organization_id}/events/

PARAMETERS:
- organization_id (string, required): Organization ID
- name_filter (string, optional): Filter Organization's Events by specified name
- currency_filter (string, optional): Filter Organization's Events by specified currency (e.g., USD)
- order_by (enum, optional): Sort order for the list of Events
  • start_asc, start_desc, created_asc, created_desc, name_asc, name_desc
- series_filter (array[enum], optional): Filter based on whether an event is not a series, a series, child series or parent series. This filter has higher precedence than show_series_parent filter. Default will use show_series_parent filter behavior.
  • allevents: non-series & child series & parent series. Equivalent to [children,parents,nonseries] or [allevents,nonseries]
  • children: only child series
  • parents: only parent series
  • nonseries: non-series events
  • allseries: only series events. Equivalent to [children,parents]
- show_series_parent (boolean, optional): false (Default) = In the list, show the series children and not series parent. true = In the list, show the series parent instead of series children.
- status (enum, optional): Filter Organization's Events by status. Specify multiple status values as a comma delimited string.
  • draft: A preliminary form of a possible future Event
  • live: The Event can accept registrations or purchases if ticket classes are available
  • started: The Event start date has passed
  • ended: The Event end date has passed
  • completed: The funds for your Event have been paid out
  • canceled: The Event has been canceled
  • all: List Events with any status
- event_group_id (string, optional): Filter Organization's Events by event_group_id
- collection_id (string, optional): Filter Organization's Events by collection_id
- page_size (number, optional): Number of records to display on each page of the list (default: 50)
- time_filter (string, optional): Limits the list results to either past or current and future Events
  • all, past, current_future
- venue_filter (array, optional): Filter Organization's Events by Venue ID
- organizer_filter (array, optional): Filter Organization's Events by Organizer ID
- inventory_type_filter (array[enum], optional): Filter Organization's Events by Inventory Type
  • limited: limited quantity inventory/GA
  • reserved: Reserved inventory
  • externally_ticketed: Externally ticketed event (no inventory)
- event_ids_to_exclude (array[string], optional): IDs of events to exclude from the Organization's Events list
- event_ids (array[string], optional): IDs of events to include from the Organization's Events list
- collection_ids_to_exclude (array[string], optional): IDs of collections to exclude from the Organization's Events list. This will have precedence over event_group_id filter and collection_id filter.

ERROR RESPONSES:
- 400 ARGUMENTS_ERROR: There are errors with your arguments
- 404 NOT_FOUND: The organization_id you requested does not exist`,
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'Organization ID (required)'
          },
          status: {
            type: 'string',
            enum: ['draft', 'live', 'started', 'ended', 'completed', 'canceled', 'all'],
            description: 'Filter events by status'
          },
          orderBy: {
            type: 'string',
            enum: ['start_asc', 'start_desc', 'created_asc', 'created_desc', 'name_asc', 'name_desc'],
            description: 'Sort order for the list of Events'
          },
          pageSize: {
            type: 'number',
            description: 'Number of records to display on each page (default: 50)',
            minimum: 1,
            maximum: 50
          },
          continuation: {
            type: 'string',
            description: 'Continuation token for pagination'
          }
        }
      }
    };
  }

  async execute(args: ListEventsArgs): Promise<EventListResult> {
    try {
      const response = await this.client.listEvents({
        organizationId: args.organizationId,
        status: args.status,
        orderBy: args.orderBy,
        pageSize: args.pageSize || 50,
        continuation: args.continuation
      });

      return {
        success: true,
        events: response.events || [],
        pagination: response.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
