import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class ListOrganizationsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organizations',
      description: `List organizations that the authenticated user is a member of.

ENDPOINT: GET /users/me/organizations/

An Organization represents a business structure (like a Marketing department) where Events are created and managed. Organizations are owned by one User and can have multiple Members.

Organizations group Members, Roles, Venues, and Assortments.

IMPORTANT: The organization_id returned by this endpoint must be obtained via API request. It is NOT the same as the organizer_id found in an Organizer Profile URL.

ORGANIZATION OBJECT FIELDS:
- id (string): Organization ID (required for API calls like creating events, listing organization events)
- name (string): Organization name
- image_id (string, optional): ID of organization image
- vertical (string): Business vertical type
  * default: Default business type
  * music: Music business type

USE CASES:
- Get organization IDs needed for other API operations
- Create events under an organization (requires organization_id)
- List events for an organization
- Manage organization members and roles

RESPONSE:
- organizations (array): List of Organization objects
- pagination: Pagination information

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
