// MCP tool argument interfaces for Eventbrite operations

export interface ListEventsArgs {
  organizationId?: string;
  status?: 'draft' | 'live' | 'started' | 'ended' | 'completed' | 'canceled' | 'all';
  orderBy?: 'start_asc' | 'start_desc' | 'created_asc' | 'created_desc';
  pageSize?: number;
  continuation?: string;
}

export interface GetEventArgs {
  eventId: string;
}

export interface CreateEventArgs {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  timezone: string;
  currency: string;
  online?: boolean;
  listed?: boolean;
  capacity?: number;
  organizationId?: string;
}

export interface UpdateEventArgs {
  eventId: string;
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  listed?: boolean;
  capacity?: number;
}

export interface PublishEventArgs {
  eventId: string;
}

export interface CancelEventArgs {
  eventId: string;
}

export interface ListTicketClassesArgs {
  eventId: string;
}

export interface CreateTicketClassArgs {
  eventId: string;
  name: string;
  quantityTotal: number;
  free?: boolean;
  cost?: number;
  currency?: string;
  description?: string;
  salesStart?: string;
  salesEnd?: string;
}

export interface ListAttendeesArgs {
  eventId: string;
  status?: 'attending' | 'not_attending' | 'unpaid';
  pageSize?: number;
  continuation?: string;
}

export interface GetAttendeeArgs {
  eventId: string;
  attendeeId: string;
}

export interface ListOrdersArgs {
  eventId: string;
  status?: 'active' | 'inactive' | 'all';
  pageSize?: number;
  continuation?: string;
}

export interface GetVenueArgs {
  venueId: string;
}

export interface CreateVenueArgs {
  organizationId: string;
  name: string;
  address?: {
    address1?: string;
    address2?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface GetOrganizationArgs {
  organizationId: string;
}

// MCP tool result interfaces

export interface EventResult {
  success: boolean;
  event?: any;
  error?: string;
}

export interface EventListResult {
  success: boolean;
  events?: any[];
  pagination?: {
    objectCount: number;
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    continuation?: string;
    hasMoreItems: boolean;
  };
  error?: string;
}

export interface TicketClassResult {
  success: boolean;
  ticketClass?: any;
  error?: string;
}

export interface TicketClassListResult {
  success: boolean;
  ticketClasses?: any[];
  error?: string;
}

export interface AttendeeResult {
  success: boolean;
  attendee?: any;
  error?: string;
}

export interface AttendeeListResult {
  success: boolean;
  attendees?: any[];
  pagination?: {
    objectCount: number;
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    continuation?: string;
    hasMoreItems: boolean;
  };
  error?: string;
}

export interface OrderListResult {
  success: boolean;
  orders?: any[];
  pagination?: {
    objectCount: number;
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    continuation?: string;
    hasMoreItems: boolean;
  };
  error?: string;
}

export interface VenueResult {
  success: boolean;
  venue?: any;
  error?: string;
}

export interface OrganizationResult {
  success: boolean;
  organization?: any;
  error?: string;
}
