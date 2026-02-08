// Eventbrite API configuration
export interface EventbriteConfig {
  apiToken: string;
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

// Eventbrite Event types
export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description: {
    text: string;
    html: string;
  };
  url: string;
  start: {
    timezone: string;
    local: string;
    utc: string;
  };
  end: {
    timezone: string;
    local: string;
    utc: string;
  };
  organization_id: string;
  created: string;
  changed: string;
  published: string;
  capacity: number;
  capacity_is_custom: boolean;
  status: string;
  currency: string;
  listed: boolean;
  shareable: boolean;
  online_event: boolean;
  tx_time_limit: number;
  hide_start_date: boolean;
  hide_end_date: boolean;
  locale: string;
  is_locked: boolean;
  privacy_setting: string;
  is_series: boolean;
  is_series_parent: boolean;
  inventory_type: string;
  is_reserved_seating: boolean;
  show_pick_a_seat: boolean;
  show_seatmap_thumbnail: boolean;
  show_colors_in_seatmap_thumbnail: boolean;
  source: string;
  is_free: boolean;
  version: string;
  summary: string;
  logo_id?: string;
  organizer_id?: string;
  venue_id?: string;
  category_id?: string;
  subcategory_id?: string;
  format_id?: string;
  resource_uri: string;
  is_externally_ticketed: boolean;
}

// Eventbrite Organization types
export interface EventbriteOrganization {
  id: string;
  name: string;
  vertical: string;
  parent_id?: string;
  locale: string;
  image_id?: string;
}

// Eventbrite Venue types
export interface EventbriteVenue {
  id: string;
  name: string;
  address: {
    address_1?: string;
    address_2?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    localized_address_display?: string;
    localized_area_display?: string;
    localized_multi_line_address_display?: string[];
  };
  resource_uri: string;
  age_restriction?: string;
  capacity?: number;
}

// Eventbrite Ticket Class types
export interface EventbriteTicketClass {
  id: string;
  name: string;
  description?: string;
  cost?: {
    currency: string;
    display: string;
    value: number;
    major_value: string;
  };
  free: boolean;
  quantity_total: number;
  quantity_sold: number;
  sales_start?: string;
  sales_end?: string;
  hidden: boolean;
  include_fee: boolean;
  split_fee: boolean;
  hide_description: boolean;
  auto_hide: boolean;
  auto_hide_before?: string;
  auto_hide_after?: string;
  sales_channels: string[];
  resource_uri: string;
}

// Eventbrite Order types
export interface EventbriteOrder {
  id: string;
  created: string;
  changed: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  costs: {
    base_price: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    eventbrite_fee: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    gross: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    payment_fee: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    tax: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
  };
  resource_uri: string;
  event_id: string;
  status: string;
  time_remaining?: number;
}

// Eventbrite Attendee types
export interface EventbriteAttendee {
  id: string;
  created: string;
  changed: string;
  ticket_class_id: string;
  ticket_class_name: string;
  costs: {
    base_price: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    eventbrite_fee: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    gross: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    payment_fee: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
    tax: {
      currency: string;
      display: string;
      value: number;
      major_value: string;
    };
  };
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    name: string;
    addresses?: {
      home?: any;
      ship?: any;
      work?: any;
      bill?: any;
    };
  };
  barcodes: Array<{
    barcode: string;
    status: string;
    created: string;
    changed: string;
  }>;
  team?: string;
  affiliate?: string;
  checked_in: boolean;
  cancelled: boolean;
  refunded: boolean;
  status: string;
  event_id: string;
  order_id: string;
  guestlist_id?: string;
  invited_by?: string;
  resource_uri: string;
}
