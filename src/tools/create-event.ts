import { EventbriteClient } from '../eventbrite/client.js';
import { CreateEventArgs, EventResult } from '../types/mcp.js';

export class CreateEventTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_event',
      description: 'Create a new event on Eventbrite',
      inputSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the event'
          },
          description: {
            type: 'string',
            description: 'The description of the event (supports HTML)'
          },
          startTime: {
            type: 'string',
            description: 'Event start time in ISO 8601 format (e.g., 2024-12-31T20:00:00)'
          },
          endTime: {
            type: 'string',
            description: 'Event end time in ISO 8601 format (e.g., 2024-12-31T23:00:00)'
          },
          timezone: {
            type: 'string',
            description: 'Timezone for the event (e.g., America/New_York)'
          },
          currency: {
            type: 'string',
            description: 'Currency code (e.g., USD, EUR, GBP)'
          },
          online: {
            type: 'boolean',
            description: 'Whether this is an online event'
          },
          listed: {
            type: 'boolean',
            description: 'Whether the event should be publicly listed'
          },
          capacity: {
            type: 'number',
            description: 'Maximum capacity for the event'
          },
          organizationId: {
            type: 'string',
            description: 'Organization ID to create the event under'
          }
        },
        required: ['name', 'startTime', 'endTime', 'timezone', 'currency']
      }
    };
  }

  async execute(args: CreateEventArgs): Promise<EventResult> {
    try {
      const eventData: any = {
        name: {
          html: args.name
        },
        start: {
          timezone: args.timezone,
          utc: new Date(args.startTime).toISOString()
        },
        end: {
          timezone: args.timezone,
          utc: new Date(args.endTime).toISOString()
        },
        currency: args.currency
      };

      if (args.description) {
        eventData.description = {
          html: args.description
        };
      }

      if (args.online !== undefined) {
        eventData.online_event = args.online;
      }

      if (args.listed !== undefined) {
        eventData.listed = args.listed;
      }

      if (args.capacity !== undefined) {
        eventData.capacity = args.capacity;
      }

      const event = await this.client.createEvent(eventData);

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
