import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class GetMediaTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'get_media',
      description: `Retrieve Media by ID.

ENDPOINT: GET /media/{media_id}/

Media represents image for Event listing.

PARAMETERS:
- width (optional): Thumbnail width
- height (optional): Thumbnail height

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          media_id: { type: 'string', description: 'Media ID (required)' },
          width: { type: 'integer', description: 'Thumbnail width' },
          height: { type: 'integer', description: 'Thumbnail height' }
        },
        required: ['media_id']
      }
    };
  }

  async execute(args: any): Promise<any> {
    const { media_id, width, height } = args;
    logger.info('Retrieving media', { media_id });
    try {
      let endpoint = `/media/${media_id}/`;
      const params = new URLSearchParams();
      if (width) params.append('width', width.toString());
      if (height) params.append('height', height.toString());
      if (params.toString()) endpoint += `?${params.toString()}`;
      const response = await this.client.get(endpoint);
      logger.info('Media retrieved successfully', { media_id });
      return response;
    } catch (error: any) {
      logger.error('Failed to retrieve media', { media_id, error: error.message });
      throw error;
    }
  }
}
