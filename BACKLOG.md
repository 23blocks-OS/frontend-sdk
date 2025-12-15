# SDK Backlog

## High Priority

### JSON:API Full Compliance
**Date Added:** 2025-12-15
**Status:** Pending

**Current State:**
- Responses: JSON:API compliant (via `fast_jsonapi` serializers)
- Requests: Rails strong params format (`{ user: { ... } }`)
- Content-Type: Using `application/json` (not `application/vnd.api+json`)

**Problem:**
The SDK and API are hybrid - JSON:API responses but Rails-style requests. This is inconsistent with the JSON:API specification.

**JSON:API Request Format (not currently supported):**
```json
{
  "data": {
    "type": "users",
    "attributes": {
      "email": "user@example.com",
      "password": "secret",
      "name": "John Doe"
    }
  }
}
```

**Current Request Format (Rails strong params):**
```json
{
  "user": {
    "email": "user@example.com",
    "password": "secret",
    "name": "John Doe"
  }
}
```

**To Achieve Full Compliance:**

1. **API Changes Required:**
   - Register MIME type in Rails: `Mime::Type.register "application/vnd.api+json", :jsonapi`
   - Add JSON:API request parser or use gem like `jsonapi-resources` or `jsonapi.rb`
   - Update all controllers to read from `params.dig(:data, :attributes)` instead of `params.require(:resource)`

2. **SDK Changes Required:**
   - Revert request format to `{ data: { type, attributes } }`
   - Change Content-Type back to `application/vnd.api+json`
   - Update `jsonapi-codec` to handle encoding (currently only decodes)

**References:**
- JSON:API Specification: https://jsonapi.org
- jsonapi-resources gem: https://github.com/cerebris/jsonapi-resources
- jsonapi.rb gem: https://github.com/jsonapi-rb/jsonapi-rb

---

## Medium Priority

(empty)

---

## Low Priority

(empty)
