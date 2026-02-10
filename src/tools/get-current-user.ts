import { EventbriteClient } from '../eventbrite/client.js';

export class GetCurrentUserTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_current_user',
      description: `Get Current User

**Endpoint:** GET /users/me/

Returns information about the currently authenticated user (the user whose API token is being used).

**Authentication:** Requires a valid Eventbrite API token.

**Use Cases:**
- Verify authentication and token validity
- Get current user's ID for other API calls
- Display user information in applications
- Check user's name and email
- Verify user permissions and access

**Response Fields:**
- id: User ID
- name: User's full name
- first_name: User's first name
- last_name: User's last name
- email: User's email address
- emails: Array of email objects with verification status
- image_id: User's profile image ID

**Error Codes:**
- 401: Authentication required or invalid token
- 403: Token lacks required permissions`,
      inputSchema: {
        type: 'object' as const,
        properties: {},
        required: []
      }
    };
  }

  async execute(): Promise<any> {
    try {
      const response = await this.client.get('/users/me/');
      return { content: JSON.stringify(response, null, 2) };
    } catch (error) {
      return { content: `Error getting current user: ${error}`, isError: true };
    }
  }
}
