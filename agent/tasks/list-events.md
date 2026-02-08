# Tool: List Events

## Endpoint
`GET /v3/organizations/{id}/events/`

## Description
List events by organization ID. Returns a paginated response of events.

## Priority
**HIGH** - Essential for event discovery and management

## Status
🟡 In Progress (basic implementation exists)

## MCP Tool Name
`eventbrite_list_events`

## Parameters

### Required
- `organization_id` (string) - Organization ID to list events for

### Optional
- `status` (string) - Filter by event status
  - Values: `draft`, `live`, `started`, `ended`, `completed`, `canceled`, `all`
- `order_by` (string) - Sort order
  - Values: `start_asc`, `start_desc`, `created_asc`, `created_desc`
- `time_filter` (string) - Filter by time period
  - Values: `current_future`, `past`, `all`
- `page_size` (integer) - Number of results per page
- `continuation` (string) - Continuation token for pagination
- `expand` (string) - Comma-separated list of expansions
  - Available: `logo`, `venue`, `organizer`, `format`, `category`, `subcategory`, `ticket_availability`

## Response
Returns paginated response with:
- `pagination` object (object_count, page_count, has_more_items, continuation)
- `events` array of Event objects

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully lists events for organization
- [ ] Tool supports all filter parameters
- [ ] Tool supports pagination with continuation tokens
- [ ] Tool supports sorting options
- [ ] Tool supports expansions
- [ ] Tool handles empty result sets
- [ ] Tool handles large result sets efficiently

### Pagination
- [ ] Implements continuation token pagination
- [ ] Provides helper to fetch all pages
- [ ] Respects page_size parameter
- [ ] Handles pagination metadata correctly
- [ ] Detects end of results (has_more_items: false)

### Filtering
- [ ] Filters by status correctly
- [ ] Filters by time period correctly
- [ ] Combines multiple filters properly
- [ ] Handles invalid filter values

### Error Handling
- [ ] Returns clear error for invalid organization ID (404)
- [ ] Handles authentication errors (401, 403)
- [ ] Handles rate limiting (429)
- [ ] Handles invalid filter values
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
- [ ] Test sorting
- [ ] Test expansions
- [ ] Test error scenarios

## Implementation Notes

### Current Implementation
- Basic implementation exists in [`src/tools/list-events.ts`](../../src/tools/list-events.ts)
- Uses shared client from [`src/eventbrite/client.ts`](../../src/eventbrite/client.ts)

### Improvements Needed
1. Add support for all filter parameters
2. Add pagination helper
3. Add expansion support
4. Improve error messages
5. Add comprehensive parameter documentation
6. Add examples to tool description

### Alternative Endpoints
- `GET /v3/venues/{id}/events/` - List events by venue
- `GET /v3/series/{id}/events/` - List events by series
- `GET /v3/users/me/owned_events/` - List user's owned events

### Dependencies
- Requires valid OAuth token
- Organization must exist and be accessible

### Related Tools
- `eventbrite_get_event` - Get details for specific event
- `eventbrite_create_event` - Create new event
- `eventbrite_list_organizations` - Get organization IDs

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/list/list-events-by-organization

## Example Usage

### Basic List
```json
{
  "organization_id": "123456"
}
```

### With Filters
```json
{
  "organization_id": "123456",
  "status": "live",
  "time_filter": "current_future",
  "order_by": "start_asc"
}
```

### With Pagination
```json
{
  "organization_id": "123456",
  "page_size": 50,
  "continuation": "AEtFRyiWxkr0ZXyCJcnZ5U1..."
}
```

### With Expansions
```json
{
  "organization_id": "123456",
  "expand": "venue,organizer,ticket_availability"
}
```
