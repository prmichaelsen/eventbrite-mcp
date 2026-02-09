import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrganizationsByUserTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organizations_by_user',
      description: `List Organizations by User ID. Returns paginated response.

ENDPOINT: GET /users/{user_id}/organizations/

AUTHENTICATION: Requires Authorization Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          user_id: { type: 'string', description: 'User ID (required)' }
        },
        required: ['user_id']
      }
    };
  }

  async execute(args: { user_id: string }): Promise<any> {
    const { user_id } = args;
    logger.info('Listing organizations by user', { user_id });
    try {
      const response = await this.client.get(`/users/${user_id}/organizations/`);
      logger.info('Organizations by user retrieved', { user_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list organizations by user', { user_id, error: error.message });
      throw error;
    }
  }
}
