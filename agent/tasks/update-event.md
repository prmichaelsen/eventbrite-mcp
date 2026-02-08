# Tool: Update Event

## Endpoint
`POST /v3/events/{id}/`

## Description
Update an existing event by Event ID. Supports partial updates - only submit fields that are changing.

## Priority
**HIGH** - Essential for event management

## Status
⚪ Not Started

## MCP Tool Name
`eventbrite_update_event`

## Parameters

### Required
- `event_id` (string) - Event ID to update

### Optional (any field from Create Event)
- `name` (object) - Event name
- `summary` (string) - Event summary
- `start` (object) - Event start date/time
- `end` (object) - Event end date/time
- `currency` (string) - Currency code
- `organizer_id` (string) - Organizer ID
- `venue_id` (string) - Venue ID
- `online_event` (boolean) - Online-only event
- `listed` (boolean) - Public searchability
- `shareable` (boolean) - Social sharing
- `invite_only` (boolean) - Invitation-only
- `show_remaining` (boolean) - Show remaining tickets
- `password` (string) - Event password
- `capacity` (integer) - Maximum capacity
- `capacity_is_custom` (boolean) - Custom capacity flag
- `category_id` (string) - Category ID
- `subcategory_id` (string) - Subcategory ID
- `format_id` (string) - Format ID
- `hide_start_date` (boolean) - Hide start date
- `hide_end_date` (boolean) - Hide end date
- `logo_id` (string) - Logo image ID

## Response
Returns updated Event object with all fields.

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully updates event with any valid field
- [ ] Tool supports partial updates (only changed fields)
- [ ] Tool validates field types before API call
- [ ] Tool handles series parent updates (propagates to occurrences)
- [ ] Tool returns complete updated event object
- [ ] Tool preserves unchanged fields

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Handles authentication errors (401, 403)
- [ ] Handles validation errors (400)
- [ ] Handles published event restrictions
- [ ] Handles rate limiting (429)
- [ ] Provides meaningful error messages

### Data Validation
- [ ] Validates datetime formats
- [ ] Validates timezone formats
- [ ] Validates currency codes
- [ ] Validates mutually exclusive fields
- [ ] Validates end time after start time
- [ ] Validates capacity is positive

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with Eventbrite API
- [ ] Test partial updates
- [ ] Test series parent updates
- [ ] Test error scenarios
- [ ] Test field validation

## Implementation Notes

### Series Parent Behavior
When updating a series parent event, these fields propagate to all occurrences:
- `name`
- `description`
- `hide_start_date`
- `hide_end_date`
- `currency`
- `show_remaining`
- `password`
- `capacity`
- `source`

### Dependencies
- Requires valid OAuth token
- Event must exist and be owned by authenticated user
- Cannot update certain fields on published events

### Related Tools
- `eventbrite_get_event` - Retrieve event before updating
- `eventbrite_create_event` - Create new event
- `eventbrite_publish_event` - Publish after updating
- `eventbrite_unpublish_event` - Unpublish before major updates

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/update/update-an-event

## Example Usage

### Update Name Only
```json
{
  "event_id": "123456789",
  "name": {"html": "Updated Event Name"}
}
```

### Update Multiple Fields
```json
{
  "event_id": "123456789",
  "summary": "New summary text",
  "capacity": 1000,
  "show_remaining": true
}
```

### Update Dates
```json
{
  "event_id": "123456789",
  "start": {
    "timezone": "America/Los_Angeles",
    "utc": "2026-04-15T19:00:00Z"
  },
  "end": {
    "timezone": "America/Los_Angeles",
    "utc": "2026-04-15T23:00:00Z"
  }
}
```
