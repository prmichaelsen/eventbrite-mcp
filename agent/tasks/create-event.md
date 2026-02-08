# Tool: Create Event

## Endpoint
`POST /v3/events/`

## Description
Create a new Eventbrite event. This is the foundational operation for event management.

## Priority
**HIGH** - Core functionality for event creation

## Status
🟡 In Progress (basic implementation exists)

## MCP Tool Name
`eventbrite_create_event`

## Parameters

### Required
- `name` (object) - Event name
  - `html` (string) - HTML version of name
- `start` (object) - Event start date/time
  - `timezone` (string) - Olson timezone (e.g., "America/Los_Angeles")
  - `utc` (string) - UTC datetime (ISO 8601)
- `end` (object) - Event end date/time
  - `timezone` (string) - Olson timezone
  - `utc` (string) - UTC datetime (ISO 8601)
- `currency` (string) - ISO 4217 currency code (e.g., "USD")

### Optional
- `summary` (string) - Short event summary
- `description` (object) - Event description (DEPRECATED - use Structured Content instead)
  - `html` (string) - HTML version
- `organizer_id` (string) - Organizer ID
- `venue_id` (string) - Venue ID (mutually exclusive with `online_event`)
- `online_event` (boolean) - Set to true for online-only events
- `listed` (boolean) - Allow public searchability (default: false)
- `shareable` (boolean) - Enable social sharing (default: true)
- `invite_only` (boolean) - Restrict to invited users only (default: false)
- `show_remaining` (boolean) - Display remaining ticket count (default: false)
- `password` (string) - Event password for access control
- `capacity` (integer) - Maximum attendee capacity
- `capacity_is_custom` (boolean) - Use custom capacity vs. sum of ticket classes
- `category_id` (string) - Event category ID
- `subcategory_id` (string) - Event subcategory ID
- `format_id` (string) - Event format ID
- `hide_start_date` (boolean) - Hide start date from attendees
- `hide_end_date` (boolean) - Hide end date from attendees
- `logo_id` (string) - Event logo image ID
- `is_series` (boolean) - Create as series parent for recurring events
- `source` (string) - Source identifier

## Response
Returns the created Event object with:
- `id` - Event ID
- `resource_uri` - Full API URL
- `status` - Event status (initially "draft")
- All provided fields
- Generated fields (created, changed timestamps)

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully creates a basic event with required fields
- [ ] Tool validates required parameters before API call
- [ ] Tool handles both venue-based and online events
- [ ] Tool properly formats datetime with timezone
- [ ] Tool returns complete event object with ID
- [ ] Tool supports all optional parameters
- [ ] Tool handles series parent creation (`is_series: true`)

### Error Handling
- [ ] Validates mutually exclusive fields (venue_id vs online_event)
- [ ] Returns clear error for missing required fields
- [ ] Handles authentication errors (401, 403)
- [ ] Handles validation errors (400)
- [ ] Handles rate limiting (429)
- [ ] Provides meaningful error messages to user

### Data Validation
- [ ] Validates timezone format (Olson specification)
- [ ] Validates datetime format (ISO 8601)
- [ ] Validates currency code (ISO 4217)
- [ ] Validates end time is after start time
- [ ] Validates capacity is positive integer
- [ ] Validates category/subcategory/format IDs exist

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with Eventbrite API
- [ ] Test with minimal required fields
- [ ] Test with all optional fields
- [ ] Test error scenarios
- [ ] Test series parent creation

## Implementation Notes

### Current Implementation
- Basic implementation exists in [`src/tools/create-event.ts`](../../src/tools/create-event.ts)
- Uses shared client from [`src/eventbrite/client.ts`](../../src/eventbrite/client.ts)

### Improvements Needed
1. Add validation for mutually exclusive fields
2. Add timezone validation
3. Add datetime validation
4. Improve error messages
5. Add support for series parent creation
6. Add comprehensive parameter documentation
7. Add examples to tool description

### Dependencies
- Requires valid OAuth token
- May require organization_id for some operations
- Venue creation tool (if venue_id not provided)
- Organizer creation tool (if organizer_id not provided)
- Media upload tool (if logo_id not provided)

### Related Tools
- `eventbrite_get_event` - Retrieve created event
- `eventbrite_update_event` - Update event details
- `eventbrite_publish_event` - Publish draft event
- `eventbrite_create_venue` - Create venue for event
- `eventbrite_create_ticket_class` - Add tickets to event

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/create/create-an-event

## Example Usage

### Minimal Event
```json
{
  "name": {"html": "My Event"},
  "start": {
    "timezone": "America/Los_Angeles",
    "utc": "2026-03-15T19:00:00Z"
  },
  "end": {
    "timezone": "America/Los_Angeles",
    "utc": "2026-03-15T22:00:00Z"
  },
  "currency": "USD"
}
```

### Complete Event
```json
{
  "name": {"html": "Tech Conference 2026"},
  "summary": "Annual technology conference featuring industry leaders",
  "start": {
    "timezone": "America/New_York",
    "utc": "2026-06-01T13:00:00Z"
  },
  "end": {
    "timezone": "America/New_York",
    "utc": "2026-06-01T21:00:00Z"
  },
  "currency": "USD",
  "venue_id": "123456",
  "organizer_id": "789012",
  "category_id": "102",
  "format_id": "2",
  "capacity": 500,
  "listed": true,
  "shareable": true,
  "show_remaining": true
}
```

## Next Steps
1. Review and enhance current implementation
2. Add comprehensive validation
3. Add unit tests
4. Add integration tests
5. Update tool description with examples
6. Document all edge cases
