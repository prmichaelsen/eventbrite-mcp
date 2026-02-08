# Tool: Publish Event

## Endpoint
`POST /v3/events/{id}/publish/`

## Description
Publish an event to make it publicly visible. Event must have all required information before publishing.

## Priority
**HIGH** - Required to make events live

## Status
⚪ Not Started

## MCP Tool Name
`eventbrite_publish_event`

## Parameters

### Required
- `event_id` (string) - Event ID to publish

## Response
Returns boolean indicating success or failure of publish action.

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully publishes draft event
- [ ] Tool validates event has all required information
- [ ] Tool handles series parent publishing (publishes all occurrences)
- [ ] Tool returns clear success/failure indication
- [ ] Tool provides validation errors if publish fails

### Publish Requirements
Event must have:
- [ ] Name
- [ ] Description or structured content
- [ ] Organizer
- [ ] At least one ticket class
- [ ] Valid payment options (for paid events)
- [ ] Start and end times
- [ ] Venue or online_event flag

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Returns validation errors with specific missing fields
- [ ] Handles authentication errors (401, 403)
- [ ] Handles already published events
- [ ] Handles deleted events
- [ ] Handles rate limiting (429)

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with valid event
- [ ] Test with incomplete event (should fail)
- [ ] Test with series parent
- [ ] Test error scenarios

## Implementation Notes

### Pre-Publish Validation
Before calling this endpoint, validate the event has:
1. Name and description/structured content
2. Organizer
3. At least one ticket class
4. Payment options (if paid)
5. Valid start/end times
6. Venue or online_event flag

### Series Parent Behavior
- Publishing a series parent publishes ALL occurrences
- All occurrences must be in valid state
- Cannot publish individual occurrences

### Dependencies
- Event must exist and be in draft status
- Event must have all required fields populated
- User must have publish permissions

### Related Tools
- `eventbrite_get_event` - Check event status before publishing
- `eventbrite_unpublish_event` - Unpublish event
- `eventbrite_create_event` - Create event to publish
- `eventbrite_create_ticket_class` - Add tickets before publishing

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/publish/publish-an-event

## Example Usage

```json
{
  "event_id": "123456789"
}
```

## Common Errors

### ARGUMENTS_ERROR
Event is missing required fields. Response will include which fields are missing.

### NOT_AUTHORIZED
User doesn't have permission to publish this event.

### BAD_REQUEST
Event is already published or in invalid state.
