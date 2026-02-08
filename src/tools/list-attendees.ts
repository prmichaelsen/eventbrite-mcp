import { EventbriteClient } from '../eventbrite/client.js';
import { ListAttendeesArgs, AttendeeListResult } from '../types/mcp.js';

export class ListAttendeesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_attendees',
      description: 'List attendees for a specific event',
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'The ID of the event'
          },
          status: {
            type: 'string',
            enum: ['attending', 'not_attending', 'unpaid'],
            description: 'Filter attendees by status'
          },
          pageSize: {
            type: 'number',
            description: 'Number of attendees to return per page (default: 50, max: 50)',
            minimum: 1,
            maximum: 50
          },
          continuation: {
            type: 'string',
            description: 'Continuation token for pagination'
          }
        },
        required: ['eventId']
      }
    };
  }

  async execute(args: ListAttendeesArgs): Promise<AttendeeListResult> {
    try {
      const response = await this.client.listAttendees(args.eventId, {
        status: args.status,
        pageSize: args.pageSize || 50,
        continuation: args.continuation
      });

      return {
        success: true,
        attendees: response.attendees || [],
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
