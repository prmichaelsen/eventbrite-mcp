# Eventbrite API v3 - Overview

## Base URL
```
https://www.eventbriteapi.com/v3
```

## API Characteristics
- **Architecture**: REST-based (uses POST instead of PUT)
- **Authorization**: OAuth2
- **Response Format**: Always returns JSON
- **Rate Limit**: 2,000 calls per hour (default)

## Documentation Structure

The Eventbrite API documentation is organized into two main sections:

### 1. Introduction
- About our API
- Authentication
- Errors
- Paginated Responses
- Expansions
- API Switches
- Basic Types
- Eventual Consistency

### 2. Reference (API Endpoints)
The API provides the following resource categories:

1. **Attendee** - Manage event attendees and ticket holders
2. **Balance** - Event-level balance information
3. **Categories** - Event categories and subcategories
4. **Discount** - Discount codes and access codes
5. **Display Settings** - Event display configuration
6. **Event Capacity** - Capacity tiers and holds
7. **Event Description** - Event description management
8. **Event Schedule** - Recurring event schedules
9. **Event Search** - Public event search (deprecated)
10. **Event Series** - Repeating events
11. **Event Teams** - Team management for events
12. **Event** - Core event management
13. **Formats** - Event format types
14. **Inventory Tiers** - Tiered inventory management
15. **Media** - Image and media uploads
16. **Online Event Page** - Digital content pages
17. **Order** - Order and purchase management
18. **Organizations Members** - Organization membership
19. **Organization Roles** - Role-based permissions
20. **Organization** - Organization management
21. **Pricing** - Fee calculation and pricing
22. **Questions** - Custom registration questions
23. **Reports** - Sales and attendee reports
24. **Seat Map** - Reserved seating maps
25. **Structured Content** - Rich content modules
26. **Texts Overrides** - Custom text strings
27. **Ticket Buyer Settings** - Buyer experience settings
28. **Ticket Class** - Ticket types and pricing
29. **Ticket Group** - Ticket grouping
30. **User** - User account management
31. **Venue** - Event location management
32. **Webhooks** - Event notifications

## Key Features

### Expansions
The API supports expansions to fetch related data in a single request, reducing the number of API calls needed.

### Pagination
List endpoints return paginated responses with continuation tokens for navigating through large result sets.

### Eventual Consistency
The platform uses eventual consistency, meaning changes may not be immediately visible. Waypoint tokens can be used for immediate consistency when needed.

### API Switches
Switches allow dynamic modification of endpoint behaviors for feature rollout and backwards compatibility.

## Download
API Blueprint available at: https://jsapi.apiary.io/apis/eventbriteapiv3public.source
