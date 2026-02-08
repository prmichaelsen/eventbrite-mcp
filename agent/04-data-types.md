# Eventbrite API - Data Types and Formats

## Basic Types

### Integer
```json
10
```
A standard JSON integer.

### Boolean
```json
true
```
A standard JSON boolean.

### String
```json
"Ihre Aal ist r\\u00fcckw\\u00e4rts"
```
A standard JSON string. When POSTing data as `application/x-www-form-urlencoded`, use UTF-8 encoded string instead of unicode escapes.

### Float
```json
72.19381730
```
A standard JSON floating-point decimal.

### Decimal
```json
"72.19381730"
```
An arbitrary-precision decimal number encoded as a JSON string. Used when floating-point arithmetic inaccuracies could arise.

## Date and Time Types

### Date
```json
"2010-01-31"
```
Date as a string in ISO8601 date format.

### Datetime
```json
"2010-01-31T13:00:00Z"
```
Date and time as a string in ISO8601 combined date and time format in UTC (Coordinated Universal Time).

### Local Datetime
```json
"2010-01-31T13:00:00"
```
Date and time as a string in Naive Local ISO8601 format in the timezone of the event.

### Datetime with Timezone
```json
{
  "timezone": "America/Los_Angeles",
  "utc": "2018-05-12T02:00:00Z",
  "local": "2018-05-11T19:00:00"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `timezone` | string | A timezone value from the Olson specification |
| `utc` | datetime | A datetime value in the UTC timezone |
| `local` | datetime | A datetime value in the named timezone |

**When sending as a request:**
- `utc` and `timezone` are required
- `local` is ignored

## Collection Types

### List
```json
[1, 2, 3, 4]
```
or (for form-encoded):
```
"1,2,3,4"
```

With `application/json` content-type, use a JSON array. With `application/x-www-form-urlencoded`, use a comma-separated string.

### Object List
```json
[{"name1": "val1", "name2": "val2"}, {...}]
```
or (for form-encoded):
```
"[{\"name1\": \"val1\", \"name2\": \"val2\"}, {...}]"
```

With `application/json`, use a JSON array. With `application/x-www-form-urlencoded`, use a string encoding of a JSON array.

### Dictionary
```json
{
  "key1": "value1",
  "key2": {"objectkey": "value"},
  "key3": ["list_values"]
}
```
or (for form-encoded):
```
"{\"key2\": {\"key3\": \"value\"}, \"key1\": \"value\", \"key4\": [\"value\", \"value\"]}"
```

With `application/json`, use a JSON object. With `application/x-www-form-urlencoded`, use a string encoding of a JSON object.

## Domain-Specific Types

### Multipart Text
```json
{
  "text": "Event Name",
  "html": "Event Name"
}
```
Returned for fields representing HTML (like event names and descriptions).
- `html` - Original HTML (sanitized, free from script tags)
- `text` - Stripped version for plain text display

### Country Code
```json
"AR"
```
The ISO 3166 alpha-2 code of a country.

### Currency Code
```json
"USD"
```
An ISO 4217 3-character code of a currency.

### Currency
```json
{
  "currency": "USD",
  "value": 432,
  "major_value": "4.32",
  "display": "4.32 USD"
}
```

When submitting as form-encoded POST data:
```
USD,432
```

When submitting as JSON POST body, use the full object with `currency` and `value` fields.

**Important Notes:**
- Currencies are represented as their currency code and an integer value
- The integer value is the number of units of the minor unit (e.g., cents for USD)
- To get the major unit value, shift the decimal point left by the exponent value defined in ISO 4217
- Example: USD has exponent 2, so value `2311` becomes `$23.11`
- Example: JPY has exponent 0, so value `2311` becomes `¥2311`
- The `display` value is formatted according to the locale

### Address
```json
{
  "address_1": "333 O'Farrell St",
  "address_2": "Suite 400",
  "city": "San Francisco",
  "region": "CA",
  "postal_code": "94102",
  "country": "US",
  "latitude": "37.7576792",
  "longitude": "-122.5078119",
  "localized_address_display": "333 O'Farrell St Suite 400, San Francisco, CA 94102",
  "localized_area_display": "San Francisco, CA",
  "localized_multi_line_address_display": [
    "333 O'Farrell St",
    "Suite 400",
    "San Francisco, CA 94102"
  ]
}
```

#### Address Fields

| Field | Type | Description |
|-------|------|-------------|
| `address_1` | string | The street/location address (part 1) - **Required** |
| `address_2` | string | The street/location address (part 2) - Optional |
| `city` | string | The city - Optional |
| `region` | string | The ISO 3166-2 2- or 3-character region code - Optional |
| `postal_code` | string | The postal code - Optional |
| `country` | string | The ISO 3166-1 2-character international code - **Required** |
| `latitude` | decimal | The latitude portion of the address coordinates |
| `longitude` | decimal | The longitude portion of the address coordinates |
| `localized_address_display` | string | Address display localized to the address country |
| `localized_area_display` | string | Area display localized to the address country |
| `localized_multi_line_address_display` | list | Multi-line format order localized to the address country |

### Object
```json
{
  "resource_uri": "https://www.eventbriteapi.com/v3/events/3564383166/",
  "id": "3564383166"
}
```

The standard base representation for first-class objects in Eventbrite (Event, Venue, Order, etc.).

- `resource_uri` - Absolute URL to the API endpoint for the canonical representation
- `id` - Unique identifier (note: not necessarily numeric)
- Other fields may not be present if their value is `null`
- Fields marked as `(optional)` may not contain a value

## Pagination

### Paginated Response Format
```json
{
  "pagination": {
    "object_count": 4,
    "continuation": "AEtFRyiWxkr0ZXyCJcnZ5U1-uSWXJ6vO0sxN06GbrDngaX5U5i8XYmEuZfmZZYB9Uq6bSizOLYoV",
    "page_count": 2,
    "page_size": 2,
    "has_more_items": true,
    "page_number": 1
  },
  "categories": [
    {
      "slug": "email",
      "name_localized": "Email",
      "name": "Email",
      "id": "7"
    }
  ]
}
```

### Pagination Header Fields

| Attribute | Description |
|-----------|-------------|
| `object_count` | Total number of objects found across all pages |
| `continuation` | Token to get the next set of results. Include this in the next request. Returns empty list when all records retrieved. |
| `page_count` | Total number of pages |
| `page_size` | Maximum number of objects per page for this endpoint |
| `has_more_items` | Boolean indicating if more items exist. `false` when all records retrieved. |
| `page_number` | Current page number (always starts at 1) |

### Using Continuation Tokens

1. Make a call to any listing endpoint
2. Check if `has_more_items` is `true`
3. Copy the `continuation` token from the response
4. Call the endpoint again with the continuation token:
   ```
   https://www.eventbriteapi.com/v3/categories/?continuation=TOKEN
   ```
5. Repeat until all records retrieved

## Expansions

Expansions allow you to fetch related data in a single request, reducing API calls.

### Expansions v1 (Legacy)
```
/v3/users/me/owned_events/?expand=organizer,venue
```

Comma-separated list of expansion names. Can be nested up to 4 levels deep:
```
/v3/users/me/orders/?expand=event.venue
```

### Expansions v2 (Recommended)
```
?expand.event=organizer,venue
```

Keys off the `_type` attributes in the response. For nested expansions:
```
?expand.order=event&expand.event=organizer,venue
```

Or with nested syntax:
```
?expand.order=event,event.organizer,event.venue
```

**Note:** Each expansion slightly slows down the request. Use as few as possible for faster response times.

## Eventual Consistency

The Eventbrite Platform uses eventual consistency. Changes may not be immediately visible (1-15 seconds typically, up to 5 minutes maximum).

### Waypoint Tokens

For immediate consistency, use Waypoint tokens:

1. After a `POST` or `DELETE` request, the response includes an `Eventbrite-API-Waypoint-Token` header
2. Include this token in your next request header (even for `GET` requests)
3. Continue passing the most recent token in subsequent requests
4. This ensures you see your changes immediately
5. Adds up to 5 seconds to request time (usually less than 1 second)
6. Can be discarded after 5 minutes

## API Switches

Switches allow dynamic modification of endpoint behaviors for feature rollout.

### Switch Lifecycle
1. **Opt-in** - New switch available to turn on new feature
2. **Opt-out** - Feature on by default, switch available to turn it off
3. **Fully integrated** - Switch deprecated

### Using Switches

Enable a switch:
```http
GET /v3/events/12345/
Eb-Api-Switches-Enabled: EVENT_FORMAT_OCT_2016
```

Disable a switch:
```http
GET /v3/events/12345/
Eb-Api-Switches-Disabled: EVENT_FORMAT_OCT_2016
```

Multiple switches (comma-separated):
```http
Eb-Api-Switches-Enabled: SWITCH_ONE,SWITCH_TWO
```

### Switch Errors

| Status | Error Code | Description |
|--------|------------|-------------|
| 409 | REQUEST_CONFLICT | Conflicting switches (same switch in both Enabled and Disabled) |
| 403 | NOT_AUTHORIZED | Not allowed to set this switch |
| 400 | BAD_REQUEST | Switch does not exist or has been deprecated |
