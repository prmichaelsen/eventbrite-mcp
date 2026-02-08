# Eventbrite API - Authentication

## Overview

The Eventbrite API uses **OAuth 2.0** for authorization. There are two main approaches:

1. **Private Token** - For making API requests on your own behalf
2. **OAuth Flow** - For making API requests on behalf of other users (App Partners)

## 1. Get a Private Token

### Steps:
1. Log in to your Eventbrite account
2. Visit your API Keys page: https://www.eventbrite.com/platform/api-keys
3. Copy your private token

### Use Case:
- Making API requests on your own behalf
- Testing and development
- Personal automation

## 2. OAuth Flow (For App Partners)

### What You'll Need:
- **API Key** (Client ID)
- **Client Secret**
- **Redirect URI**

Find this information at: https://www.eventbrite.com/account-settings/apps

### Server-Side Authorization (Recommended)

#### Step 1: Redirect Users to Authorization URL
```
https://www.eventbrite.com/oauth/authorize?response_type=code&client_id=YOUR_API_KEY&redirect_uri=YOUR_REDIRECT_URI
```

#### Step 2: Receive Access Code
When the user authorizes your app, they'll be redirected to your redirect URI with an access code:
```
http://localhost:8080/oauth/redirect?code=YOUR_ACCESS_CODE
```

#### Step 3: Exchange Code for Token
Send a POST request to exchange the access code for a private token:

```bash
curl --request POST \
  --url 'https://www.eventbrite.com/oauth/token' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type=authorization_code \
  --data 'client_id=API_KEY \
  --data client_secret=CLIENT_SECRET \
  --data code=ACCESS_CODE \
  --data 'redirect_uri=REDIRECT_URI'
```

The response will contain the user's private token in JSON format.

### Client-Side Authorization (Not Recommended)

#### Step 1: Redirect Users to Authorization URL
```
https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=YOUR_API_KEY&redirect_uri=YOUR_REDIRECT_URI
```

#### Step 2: Receive Token
When the user authorizes your app, the private token will be included as a query parameter in the redirect.

**Note**: Client-side authorization is less secure and not recommended for production applications.

## 3. Authenticate API Requests

Once you have a private token (either your own or a user's), include it in API requests using one of two methods:

### Method 1: Authorization Header (Recommended)
```http
Authorization: Bearer MYTOKEN
```

### Method 2: Query Parameter
```
/v3/users/me/?token=MYTOKEN
```

## Best Practices

### 1. Do Not Use Private Tokens in Client-Side Code
- Never expose private tokens in client-side JavaScript
- Always handle authentication on the server side
- Remove all private information before making code public

### 2. Delete Unneeded API Keys
- Minimize exposure to attack by deleting unused tokens
- Regularly audit and rotate API keys
- Revoke tokens for decommissioned applications

### 3. Secure Token Storage
- Store tokens securely (encrypted databases, environment variables)
- Never commit tokens to version control
- Use secret management services in production

## Token Permissions

Tokens grant access to specific scopes/permissions. The available permissions depend on:
- The user's role in the organization
- The OAuth scopes requested during authorization
- The organization's settings and plan

## Rate Limiting

- **Default**: 2,000 API calls per hour per token
- Rate limit errors return HTTP 429 status code
- Error code: `HIT_RATE_LIMIT`

## Testing Authentication

Test your authentication by calling the user endpoint:

```bash
curl -X GET \
  https://www.eventbriteapi.com/v3/users/me/ \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

Successful authentication returns your user information. Failed authentication returns a 401 error.
