# Eventbrite API - Error Handling

## Error Response Format

When an error occurs during an API request, you will receive:
1. An HTTP error status (in the 400-500 range)
2. A JSON response containing more information about the error

### Example Error Response
```json
{
  "error": "VENUE_AND_ONLINE",
  "error_description": "You cannot both specify a venue and set online_event",
  "status_code": 400
}
```

### Error Response Fields

| Field | Description |
|-------|-------------|
| `error` | Constant string value for the error. Use this for error handling logic as it won't change based on locale or API changes. |
| `error_description` | Human-readable description of the error. Should only be displayed to developers, not end users. |
| `status_code` | HTTP status code. Mirrors the HTTP status for convenience. |

## Common Errors

| Status Code | Error Code | Description |
|-------------|------------|-------------|
| 301 | PERMANENTLY_MOVED | Resource must be retrieved from a different URL |
| 400 | ACTION_NOT_PROCESSED | Requested operation not processed |
| 400 | ARGUMENTS_ERROR | There are errors with your arguments |
| 400 | BAD_CONTINUATION_TOKEN | Invalid continuation token passed |
| 400 | BAD_PAGE | Page number does not exist or is an invalid format (e.g. negative) |
| 400 | BAD_REQUEST | The resource you're creating already exists |
| 400 | INVALID_ARGUMENT | Invalid argument value passed |
| 400 | INVALID_AUTH | Authentication/OAuth token is invalid |
| 400 | INVALID_AUTH_HEADER | Authentication header is invalid |
| 400 | INVALID_BATCH | Batched request is missing or invalid |
| 400 | INVALID_BODY | A request body that was not in JSON format was passed |
| 400 | UNSUPPORTED_OPERATION | Requested operation not supported |
| 401 | ACCESS_DENIED | Authentication unsuccessful |
| 401 | NO_AUTH | Authentication not provided |
| 403 | NOT_AUTHORIZED | User has not been authorized to perform that action |
| 404 | NOT_FOUND | Invalid URL |
| 405 | METHOD_NOT_ALLOWED | Method is not allowed for this endpoint |
| 409 | REQUEST_CONFLICT | Requested operation resulted in conflict |
| 429 | HIT_RATE_LIMIT | Hourly rate limit has been reached for this token. Default rate limits are 2,000 calls per hour |
| 500 | EXPANSION_FAILED | Unhandled error occurred during expansion; the request is likely to succeed if you don't ask for expansions |
| 500 | INTERNAL_ERROR | Unhandled error occurred in Eventbrite |

## Error Handling Best Practices

### 1. Use the Error Code for Logic
```javascript
if (error.error === 'HIT_RATE_LIMIT') {
  // Implement exponential backoff
  await wait(retryAfter);
  retry();
}
```

### 2. Log Error Descriptions for Debugging
```javascript
console.error(`API Error: ${error.error} - ${error.error_description}`);
```

### 3. Handle Rate Limiting
```javascript
if (error.status_code === 429) {
  // Wait before retrying
  const retryAfter = response.headers['retry-after'] || 60;
  await sleep(retryAfter * 1000);
  return retryRequest();
}
```

### 4. Validate Input Before Sending
- Check required fields
- Validate data types
- Ensure proper formatting
- This prevents many 400-level errors

### 5. Implement Retry Logic
```javascript
async function apiCallWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status_code === 500 && i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
}
```

### 6. Handle Specific Error Cases
```javascript
switch (error.error) {
  case 'NOT_FOUND':
    // Resource doesn't exist
    return null;
  
  case 'NOT_AUTHORIZED':
    // User lacks permissions
    throw new PermissionError();
  
  case 'INVALID_AUTH':
    // Token is invalid, need to re-authenticate
    await refreshToken();
    return retry();
  
  default:
    // Unexpected error
    logError(error);
    throw error;
}
```

## HTTP Status Code Categories

### 2xx Success
- Request was successful
- No error handling needed

### 3xx Redirection
- **301 PERMANENTLY_MOVED**: Update your stored URL

### 4xx Client Errors
- Problem with the request
- Fix the request before retrying
- Check authentication, parameters, and permissions

### 5xx Server Errors
- Problem on Eventbrite's side
- Safe to retry with exponential backoff
- Contact support if problem persists

## Debugging Tips

1. **Check the error code first** - It tells you the category of the problem
2. **Read the error description** - It provides specific details
3. **Verify your authentication** - Many errors stem from auth issues
4. **Check API documentation** - Ensure you're using the correct parameters
5. **Test with minimal data** - Isolate the problematic field
6. **Check for API updates** - Review the changelog for breaking changes
7. **Contact support** - For persistent 500 errors or unclear error messages

## Support Resources

- **Documentation**: https://www.eventbrite.com/platform/docs
- **Changelog**: https://www.eventbrite.com/platform/docs/changelog
- **Contact Support**: https://www.eventbrite.com/platform/docs/contact
