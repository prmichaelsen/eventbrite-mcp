import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetOrganizationTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_organization',
      description: `Get an Organization by ID.

ENDPOINT: GET /organizations/{organization_id}/

Organization represents business structure where Events are created/managed.

ORGANIZATION FIELDS:
- id (string): Organization ID
- name (string): Organization name
- image_id (string, optional): Image ID
- vertical (string): Business type (default or music)

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          organization_id: { type: 'string', description: 'Organization ID (required)' }
        },
        required: ['organization_id']
      }
    };
  }

  async execute(args: { organization_id: string }): Promise<any> {
    const { organization_id } = args;
    logger.info('Getting organization', { organization_id });
    try {
      const response = await this.client.get(`/organizations/${organization_id}/`);
      logger.info('Organization retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to get organization', { organization_id, error: error.message });
      throw error;
    }
  }
}
