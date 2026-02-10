import { EventbriteClient } from '../eventbrite/client.js';

export class GetMediaUploadTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_media_upload',
      description: `Get Media Upload Information

**Endpoint:** GET /media/upload/

Returns information about a media upload, including upload status and processing state.

**Authentication:** Requires a valid Eventbrite API token with appropriate permissions.

**Use Cases:**
- Check upload status after initiating a media upload
- Verify media processing completion
- Get media ID for use in events or organizers
- Monitor upload progress

**Response Fields:**
- id: Media upload ID
- upload_token: Token for the upload
- status: Upload status (pending, processing, complete, failed)
- media_type: Type of media (image-event-logo, image-organizer-logo, etc)
- url: URL of the uploaded media (when complete)
- created: Upload creation timestamp

**Error Codes:**
- 400: Invalid upload token
- 401: Authentication required
- 404: Media upload not found`,
      inputSchema: {
        type: 'object' as const,
        properties: {
          upload_token: {
            type: 'string',
            description: 'The upload token returned from a previous upload initiation'
          }
        },
        required: ['upload_token']
      }
    };
  }

  async execute(args: { upload_token: string }): Promise<any> {
    try {
      const response = await this.client.get(`/media/upload/?upload_token=${args.upload_token}`);
      return { content: JSON.stringify(response, null, 2) };
    } catch (error) {
      return { content: `Error getting media upload: ${error}`, isError: true };
    }
  }
}
