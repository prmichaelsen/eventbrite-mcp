# Tool: List Attendees

## Endpoint
`GET /v3/events/{id}/attendees/`

## Description
List attendees for an event by Event ID. Returns a paginated response of attendee information.

## Priority
**HIGH** - Essential for attendee management

## Status
🟡 In Progress (basic implementation exists)

## MCP Tool Name
`eventbrite_list_attendees`

## Parameters

### Required
- `event_id` (string) - Event ID to list attendees for

### Optional
- `status` (string) - Filter by attendee status
  - Values: `attending`, `not_attending`, `unpaid`, `all`
- `changed_since` (datetime) - Only return attendees changed since this date
- `last_item_seen` (string) - Attendee ID for pagination
- `page_size` (integer) - Number of results per page (max 50)
- `continuation` (string) - Continuation token for pagination
- `expand` (string) - Comma-separated list of expansions
  - Available: `event`, `order`, `promotional_code`, `assigned_number`, `answers`, `survey`, `survey_responses`, `assigned_unit`, `contact_list_preferences`

## Response
Returns paginated response with:
- `pagination` object
- `attendees` array of Attendee objects

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully lists attendees for event
- [ ] Tool supports all filter parameters
- [ ] Tool supports pagination
- [ ] Tool supports expansions
- [ ] Tool handles empty attendee lists
- [ ] Tool handles large attendee lists efficiently
- [ ] Tool respects privacy (only returns data user is authorized to see)

### Pagination
- [ ] Implements continuation token pagination
- [ ] Provides helper to fetch all pages
- [ ] Respects page_size parameter (max 50)
- [ ] Handles pagination metadata correctly

### Filtering
- [ ] Filters by status correctly
- [ ] Filters by changed_since correctly
- [ ] Combines filters properly
- [ ] Handles invalid filter values

### Data Privacy
- [ ] Only returns attendee data if user is authorized
- [ ] Respects event privacy settings
- [ ] Handles private vs public event data appropriately

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Handles authentication errors (401, 403)
- [ ] Handles unauthorized access to private data
- [ ] Handles rate limiting (429)
- [ ] Provides meaningful error messages

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with Eventbrite API
- [ ] Test pagination
- [ ] Test filtering
- [ ] Test expansions
- [ ] Test error scenarios
- [ ] Test privacy restrictions

## Implementation Notes

### Current Implementation
- Basic implementation exists in [`src/tools/list-attendees.ts`](../../src/tools/list-attendees.ts)
- Uses shared client from [`src/eventbrite/client.ts`](../../src/eventbrite/client.ts)

### Improvements Needed
1. Add support for all filter parameters
2. Add pagination helper
3. Add expansion support
4. Improve error messages
5. Add privacy checks
6. Add examples to tool description

### Privacy Considerations
- Attendee objects are private
- Only available to event owner and order owner
- Requires appropriate permissions

### Dependencies
- Requires valid OAuth token
- Event must exist
- User must have attendee read permissions

### Related Tools
- `eventbrite_get_attendee` - Get specific attendee details
- `eventbrite_list_events` - List events to get event IDs
- `eventbrite_list_orders` - List orders for event

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#1-attendee)
- Official docs: https://www.eventbrite.com/platform/api#/reference/attendee/list/list-attendees-by-event

## Example Usage

### Basic List
```json
{
  "event_id": "123456789"
}
```

### With Filters
```json
{
  "event_id": "123456789",
  "status": "attending",
  "page_size": 50
}
```

### With Expansions
```json
{
  "event_id": "123456789",
  "expand": "order,answers"
}
```

### With Changed Since Filter
```json
{
  "event_id": "123456789",
  "changed_since": "2026-02-01T00:00:00Z"
}
```
