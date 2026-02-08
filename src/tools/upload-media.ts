import { EventbriteClient } from '../eventbrite/client.js';
import { logger } from '../utils/logger.js';

export class UploadMediaTool {
  constructor(private client: EventbriteClient) {}

  getToolDefinition() {
    return {
      name: 'upload_media',
      description: `Upload a Media image file.

ENDPOINT: POST /media/upload/

ERRORS (400):
- BAD_FILE: File not valid
- BAD_FORMAT: File format not supported
- BAD_UPLOAD_TOKEN: Upload token invalid
- S3_ERROR: Error uploading to S3, try again

AUTHENTICATION:
Requires: Authorization: Bearer PERSONAL_OAUTH_TOKEN`,
      inputSchema: {
        type: 'object',
        properties: {
          upload_token: { type: 'string', description: 'Upload token' },
          file_name: { type: 'string', description: 'File name' },
          file_type: { type: 'string', description: 'File MIME type' }
        },
        required: []
      }
    };
  }

  async execute(args: any): Promise<any> {
    logger.info('Uploading media');
    try {
      const response = await this.client.post('/media/upload/', args);
      logger.info('Media uploaded successfully');
      return response;
    } catch (error: any) {
      logger.error('Failed to upload media', { error: error.message });
      throw error;
    }
  }
}
