import { EventbriteClient } from '../eventbrite/client.js';

export class ListOrganizationsTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'list_organizations',
      description: 'List organizations for the authenticated user. Returns organization IDs needed for other operations like listing events.',
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
