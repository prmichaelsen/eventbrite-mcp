import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateEventScheduleTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_event_schedule',
      description: `Create an event schedule for series parent.

ENDPOINT: POST /events/{event_id}/schedules/

Adds occurrences to series parent according to pattern. Requires series parent event.

PARAMETERS:
- occurrence_duration: Duration in seconds
- recurrence_rule: iCalendar RFC format with DTSTART

ERRORS (400):
- MISSING, INVALID, DTSTART_MISSING, RECURRENCE_RULE_DATES_NOT_IN_UTC, DTSTART_OUTSIDE_PERMITTED_RANGE, LAST_OCCURRENCE_START_EXCEEDS_LIMIT, EXCEEDS_MAX_OCCURRENCES

ERRORS (403):
- NOT_AUTHORIZED

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Series parent Event ID (required)' },
          occurrence_duration: { type: 'integer', description: 'Duration in seconds (required)' },
          recurrence_rule: { type: 'string', description: 'iCalendar recurrence rule (required)' }
        },
        required: ['event_id', 'occurrence_duration', 'recurrence_rule']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, ...scheduleData } = args;
    logger.info('Creating event schedule', { event_id });
    try {
      const response = await this.client.post(`/events/${event_id}/schedules/`, { schedule: scheduleData });
      logger.info('Event schedule created successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create event schedule', { event_id, error: error.message });
      throw error;
    }
  }
}
