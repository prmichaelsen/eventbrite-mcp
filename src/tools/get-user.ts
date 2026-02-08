import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetUserTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_user',
      description: `Get authenticated user information.

ENDPOINT: GET /users/me/

Returns current user details.

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {},
        required: []
      }
    };
  }

  async execute(): Promise<any> {
    logger.info('Getting user info');
    try {
      const response = await this.client.get('/users/me/');
      logger.info('User info retrieved successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to get user info', { error: error.message });
      throw error;
    }
  }
}
