# Eventbrite API Documentation

This directory contains comprehensive documentation for the Eventbrite API v3, extracted from the official API documentation at https://www.eventbrite.com/platform/api.

## Documentation Files

### Core Documentation
1. **[00-overview.md](./00-overview.md)** - API overview, base URL, and feature summary
2. **[01-authentication.md](./01-authentication.md)** - Complete authentication guide (OAuth 2.0, private tokens)
3. **[02-errors.md](./02-errors.md)** - Error handling, common errors, and best practices
4. **[03-endpoints-reference.md](./03-endpoints-reference.md)** - Complete catalog of all 32 API resource categories and their endpoints
5. **[04-data-types.md](./04-data-types.md)** - Data types, formats, pagination, expansions, and eventual consistency

## Quick Start

### Base URL
```
https://www.eventbriteapi.com/v3
```

### Authentication
Get your private token from: https://www.eventbrite.com/platform/api-keys

Include in requests:
```http
Authorization: Bearer YOUR_TOKEN
```

### Example Request
```bash
curl -X GET \
  https://www.eventbriteapi.com/v3/users/me/ \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

## Key Features

- **REST-based API** - Uses POST instead of PUT
- **OAuth 2.0** - Secure authorization
- **JSON responses** - All responses in JSON format
- **Rate limiting** - 2,000 calls/hour per token
- **Pagination** - Continuation tokens for large result sets
- **Expansions** - Fetch related data in single requests
- **Eventual consistency** - Changes may take 1-15 seconds to propagate

## API Resources

The Eventbrite API provides 32 major resource categories:

### Event Management
- **Event** - Core event CRUD operations
- **Event Series** - Recurring events
- **Event Schedule** - Schedule management
- **Event Description** - Rich content management
- **Event Capacity** - Capacity tiers and holds
- **Event Teams** - Team management

### Ticketing
- **Ticket Class** - Ticket types and pricing
- **Ticket Group** - Ticket grouping
- **Inventory Tiers** - Tiered inventory
- **Discount** - Discount codes
- **Pricing** - Fee calculation

### Orders & Attendees
- **Order** - Order management
- **Attendee** - Attendee information
- **Questions** - Custom registration questions
- **Ticket Buyer Settings** - Buyer experience

### Organization & Users
- **Organization** - Organization management
- **Organizations Members** - Membership
- **Organization Roles** - Role-based permissions
- **User** - User accounts

### Venue & Location
- **Venue** - Event locations
- **Seat Map** - Reserved seating

### Content & Media
- **Media** - Image uploads
- **Structured Content** - Rich content modules
- **Online Event Page** - Digital content pages
- **Display Settings** - Event display config
- **Texts Overrides** - Custom text strings

### Data & Analytics
- **Reports** - Sales and attendee reports
- **Balance** - Event-level balance

### Discovery
- **Categories** - Event categories
- **Formats** - Event formats
- **Event Search** - Public event search (deprecated)

### Integration
- **Webhooks** - Event notifications

## Common Patterns

### Pagination
```javascript
let allItems = [];
let continuation = null;

do {
  const url = continuation 
    ? `${baseUrl}?continuation=${continuation}`
    : baseUrl;
  
  const response = await fetch(url, { headers });
  const data = await response.json();
  
  allItems.push(...data.items);
  continuation = data.pagination.has_more_items 
    ? data.pagination.continuation 
    : null;
} while (continuation);
```

### Expansions
```javascript
// Fetch event with venue and organizer details
const response = await fetch(
  'https://www.eventbriteapi.com/v3/events/123/?expand=venue,organizer',
  { headers }
);
```

### Error Handling
```javascript
try {
  const response = await fetch(url, options);
  const data = await response.json();
  
  if (!response.ok) {
    switch (data.error) {
      case 'HIT_RATE_LIMIT':
        // Wait and retry
        await sleep(60000);
        return retry();
      case 'NOT_AUTHORIZED':
        throw new PermissionError();
      default:
        throw new APIError(data.error_description);
    }
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

## Rate Limiting

- **Default**: 2,000 API calls per hour per token
- **Error Code**: `HIT_RATE_LIMIT` (HTTP 429)
- **Best Practice**: Implement exponential backoff

## Data Formats

### Dates
- ISO 8601 format
- UTC timezone for datetime
- Timezone-aware for event times

### Currency
- Minor units (cents)
- ISO 4217 currency codes
- Example: `{"currency": "USD", "value": 1000}` = $10.00

### Addresses
- ISO 3166 country codes
- Localized formatting
- Latitude/longitude coordinates

## Best Practices

1. **Use expansions wisely** - Reduces API calls but slows requests
2. **Implement rate limiting** - Track usage, implement backoff
3. **Handle eventual consistency** - Use waypoint tokens when needed
4. **Validate input** - Prevent 400-level errors
5. **Log errors properly** - Use error codes for logic, descriptions for debugging
6. **Secure tokens** - Never expose in client-side code
7. **Use pagination** - Don't assume all results fit in one page
8. **Test thoroughly** - Use sandbox/test environment

## Additional Resources

- **Official Documentation**: https://www.eventbrite.com/platform/docs
- **API Reference**: https://www.eventbrite.com/platform/api
- **API Keys**: https://www.eventbrite.com/platform/api-keys
- **Changelog**: https://www.eventbrite.com/platform/docs/changelog
- **Support**: https://www.eventbrite.com/platform/docs/contact
- **API Blueprint**: https://jsapi.apiary.io/apis/eventbriteapiv3public.source

## Documentation Generation

This documentation was generated by exploring the Eventbrite API documentation page using Playwright MCP on 2026-02-08.

## Notes

- Some endpoints are marked as deprecated - check the changelog for alternatives
- The API uses eventual consistency - changes may not be immediately visible
- Waypoint tokens provide immediate consistency at the cost of slower requests
- All timestamps are in ISO 8601 format
- Currency values are always in minor units (cents)
