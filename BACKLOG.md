# 23blocks SDK Backlog

> This file tracks pending work, prerequisites, and future enhancements for the SDK.

---

## Critical Prerequisites (Blocking Integration Tests)

These items MUST be completed before integration tests can run in CI:

### 1. Docker Image for Rails API
- **Status:** NOT STARTED
- **Owner:** Backend Team
- **Description:** Create and publish a Docker image of the 23blocks Rails API
- **Requirements:**
  - Image must include all API endpoints used by the SDK
  - Must support `RAILS_ENV=test` configuration
  - Must expose a `/health` endpoint for readiness checks
  - Push to AWS ECR or Docker Hub
- **Target registry:** `${ECR_REGISTRY}/23blocks-api:latest`

### 2. Database Seed Data
- **Status:** TEMPLATE CREATED
- **Owner:** Backend Team
- **Files to update:**
  - `docker/db/seeds/base.sql` - Minimal data for Tier 2 tests
  - `docker/db/seeds/full.sql` - Comprehensive data for Tier 3 tests
- **Required seed data:**
  - [ ] Test users with known passwords (e.g., `seeded-user@example.com` / `TestPassword123!`)
  - [ ] Test app configuration (`test-app-id`)
  - [ ] Sample products for search tests
  - [ ] Sample CRM contacts
  - [ ] Sample content items
  - [ ] Any other entities needed by the 18 SDK blocks

### 3. GitHub Secrets Configuration
- **Status:** NOT CONFIGURED
- **Owner:** DevOps / Admin
- **Required secrets:**
  - [ ] `AWS_ACCESS_KEY_ID` - For ECR login
  - [ ] `AWS_SECRET_ACCESS_KEY` - For ECR login
- **Required variables:**
  - [ ] `API_IMAGE` - Docker image name (e.g., `123456789.dkr.ecr.us-east-1.amazonaws.com/23blocks-api`)
  - [ ] `API_VERSION` - Image tag (default: `latest`)
  - [ ] `AWS_REGION` - AWS region (default: `us-east-1`)

---

## Pending Test Implementation

### Consumer Test Apps
- **Status:** NOT STARTED
- **Priority:** Medium
- **Description:** Create minimal test applications to verify SDK works in real framework contexts
- **Tasks:**
  - [ ] Angular 17+ test app (`tests/consumers/angular-app/`)
  - [ ] React 18+ test app (`tests/consumers/react-app/`)
  - [ ] Node.js test app (`tests/consumers/node-app/`)
- **Each app should:**
  - Import and configure the SDK
  - Perform basic authentication
  - Execute a search query
  - Build without errors

### Additional Integration Tests
- **Status:** PARTIAL (Auth + Search templates done)
- **Priority:** Medium
- **Tasks:**
  - [ ] CRM block integration tests
  - [ ] Products block integration tests
  - [ ] Files block integration tests
  - [ ] Content block integration tests
  - [ ] University block integration tests
  - [ ] All remaining blocks (18 total)

### Workflow Tests (Tier 3)
- **Status:** NOT STARTED
- **Priority:** Low (after integration tests work)
- **Location:** `tests/integration/workflows/`
- **Tasks:**
  - [ ] User journey workflow (signup → login → create → search → logout)
  - [ ] Content lifecycle workflow
  - [ ] Multi-tenant workflow
  - [ ] Error handling scenarios
  - [ ] Concurrent operations test

---

## Technical Debt

### JSON:API Full Compliance
- **Status:** PENDING
- **Priority:** Medium
- **Date Added:** December 2024

**Current State:**
- Responses: JSON:API compliant (via `fast_jsonapi` serializers)
- Requests: Rails strong params format (`{ user: { ... } }`)
- Content-Type: Using `application/json` (not `application/vnd.api+json`)

**Problem:**
The SDK and API are hybrid - JSON:API responses but Rails-style requests. This is inconsistent with the JSON:API specification.

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

## Future Enhancements

### Performance Benchmarks
- **Priority:** Low
- **Description:** Add performance tracking to catch regressions
- **Tasks:**
  - [ ] Response time benchmarks per block
  - [ ] Memory usage tracking
  - [ ] Bundle size monitoring

### Test Coverage Reporting
- **Priority:** Low
- **Description:** Add coverage reports to CI
- **Tasks:**
  - [ ] Configure Vitest coverage
  - [ ] Add coverage thresholds
  - [ ] Report to GitHub PR comments

### OpenAPI Contract Testing
- **Priority:** Low
- **Description:** Validate SDK against OpenAPI spec
- **Tasks:**
  - [ ] Generate/obtain OpenAPI spec from Rails API
  - [ ] Add Prism or similar for contract validation
  - [ ] Fail tests if SDK requests don't match spec

---

## Completed Items

### Test Infrastructure (December 2024)
- [x] Research SDK testing best practices
- [x] Design tiered testing architecture
- [x] Write test suite strategy document (`docs/TEST_SUITE_STRATEGY.md`)
- [x] Create test directory structure
- [x] Configure Vitest with workspaces
- [x] Create Docker compose configuration
- [x] Write unit tests for mappers (32 tests passing)
- [x] Write integration test templates (Auth, Search blocks)
- [x] Create CI workflows (pr-checks, merge-tests, full-tests)
- [x] Add npm scripts for testing

---

## How to Use This File

1. **Before starting work:** Check this file for prerequisites and blockers
2. **When completing items:** Move them to "Completed Items" with date
3. **When adding new work:** Add to appropriate section with status and priority
4. **Regular review:** Review this file weekly to update statuses

---

## Quick Reference: Test Commands

\`\`\`bash
# Run unit tests (always works)
npm run test:unit

# Run integration tests (requires Docker API)
npm run docker:up
npm run test:integration
npm run docker:down

# Run full test suite
npm run test:all
\`\`\`

## Quick Reference: CI Workflows

| Workflow | File | Trigger |
|----------|------|---------|
| PR Checks | \`.github/workflows/pr-checks.yml\` | Every PR |
| Merge Tests | \`.github/workflows/merge-tests.yml\` | Push to main |
| Full Tests | \`.github/workflows/full-tests.yml\` | Manual trigger |
