# Tool: Get Event

## Endpoint
`GET /v3/events/{id}/`

## Description
Retrieve an event by Event ID. Returns complete event details including all public and private fields (if authorized).

## Priority
**HIGH** - Essential for retrieving event information

## Status
🟡 In Progress (basic implementation exists)

## MCP Tool Name
`eventbrite_get_event`

## Parameters

### Required
- `event_id` (string) - Event ID to retrieve

### Optional
- `expand` (string) - Comma-separated list of expansions
  - Available expansions:
    - `logo` - Event logo image
    - `venue` - Event venue details
    - `organizer` - Event organizer details
    - `format` - Event format
    - `category` - Event category
    - `subcategory` - Event subcategory
    - `bookmark_info` - Bookmark information
    - `refund_policy` - Refund policy
    - `ticket_availability` - Ticket availability overview
    - `external_ticketing` - External ticketing data
    - `music_properties` - Music event properties
    - `publish_settings` - Publish settings
    - `basic_inventory_info` - Inventory information
    - `event_sales_status` - Sales status details
    - `checkout_settings` - Checkout settings
    - `listing_properties` - Listing properties
    - `has_digital_content` - Digital content indicator

## Response
Returns Event object with:
- `id` - Event ID
- `resource_uri` - Full API URL
- `name` - Event name (multipart text)
- `summary` - Event summary
- `description` - Event description (DEPRECATED)
- `url` - Public event URL
- `start` - Start datetime with timezone
- `end` - End datetime with timezone
- `created` - Creation timestamp
- `changed` - Last modified timestamp
- `published` - Publication timestamp
- `status` - Event status (draft, live, started, ended, completed, canceled)
- `currency` - Currency code
- `online_event` - Boolean for online-only events
- `hide_start_date` - Boolean
- `hide_end_date` - Boolean
- `listed` - Public searchability
- `shareable` - Social sharing enabled
- `invite_only` - Invitation-only access
- `show_remaining` - Show remaining tickets
- `capacity` - Maximum capacity
- `capacity_is_custom` - Custom capacity flag
- Plus expanded fields if requested

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully retrieves event by ID
- [ ] Tool supports expansion parameters
- [ ] Tool handles nested expansions (e.g., `event.venue`)
- [ ] Tool returns complete event object
- [ ] Tool handles both public and private events (with proper auth)
- [ ] Tool properly deserializes all field types

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Handles authentication errors (401, 403)
- [ ] Handles deleted events appropriately
- [ ] Handles rate limiting (429)
- [ ] Provides meaningful error messages

### Data Handling
- [ ] Properly parses datetime with timezone objects
- [ ] Properly parses currency objects
- [ ] Properly parses multipart text objects
- [ ] Handles null/optional fields gracefully
- [ ] Handles expanded nested objects

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with Eventbrite API
- [ ] Test with minimal expansions
- [ ] Test with multiple expansions
- [ ] Test with nested expansions
- [ ] Test error scenarios (404, 401, 403)

## Implementation Notes

### Current Implementation
- Basic implementation exists in [`src/tools/get-event.ts`](../../src/tools/get-event.ts)
- Uses shared client from [`src/eventbrite/client.ts`](../../src/eventbrite/client.ts)

### Improvements Needed
1. Add support for expansion parameters
2. Add support for nested expansions
3. Improve type definitions for expanded fields
4. Add examples to tool description
5. Add validation for expansion names
6. Improve error messages

### Dependencies
- Requires valid OAuth token
- Event must exist and be accessible to the authenticated user

### Related Tools
- `eventbrite_create_event` - Create new event
- `eventbrite_update_event` - Update event details
- `eventbrite_list_events` - List multiple events
- `eventbrite_delete_event` - Delete event

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/retrieve/retrieve-an-event

## Example Usage

### Basic Retrieval
```json
{
  "event_id": "123456789"
}
```

### With Expansions
```json
{
  "event_id": "123456789",
  "expand": "venue,organizer,ticket_availability"
}
```

### With Nested Expansions
```json
{
  "event_id": "123456789",
  "expand": "venue,organizer.logo"
}
```

## Notes
- If event was created with new Create flow, the `description` field may contain the summary instead
- To get full HTML description, use the Event Description endpoint
- Expansions slow down requests - use sparingly
