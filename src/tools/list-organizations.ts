import { EventbriteClient } from '../eventbrite/client.js';

export class ListOrganizationsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organizations',
      description: `List the Organizations to which you are a Member. Returns a paginated response.

ENDPOINT: GET /users/me/organizations/

ORGANIZATION OBJECT:
An object representing a business structure (like a Marketing department) in which Events are created and managed. Organizations are owned by one User and can have multiple Members. The Organization object is used to group Members, Roles, Venues and Assortments.

FIELDS RETURNED:
- id (string): Organization ID. Must be obtained via an API request. The organization_id is NOT equal to an organizer_id (the string in an Organizer Profile URL).
- name (string): Organization Name.
- image_id (string, optional): ID of the image for an Organization.
- vertical (string): Type of business vertical within which this Organization operates. Currently, the only values are 'default' and 'music'. If not specified, the value is 'default'.

PAGINATION:
Returns paginated response with:
- pagination.object_count: Total number of organizations across all pages
- pagination.page_number: Current page number (starts at 1)
- pagination.page_size: Number of objects per page
- pagination.page_count: Total number of pages
- pagination.continuation: Token to get next page of results
- pagination.has_more_items: Boolean indicating if more items exist

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {}
      }
    };
  }

  async execute(): Promise<any> {
    try {
      const response = await this.client.get<any>('/users/me/organizations/');

      return {
        success: true,
        organizations: response.organizations || [],
        pagination: response.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
