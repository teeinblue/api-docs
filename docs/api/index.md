# Public API

The Teeinblue Public API reads order data, writes back a small set of order fields and
designs, and manages the images in your asset libraries.

## Base URL

```
https://api.teeinblue.com/openapi/v1
```

## Authentication

Authenticated endpoints take a Bearer token:

```
Authorization: Bearer YOUR_TOKEN
```

Each endpoint requires one ability, listed as `x-required-ability` on the operation. Asset
library endpoints require **assets:read** or **assets:write** — see
[Asset Libraries](/api/groups/asset-libraries).

::: warning Send `Accept: application/json` on every request
Without it, errors are not returned as JSON: a missing or invalid token is redirected to a
login page (`302`) instead of returning `401`, and a validation error is redirected instead
of returning `422`.
:::

## Rate limits

Every endpoint shares one limit of **60 requests per minute**, keyed to your account rather
than to the individual token. See [Rate Limiting](/api/groups/rate-limiting) for the response
headers and the back-off rule.

## Endpoints

Every endpoint in the API, by group. Each endpoint has its own page.

<ApiEndpoints />
