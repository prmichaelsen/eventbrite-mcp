import { EventbriteConfig } from '../types/eventbrite.js';
import { logger } from '../utils/logger.js';

export class EventbriteClient {
  private config: EventbriteConfig;
  private baseUrl: string;

  constructor(config: EventbriteConfig) {
    this.config = {
      apiUrl: 'https://www.eventbriteapi.com/v3',
      timeout: 30000,
      retries: 3,
      ...config
    };
    this.baseUrl = this.config.apiUrl!;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    let lastError: Error | null = null;
    const retries = this.config.retries || 3;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `Eventbrite API error: ${response.status} ${response.statusText} - ${errorBody}`
          );
        }

        return await response.json() as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Event operations
  async listEvents(params: {
    organizationId?: string;
    status?: string;
    orderBy?: string;
    pageSize?: number;
    continuation?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.orderBy) queryParams.append('order_by', params.orderBy);
    if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
    if (params.continuation) queryParams.append('continuation', params.continuation);

    const endpoint = params.organizationId
      ? `/organizations/${params.organizationId}/events/?${queryParams}`
      : `/users/me/events/?${queryParams}`;

    return this.get<any>(endpoint);
  }

  async getEvent(eventId: string) {
    return this.get<any>(`/events/${eventId}/`);
  }

  async createEvent(data: any) {
    return this.post<any>('/events/', {
      event: data
    });
  }

  async updateEvent(eventId: string, data: any) {
    return this.post<any>(`/events/${eventId}/`, {
      event: data
    });
  }

  async publishEvent(eventId: string) {
    return this.post<any>(`/events/${eventId}/publish/`, {});
  }

  async cancelEvent(eventId: string) {
    return this.post<any>(`/events/${eventId}/cancel/`, {});
  }

  // Ticket class operations
  async listTicketClasses(eventId: string) {
    return this.get<any>(`/events/${eventId}/ticket_classes/`);
  }

  async createTicketClass(eventId: string, data: any) {
    return this.post<any>(`/events/${eventId}/ticket_classes/`, {
      ticket_class: data
    });
  }

  // Attendee operations
  async listAttendees(eventId: string, params: {
    status?: string;
    pageSize?: number;
    continuation?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
    if (params.continuation) queryParams.append('continuation', params.continuation);

    return this.get<any>(`/events/${eventId}/attendees/?${queryParams}`);
  }

  async getAttendee(eventId: string, attendeeId: string) {
    return this.get<any>(`/events/${eventId}/attendees/${attendeeId}/`);
  }

  // Order operations
  async listOrders(eventId: string, params: {
    status?: string;
    pageSize?: number;
    continuation?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
    if (params.continuation) queryParams.append('continuation', params.continuation);

    return this.get<any>(`/events/${eventId}/orders/?${queryParams}`);
  }

  // Venue operations
  async getVenue(venueId: string) {
    return this.get<any>(`/venues/${venueId}/`);
  }

  async createVenue(organizationId: string, data: any) {
    return this.post<any>(`/organizations/${organizationId}/venues/`, {
      venue: data
    });
  }

  // Organization operations
  async getOrganization(organizationId: string) {
    return this.get<any>(`/organizations/${organizationId}/`);
  }

  async getCurrentUser() {
    return this.get<any>('/users/me/');
  }
}
