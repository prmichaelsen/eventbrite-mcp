import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrganizationsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organizations',
      description: 'List organizations that the authenticated user is a member of. Returns paginated list of organizations with details including id (organization ID, must be obtained via API - NOT the same as organizer_id from organizer profile URL), name, image_id, and vertical (business type: default or music). Organizations represent business structures where events are created and managed. Organizations are owned by one user and can have multiple members. Use this to get organization IDs needed for other API calls like creating events or listing organization events.',
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }

  async execute(): Promise<any> {
    logger.info('Listing organizations for authenticated user');

    try {
      const response = await this.client.get('/users/me/organizations/');

      logger.info('Organizations retrieved successfully', { 
        count: (response as any).organizations?.length 
      });
      return response;
    } catch (error: any) {
      logger.error('Failed to list organizations', { error: error.message });
      throw error;
    }
  }
}
