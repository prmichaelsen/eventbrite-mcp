import { EventbriteClient } from '../eventbrite/client.js';
import { GetEventArgs, EventResult } from '../types/mcp.js';

export class GetEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_event',
      description: 'Get detailed information about a specific event by ID',
      inputSchema: {
        type: 'object',
        properties: {
          eventId: {
            type: 'string',
            description: 'The ID of the event to retrieve'
          }
        },
        required: ['eventId']
      }
    };
  }

  async execute(args: GetEventArgs): Promise<EventResult> {
    try {
      const event = await this.client.getEvent(args.eventId);

      return {
        success: true,
        event
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
