# Eventbrite API - Complete Endpoint Reference

## Base URL
```
https://www.eventbriteapi.com/v3
```

## Endpoint Categories

### 1. Attendee
Manage event attendees and ticket holders.

**Endpoints:**
- `GET /attendees/{id}/` - Retrieve an Attendee
- `GET /events/{id}/attendees/` - List Attendees by Event
- `GET /organizations/{id}/attendees/` - List Attendees by Organization

### 2. Balance
Event-level balance information.

**Endpoints:**
- `GET /organizations/{organization_id}/events/{event_id}/balance/` - Remaining Balance

**Hosts:**
- test: `https://balance-api.jjzbds0g.ext.evbqa.com`
- dev: `https://balance-api.lxsadnd8.ext.evbdev.com`
- preprod: `https://balance-api.xypz0s6q.ext.evbstage.com`
- prod: `https://balance-api.fnii7z7a.ext.eventbrite.com`

### 3. Categories
Event categories and subcategories.

**Endpoints:**
- `GET /categories/{id}/` - Category by ID
- `GET /subcategories/{id}/` - Subcategory by ID
- `GET /categories/` - List of Categories
- `GET /subcategories/` - List of Subcategories

### 4. Discount
Discount codes and access codes.

**Endpoints:**
- `GET /discounts/{id}/` - Retrieve a Discount
- `POST /discounts/` - Create a Discount
- `POST /discounts/{id}/` - Update a Discount
- `GET /organizations/{id}/discounts/` - Search Discounts by Organization
- `DELETE /discounts/{id}/` - Delete a Discount

### 5. Display Settings
Event display configuration.

**Endpoints:**
- `GET /events/{id}/display_settings/` - Retrieve Display Settings
- `POST /events/{id}/display_settings/` - Update Display Settings

### 6. Event Capacity
Capacity tiers and holds.

**Endpoints:**
- `GET /events/{id}/capacity_tier/` - Retrieve a Capacity Tier
- `POST /events/{id}/capacity_tier/` - Update a Capacity Tier

### 7. Event Description
Event description management.

**Endpoints:**
- `GET /events/{id}/description/` - Retrieve Full HTML Description

### 8. Event Schedule
Recurring event schedules.

**Endpoints:**
- `POST /series/{id}/schedules/` - Create an event schedule

### 9. Event Search
Public event search (deprecated).

**Endpoints:**
- `GET /events/search/` - Search Events (deprecated)

### 10. Event Series
Repeating events.

**Endpoints:**
- `GET /series/{id}/` - Retrieve an Event Series

### 11. Event Teams
Team management for events.

**Endpoints:**
- `GET /events/{id}/teams/` - List by Event
- `GET /events/{event_id}/teams/{id}/` - Retrieve Team
- `GET /events/{event_id}/teams/{id}/attendees/` - List Attendees by Team
- `POST /events/{id}/teams/` - Create a Team
- `POST /events/{event_id}/teams/{id}/verify/` - Verify password for a team
- `GET /events/{id}/teams/search/` - Search teams by name

### 12. Event
Core event management.

**Endpoints:**
- `GET /events/{id}/` - Retrieve an Event
- `POST /events/` - Create an Event
- `POST /events/{id}/` - Update an Event
- `GET /venues/{id}/events/` - List Events by Venue
- `GET /organizations/{id}/events/` - List Events by Organization
- `GET /series/{id}/events/` - List Events by Series
- `POST /events/{id}/publish/` - Publish an Event
- `POST /events/{id}/unpublish/` - Unpublish an Event
- `POST /events/{id}/copy/` - Copy an Event
- `POST /events/{id}/cancel/` - Cancel an Event
- `DELETE /events/{id}/` - Delete an Event

### 13. Formats
Event format types.

**Endpoints:**
- `GET /formats/{id}/` - Retrieve a Format
- `GET /formats/` - List Formats

### 14. Inventory Tiers
Tiered inventory management.

**Endpoints:**
- `GET /events/{event_id}/inventory_tiers/{id}/` - Retrieve an Inventory Tier
- `POST /events/{id}/inventory_tiers/` - Create an Inventory Tier
- `POST /events/{id}/inventory_tiers/batch/` - Create Multiple Inventory Tiers
- `POST /events/{event_id}/inventory_tiers/{id}/` - Update an Inventory Tier
- `POST /events/{id}/inventory_tiers/batch/` - Update Multiple Inventory Tiers
- `GET /events/{id}/inventory_tiers/` - List Inventory Tiers by Event
- `DELETE /events/{event_id}/inventory_tiers/{id}/` - Delete an Inventory Tier

### 15. Media
Image and media uploads.

**Endpoints:**
- `GET /media/{id}/` - Retrieve Media
- `POST /media/upload/` - Upload a Media File
- `GET /media/upload/{id}/` - Retrieve a Media Upload

### 16. Online Event Page
Digital content pages (formerly Digital Links Page).

**Endpoints:**
- See Structured Content endpoints

### 17. Order
Order and purchase management.

**Endpoints:**
- `GET /orders/{id}/` - Retrieve Order by ID
- `GET /organizations/{id}/orders/` - List Orders by Organization ID
- `GET /events/{id}/orders/` - List Orders by Event ID
- `GET /users/{id}/orders/` - List Orders by User ID

### 18. Organizations Members
Organization membership.

**Endpoints:**
- `GET /organizations/{id}/members/` - List Members of an Organization

### 19. Organization Roles
Role-based permissions.

**Endpoints:**
- `GET /organizations/{id}/roles/` - List Roles by Organization

### 20. Organization
Organization management.

**Endpoints:**
- `GET /users/me/organizations/` - List your Organizations
- `GET /users/{id}/organizations/` - List Organizations by User

### 21. Pricing
Fee calculation and pricing.

**Endpoints:**
- `POST /pricing/items/` - Calculate Items
- `GET /pricing/` - List Pricing

### 22. Questions
Custom registration questions.

**Endpoints:**
- `GET /events/{id}/questions/` - List Default Questions by Event
- `GET /events/{event_id}/questions/{id}/` - Get Default Question by Id
- `POST /events/{id}/questions/` - Create a Default Question for an Event
- `POST /events/{event_id}/questions/{id}/` - Update Default Question by Id
- `DELETE /events/{event_id}/questions/{id}/` - Delete Default Question by Id
- `GET /events/{id}/custom_questions/` - List Custom Questions by Event
- `POST /events/{id}/custom_questions/` - Create a Custom question for an Event
- `GET /events/{event_id}/custom_questions/{id}/` - Get Custom Question by Id
- `DELETE /events/{event_id}/custom_questions/{id}/` - Delete a Custom Question for an Event

### 23. Reports
Sales and attendee reports.

**Endpoints:**
- `GET /reports/sales/` - Retrieve a Sales Report
- `GET /reports/attendees/` - Retrieve a Attendee Report

### 24. Seat Map
Reserved seating maps.

**Endpoints:**
- `GET /organizations/{id}/seat_maps/` - List Seat Maps by Organization
- `POST /events/{id}/seat_maps/` - Create Seat Map For Event

### 25. Structured Content
Rich content modules for event descriptions and online event pages.

**Endpoints:**
- `GET /events/{id}/structured_content/{purpose}/` - Retrieve Latest Published Version of Structured Content by Event Id
- `GET /events/{id}/structured_content/{purpose}/working/` - Retrieve Latest Working Version of Structured Content by Event Id
- `POST /events/{id}/structured_content/{purpose}/{version}/` - Set Structured Content by Event Id and Version

**Purposes:**
- `listing` - Event listing page description
- `online_event_page` - Online event page content

### 26. Texts Overrides
Custom text strings.

**Endpoints:**
- `GET /text_overrides/` - Retrieve Text Overrides
- `POST /text_overrides/` - Create Text Overrides

### 27. Ticket Buyer Settings
Buyer experience settings.

**Endpoints:**
- `GET /events/{id}/ticket_buyer_settings/` - Retrieve Ticket Buyer Settings by Event
- `POST /events/{id}/ticket_buyer_settings/` - Update Ticket Buyer Settings for an Event

### 28. Ticket Class
Ticket types and pricing.

**Endpoints:**
- `GET /ticket_classes/{id}/` - Retrieve a Ticket Class
- `POST /events/{id}/ticket_classes/` - Create a Ticket Class
- `POST /ticket_classes/{id}/` - Update a Ticket Class
- `GET /events/{id}/ticket_classes/` - List Ticket Classes by Event
- `GET /events/{id}/ticket_classes/available/` - List Ticket Classes Available For Sale by Event

### 29. Ticket Group
Ticket grouping.

**Endpoints:**
- `GET /ticket_groups/{id}/` - Retrieve a Ticket Group
- `POST /organizations/{id}/ticket_groups/` - Create a Ticket Group
- `POST /ticket_groups/{id}/` - Update a Ticket Group
- `POST /organizations/{organization_id}/events/{event_id}/ticket_classes/{ticket_class_id}/ticket_groups/` - Add a Ticket Class to Ticket Groups
- `GET /organizations/{id}/ticket_groups/` - List Ticket Groups by Organization
- `DELETE /ticket_groups/{id}/` - Delete a Ticket Group

### 30. User
User account management.

**Endpoints:**
- `GET /users/{id}/` - Retrieve Information about a User Account
- `GET /users/me/` - Retrieve Information About Your User Account

### 31. Venue
Event location management.

**Endpoints:**
- `GET /venues/{id}/` - Retrieve a Venue
- `POST /organizations/{id}/venues/` - Create a Venue
- `POST /venues/{id}/` - Update a Venue
- `GET /organizations/{id}/venues/` - List Venues by Organization

### 32. Webhooks
Event notifications.

**Endpoints:**
- `POST /organizations/{id}/webhooks/` - Create Webhooks by Organization ID
- `POST /webhooks/` - Create Webhooks (deprecated)
- `GET /organizations/{id}/webhooks/` - List Webhook by Organization ID
- `GET /webhooks/` - List of Webhooks (deprecated)
- `DELETE /webhooks/{id}/` - Delete Webhook by ID

## HTTP Methods

- **GET** - Retrieve resources
- **POST** - Create or update resources (Eventbrite uses POST instead of PUT)
- **DELETE** - Delete resources

## Common Query Parameters

### Pagination
- `page` - Page number (starts at 1)
- `continuation` - Continuation token for next page

### Expansions
- `expand` - Comma-separated list of related resources to include

### Filtering
- Various filters depending on endpoint (e.g., `status`, `time_filter`, `order_by`)

## Response Format

All responses are in JSON format and follow this general structure:

```json
{
  "pagination": {
    "object_count": 100,
    "page_number": 1,
    "page_size": 50,
    "page_count": 2,
    "has_more_items": true,
    "continuation": "token..."
  },
  "resource_name": [
    {
      "id": "123",
      "...": "..."
    }
  ]
}
```

## Notes

- All endpoints require authentication via OAuth token
- Rate limit: 2,000 requests per hour per token
- Timestamps are in ISO 8601 format
- Currency values are in minor units (cents)
- The API uses eventual consistency - changes may not be immediately visible
