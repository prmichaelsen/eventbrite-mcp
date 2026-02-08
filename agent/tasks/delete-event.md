# Tool: Delete Event

## Endpoint
`DELETE /v3/events/{id}/`

## Description
Delete an event if deletion is permitted. Event must not have any pending or completed orders.

## Priority
**MEDIUM** - Important for event management

## Status
⚪ Not Started

## MCP Tool Name
`eventbrite_delete_event`

## Parameters

### Required
- `event_id` (string) - Event ID to delete

## Response
Returns boolean indicating success or failure of delete action.

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully deletes eligible event
- [ ] Tool validates event can be deleted (no orders)
- [ ] Tool handles series parent deletion (deletes all occurrences)
- [ ] Tool returns clear success/failure indication
- [ ] Tool confirms deletion is permanent

### Deletion Rules
- [ ] Event must not have pending orders
- [ ] Event must not have completed orders
- [ ] Free events with no orders can be deleted
- [ ] Paid events with no orders can be deleted
- [ ] Series parent: all occurrences must be deletable

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Returns error if event has orders
- [ ] Handles authentication errors (401, 403)
- [ ] Handles already deleted events
- [ ] Handles rate limiting (429)
- [ ] Provides meaningful error messages

### Safety
- [ ] Warns user that deletion is permanent
- [ ] Optionally requires confirmation
- [ ] Logs deletion for audit trail
- [ ] Returns deleted event ID for reference

### Integration
- [ ] Integrates with existing MCP server structure
- [ ] Uses shared Eventbrite client
- [ ] Follows project error handling patterns
- [ ] Includes proper TypeScript types
- [ ] Includes JSDoc documentation

### Testing
- [ ] Unit tests for parameter validation
- [ ] Integration test with deletable event
- [ ] Test with event that has orders (should fail)
- [ ] Test with series parent
- [ ] Test error scenarios

## Implementation Notes

### Deletion Restrictions
Cannot delete if:
- Event has any pending orders
- Event has any completed orders
- User lacks delete permissions
- Event is part of series and other occurrences have orders

### Series Parent Behavior
- Deleting series parent deletes ALL occurrences
- All occurrences must be in valid state for deletion
- Cannot delete individual occurrences

### Warning
**Deletion is permanent and cannot be undone.**

### Dependencies
- Requires valid OAuth token
- Event must exist and be owned by authenticated user
- Event must have no orders

### Related Tools
- `eventbrite_get_event` - Check event status before deleting
- `eventbrite_cancel_event` - Alternative to deletion
- `eventbrite_unpublish_event` - Hide event without deleting
- `eventbrite_list_orders` - Check if event has orders

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#12-event)
- Official docs: https://www.eventbrite.com/platform/api#/reference/event/delete/delete-an-event

## Example Usage

```json
{
  "event_id": "123456789"
}
```

## Common Errors

### NOT_AUTHORIZED
User doesn't have permission to delete this event.

### BAD_REQUEST
Event has orders and cannot be deleted. Consider canceling instead.

### NOT_FOUND
Event doesn't exist or has already been deleted.
