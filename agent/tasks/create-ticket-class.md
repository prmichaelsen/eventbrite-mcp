# Tool: Create Ticket Class

## Endpoint
`POST /v3/events/{id}/ticket_classes/`

## Description
Create a new ticket class (ticket type) for an event. Ticket classes define the types of tickets available for purchase.

## Priority
**HIGH** - Required for event ticketing

## Status
🟡 In Progress (basic implementation exists)

## MCP Tool Name
`eventbrite_create_ticket_class`

## Parameters

### Required
- `event_id` (string) - Event ID to create ticket class for
- `name` (string) - Ticket class name
- `quantity_total` (integer) - Total number of tickets available
- `free` (boolean) - Whether ticket is free

### Required for Paid Tickets
- `cost` (string) - Ticket cost in format "CURRENCY,VALUE" (e.g., "USD,5000" for $50.00)

### Optional
- `description` (string) - Ticket class description
- `donation` (boolean) - Whether ticket is a donation (default: false)
- `minimum_quantity` (integer) - Minimum tickets per order (default: 1)
- `maximum_quantity` (integer) - Maximum tickets per order
- `sales_start` (datetime) - When sales begin
- `sales_end` (datetime) - When sales end
- `sales_start_after` (string) - Ticket class ID that triggers sales start when sold out
- `hidden` (boolean) - Hide from public (default: false)
- `auto_hide` (boolean) - Auto-hide when not on sale (default: false)
- `auto_hide_before` (datetime) - Override auto-hide start time
- `auto_hide_after` (datetime) - Override auto-hide end time
- `include_fee` (boolean) - Include fee in displayed price
- `split_fee` (boolean) - Show fee separately
- `hide_description` (boolean) - Hide description on listing page
- `hide_sale_dates` (boolean) - Hide sale dates
- `delivery_methods` (list) - Delivery methods: `electronic`, `will_call`, `standard_shipping`, `third_party_shipping`
- `has_pdf_ticket` (boolean) - Enable PDF tickets
- `order_confirmation_message` (string) - Custom confirmation message
- `inventory_tier_id` (string) - Inventory tier ID (required for tiered events after May 7, 2020)
- `secondary_assignment_enabled` (boolean) - Enable secondary barcode (e.g., RFID)
- `image_id` (string) - Image ID for ticket class (for add-ons)
- `sorting` (integer) - Display order on listing page

### For Add-Ons
- `inventory_tier_id` (string) - Must reference an Add-On Inventory Tier (with `count_against_event_capacity: false`)

## Response
Returns created Ticket Class object with:
- `id` - Ticket class ID
- `resource_uri` - Full API URL
- All provided fields
- `quantity_sold` - Number sold (initially 0)
- `on_sale_status` - Sale status

## Acceptance Criteria

### Functional Requirements
- [ ] Tool successfully creates free ticket class
- [ ] Tool successfully creates paid ticket class
- [ ] Tool successfully creates donation ticket class
- [ ] Tool validates required fields
- [ ] Tool handles all optional parameters
- [ ] Tool creates add-on ticket classes
- [ ] Tool returns complete ticket class object

### Ticket Types
- [ ] Creates free tickets (free: true)
- [ ] Creates paid tickets with cost
- [ ] Creates donation tickets (donation: true)
- [ ] Creates add-on tickets (with add-on inventory tier)

### Validation
- [ ] Validates quantity_total is positive
- [ ] Validates cost format for paid tickets
- [ ] Validates sales_end after sales_start
- [ ] Validates minimum_quantity <= maximum_quantity
- [ ] Validates mutually exclusive fields (include_fee vs split_fee)
- [ ] Validates delivery_methods values
- [ ] Validates inventory_tier_id for tiered events

### Error Handling
- [ ] Returns clear error for invalid event ID (404)
- [ ] Returns error for missing required fields
- [ ] Handles authentication errors (401, 403)
- [ ] Handles validation errors (400)
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
- [ ] Integration test for free ticket
- [ ] Integration test for paid ticket
- [ ] Integration test for donation ticket
- [ ] Test with all optional parameters
- [ ] Test error scenarios

## Implementation Notes

### Current Implementation
- Basic implementation exists in [`src/tools/create-ticket-class.ts`](../../src/tools/create-ticket-class.ts)
- Uses shared client from [`src/eventbrite/client.ts`](../../src/eventbrite/client.ts)

### Improvements Needed
1. Add validation for all field types
2. Add support for all optional parameters
3. Add add-on ticket class support
4. Add inventory tier validation
5. Improve error messages
6. Add examples to tool description

### Cost Format
For paid tickets, cost must be in format:
- Form-encoded: `"USD,5000"` (currency code, value in minor units)
- JSON: `{"currency": "USD", "value": 5000}`

### Inventory Tiers
After May 7, 2020, `inventory_tier_id` is required for tiered events.

### Add-Ons
To create add-on:
1. First create Add-On Inventory Tier with `count_against_event_capacity: false`
2. Then create ticket class with that `inventory_tier_id`

### Dependencies
- Requires valid OAuth token
- Event must exist and be owned by authenticated user
- Inventory tier must exist (for tiered events)

### Related Tools
- `eventbrite_create_event` - Create event first
- `eventbrite_get_ticket_class` - Retrieve created ticket class
- `eventbrite_update_ticket_class` - Update ticket class
- `eventbrite_list_ticket_classes` - List all ticket classes
- `eventbrite_create_inventory_tier` - Create inventory tier for tiered events

## API Documentation Reference
- See [`agent/03-endpoints-reference.md`](../03-endpoints-reference.md#28-ticket-class)
- Official docs: https://www.eventbrite.com/platform/api#/reference/ticket-class/create/create-a-ticket-class

## Example Usage

### Free Ticket
```json
{
  "event_id": "123456789",
  "name": "General Admission",
  "quantity_total": 100,
  "free": true
}
```

### Paid Ticket
```json
{
  "event_id": "123456789",
  "name": "VIP Pass",
  "quantity_total": 50,
  "free": false,
  "cost": "USD,10000",
  "description": "Includes backstage access"
}
```

### Donation Ticket
```json
{
  "event_id": "123456789",
  "name": "Donation",
  "quantity_total": 1000,
  "free": false,
  "donation": true
}
```

### With Sales Window
```json
{
  "event_id": "123456789",
  "name": "Early Bird",
  "quantity_total": 25,
  "free": false,
  "cost": "USD,2500",
  "sales_start": "2026-02-01T00:00:00Z",
  "sales_end": "2026-02-28T23:59:59Z"
}
```
