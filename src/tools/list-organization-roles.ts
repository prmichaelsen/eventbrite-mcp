import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrganizationRolesTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organization_roles',
      description: `List Roles by Organization.

ENDPOINT: GET /organizations/{organization_id}/roles/

Organization Role represents set of permissions owned by Organization.

Returns paginated response.

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
    logger.info('Listing organization roles', { organization_id });
    try {
      const response = await this.client.get(`/organizations/${organization_id}/roles/`);
      logger.info('Organization roles retrieved successfully', { organization_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to list organization roles', { organization_id, error: error.message });
      throw error;
    }
  }
}
