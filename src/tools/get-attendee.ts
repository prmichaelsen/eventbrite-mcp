import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetAttendeeTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_attendee',
      description: 'Retrieve a specific attendee by event ID and attendee ID. Returns detailed attendee information including created/changed timestamps, ticket_class_id, ticket_class_name, quantity (always 1), costs breakdown (base_price, eventbrite_fee, tax, payment_fee, gross), profile (name, email, first_name, last_name, prefix, suffix, age, job_title, company, website, blog, gender, birth_date, cell_phone), addresses (home, ship, work), barcodes with status, checked_in status, cancelled status, refunded status, event_id, order_id, guestlist_id, invited_by, delivery_method. Attendees represent ticket holders and are private to the user and order owner.',
      inputSchema: {
        type: 'object',
        properties: {
          event_id: {
            type: 'string',
            description: 'The ID of the event'
          },
          attendee_id: {
            type: 'string',
            description: 'The ID of the attendee to retrieve'
          }
        },
        required: ['event_id', 'attendee_id']
      }
    };
  }

  async execute(args: { event_id: string; attendee_id: string }): Promise<any> {
    const { event_id, attendee_id } = args;

    logger.info('Retrieving attendee', { event_id, attendee_id });

    try {
      const response = await this.client.get(`/events/${event_id}/attendees/${attendee_id}/`);

      logger.info('Attendee retrieved successfully', { event_id, attendee_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve attendee', { event_id, attendee_id, error: error.message });
      throw error;
    }
  }
}
