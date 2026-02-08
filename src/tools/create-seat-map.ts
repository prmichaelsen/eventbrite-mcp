import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class CreateSeatMapTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'create_seat_map',
      description: `Create Seat Map for reserved seating event by copying existing.

ENDPOINT: POST /events/{event_id}/seatmaps/

Event must be new reserved seating. Once created, cannot create again.

ERRORS (403):
- NOT_AUTHORIZED: Unauthorized to view source or create on event

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          event_id: { type: 'string', description: 'Event ID (required)' },
          source_seatmap_id: { type: 'string', description: 'Source Seat Map ID to copy (required)' }
        },
        required: ['event_id', 'source_seatmap_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { event_id, source_seatmap_id } = args;
    logger.info('Creating seat map', { event_id, source_seatmap_id });
    try {
      const response = await this.client.post(`/events/${event_id}/seatmaps/`, { source_seatmap_id });
      logger.info('Seat map created successfully', { event_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to create seat map', { event_id, error: error.message });
      throw error;
    }
  }
}
