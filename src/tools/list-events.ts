import { EventbriteClient } from '../eventbrite/client.js';
import { ListEventsArgs, EventListResult } from '../types/mcp.js';

export class ListEventsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_events',
      description: 'List events from Eventbrite. Can filter by organization, status, and ordering.',
      inputSchema: {
        type: 'object',
        properties: {
          organizationId: {
            type: 'string',
            description: 'Filter events by organization ID'
          },
          status: {
            type: 'string',
            enum: ['draft', 'live', 'started', 'ended', 'completed', 'canceled', 'all'],
            description: 'Filter events by status'
          },
          orderBy: {
            type: 'string',
            enum: ['start_asc', 'start_desc', 'created_asc', 'created_desc'],
            description: 'Order events by field'
          },
          pageSize: {
            type: 'number',
            description: 'Number of events to return per page (default: 50, max: 50)',
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
