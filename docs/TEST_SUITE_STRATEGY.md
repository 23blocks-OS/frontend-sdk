# 23blocks SDK Test Suite Strategy

> **Document Version:** 1.0
> **Last Updated:** December 2024
> **Status:** Implementation Ready

---

## CRITICAL: Prerequisites Before Integration Tests Work

> **See also:** [`BACKLOG.md`](../BACKLOG.md) for detailed tracking of these items.

Before Tier 2 and Tier 3 tests can run in CI, the following MUST be completed:

### 1. Docker Image for Rails API (BLOCKING)

| Item | Status | Owner |
|------|--------|-------|
| Create Dockerfile for Rails API | NOT STARTED | Backend Team |
| Configure for `RAILS_ENV=test` | NOT STARTED | Backend Team |
| Add `/health` endpoint | NOT STARTED | Backend Team |
| Push to AWS ECR | NOT STARTED | Backend Team |

**Expected image:** `${ECR_REGISTRY}/23blocks-api:latest`

### 2. Database Seed Data (BLOCKING)

| File | Status | Description |
|------|--------|-------------|
| `docker/db/seeds/base.sql` | TEMPLATE ONLY | Minimal data for Tier 2 |
| `docker/db/seeds/full.sql` | TEMPLATE ONLY | Full data for Tier 3 |

**Required seed data:**
- [ ] Test user: `seeded-user@example.com` / `TestPassword123!`
- [ ] Test app: `test-app-id`
- [ ] Sample products, contacts, content for search tests
- [ ] Data for all 18 SDK blocks

### 3. GitHub Secrets (BLOCKING)

| Secret/Variable | Status | Purpose |
|-----------------|--------|---------|
| `AWS_ACCESS_KEY_ID` | NOT SET | ECR authentication |
| `AWS_SECRET_ACCESS_KEY` | NOT SET | ECR authentication |
| `API_IMAGE` (variable) | NOT SET | Docker image name |
| `API_VERSION` (variable) | NOT SET | Image tag |
| `AWS_REGION` (variable) | NOT SET | AWS region |

### 4. Pending Test Implementation

| Item | Status | Priority |
|------|--------|----------|
| Consumer test apps (Angular/React/Node) | NOT STARTED | Medium |
| Integration tests for remaining 16 blocks | NOT STARTED | Medium |
| Workflow tests (Tier 3) | NOT STARTED | Low |

---

## Executive Summary

This document defines the testing strategy for the 23blocks SDK. The goal is to **catch bugs before they reach npm** and **protect our reputation** by ensuring every release is thoroughly validated.

Our approach uses a **tiered testing system** with **operator-controlled gates**, allowing fast iteration for small changes while ensuring comprehensive testing for major releases.

---

## Table of Contents

1. [CRITICAL: Prerequisites](#critical-prerequisites-before-integration-tests-work)
2. [Problem Statement](#problem-statement)
3. [Testing Philosophy](#testing-philosophy)
4. [Tiered Testing Architecture](#tiered-testing-architecture)
5. [Infrastructure Components](#infrastructure-components)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Test Categories](#test-categories)
8. [Docker API Environment](#docker-api-environment)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Appendix](#appendix)

---

## Problem Statement

### Current Pain Points

1. **No automated tests** - The SDK has zero test files despite having Vitest configured
2. **Expensive feedback loop** - Deploy → Customer finds bug → Fix → Redeploy
3. **Reputation risk** - Broken releases damage customer trust
4. **No safety net** - TypeScript compilation is the only validation

### Goals

- **Catch 95%+ of bugs** before npm publish
- **Fast feedback** for small changes (< 3 minutes)
- **Comprehensive validation** for releases (< 30 minutes)
- **Real API testing** - No mocks, test against actual 23blocks API
- **Operator control** - Humans decide when to run full tests or release

---

## Testing Philosophy

### Guiding Principles

1. **Real > Mock** - Test against the actual API, not simulated responses
2. **Fast by default** - Quick tests run always, heavy tests run on demand
3. **Operator in control** - Automated gates with human override capability
4. **Fail fast, fail loudly** - Block releases on test failures
5. **Test what matters** - Focus on customer-facing functionality

### Industry Inspiration

| Company | Approach | What We Adopt |
|---------|----------|---------------|
| **Stripe** | [stripe-mock](https://github.com/stripe/stripe-mock) from OpenAPI | Real API > mocks |
| **Firebase** | [Local Emulator Suite](https://firebase.google.com/docs/emulator-suite) | Docker-based testing |
| **AWS** | LocalStack, service emulators | Containerized infrastructure |

---

## Tiered Testing Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   TIER 1: FAST                          TIER 2: STANDARD                    │
│   ══════════════                        ══════════════════                  │
│   • Unit tests                          • Tier 1 +                          │
│   • TypeScript compilation              • Docker API integration            │
│   • Lint checks                         • Basic CRUD per block              │
│   • Build verification                  • Consumer app smoke tests          │
│                                                                             │
│   ⏱️  2-3 minutes                        ⏱️  8-12 minutes                    │
│   🔄 Every PR/commit                    🔄 Every merge to main              │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   TIER 3: FULL                                                              │
│   ════════════                                                              │
│   • Tier 1 + Tier 2 +                                                       │
│   • Comprehensive CRUD (all blocks)                                         │
│   • Complex workflows (multi-block scenarios)                               │
│   • Edge cases and error scenarios                                          │
│   • Performance benchmarks                                                  │
│   • Full consumer app E2E tests                                             │
│                                                                             │
│   ⏱️  20-30 minutes                                                          │
│   🔄 Operator-triggered OR pre-release                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tier Details

#### Tier 1: Fast (Always Runs)

**Purpose:** Catch obvious errors immediately

| Test Type | What It Validates |
|-----------|-------------------|
| Unit tests | Mappers, utilities, pure functions |
| TypeScript | Type errors, missing exports |
| Lint | Code quality, style consistency |
| Build | Package compilation succeeds |

**Trigger:** Every push, every PR

**Failure Action:** Block PR merge

---

#### Tier 2: Standard (Default for Main)

**Purpose:** Validate SDK works against real API

| Test Type | What It Validates |
|-----------|-------------------|
| Integration | CRUD operations per block |
| Consumer smoke | Angular/React/Node apps can import and build |
| API contract | Requests/responses match expected format |

**Trigger:** Every merge to `main`

**Failure Action:** Alert team, block release

---

#### Tier 3: Full (On-Demand)

**Purpose:** Comprehensive validation before major releases

| Test Type | What It Validates |
|-----------|-------------------|
| Workflows | Multi-block scenarios (auth → create → search → delete) |
| Edge cases | Error handling, timeouts, retries |
| Performance | Response times, memory usage |
| E2E | Full user journeys in consumer apps |

**Trigger:**
- Manual operator trigger
- Auto-triggered for major version bumps
- Auto-triggered when core packages change (transport, codec)

**Failure Action:** Block release, require fix

---

## Infrastructure Components

### Directory Structure

```
sdk/
├── packages/                      # Existing SDK packages
│
├── tests/
│   ├── unit/                      # TIER 1: Fast tests
│   │   ├── mappers/
│   │   │   ├── auth.mapper.spec.ts
│   │   │   ├── search.mapper.spec.ts
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── pagination.spec.ts
│   │   └── setup.ts               # Vitest setup for unit tests
│   │
│   ├── integration/               # TIER 2 & 3: Docker API tests
│   │   ├── setup/
│   │   │   ├── global-setup.ts    # Start Docker before tests
│   │   │   ├── global-teardown.ts # Stop Docker after tests
│   │   │   ├── wait-for-api.ts    # Health check utility
│   │   │   └── test-client.ts     # Shared test transport
│   │   ├── blocks/
│   │   │   ├── auth.integration.spec.ts
│   │   │   ├── search.integration.spec.ts
│   │   │   ├── crm.integration.spec.ts
│   │   │   ├── products.integration.spec.ts
│   │   │   └── ... (all 18 blocks)
│   │   └── workflows/             # TIER 3 only
│   │       ├── user-journey.spec.ts
│   │       ├── content-lifecycle.spec.ts
│   │       └── multi-tenant.spec.ts
│   │
│   ├── consumers/                 # Consumer app integration
│   │   ├── angular-app/           # Minimal Angular 17+ app
│   │   │   ├── src/
│   │   │   ├── package.json
│   │   │   └── test.sh
│   │   ├── react-app/             # Minimal React 18+ app
│   │   │   ├── src/
│   │   │   ├── package.json
│   │   │   └── test.sh
│   │   └── node-app/              # Minimal Node.js app
│   │       ├── src/
│   │       ├── package.json
│   │       └── test.sh
│   │
│   └── fixtures/                  # Shared test data definitions
│       ├── users.ts
│       ├── products.ts
│       └── index.ts
│
├── docker/
│   ├── docker-compose.yml         # Main compose file
│   ├── docker-compose.ci.yml      # CI-specific overrides
│   └── db/
│       ├── schema.sql             # Database schema
│       └── seeds/
│           ├── base.sql           # Minimal data (Tier 2)
│           └── full.sql           # Complete data (Tier 3)
│
├── .github/
│   └── workflows/
│       ├── pr-checks.yml          # Tier 1 on PRs
│       ├── merge-tests.yml        # Tier 2 on merge
│       ├── full-tests.yml         # Tier 3 manual
│       └── release.yml            # Publish after gate
│
└── vitest.config.ts               # Test configuration
```

---

## CI/CD Pipeline

### Pipeline Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  PR Created/Updated                                                          │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────────┐                                                        │
│  │   TIER 1: FAST  │ ◄── Runs automatically                                 │
│  │   ~3 minutes    │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│       ✅ Pass? ───No───▶ ❌ Block merge                                     │
│           │                                                                  │
│          Yes                                                                 │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────┐                    │
│  │              PR APPROVED & MERGED                   │                    │
│  └────────┬────────────────────────────────────────────┘                    │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────┐                                                        │
│  │ TIER 2: STANDARD│ ◄── Runs automatically                                 │
│  │   ~10 minutes   │                                                        │
│  └────────┬────────┘                                                        │
│           │                                                                  │
│           ▼                                                                  │
│       ✅ Pass? ───No───▶ ⚠️ Alert team, block release                       │
│           │                                                                  │
│          Yes                                                                 │
│           │                                                                  │
│           ▼                                                                  │
│  ┌─────────────────────────────────────────────────────┐                    │
│  │           🚦 OPERATOR DECISION GATE                 │                    │
│  │                                                     │                    │
│  │  Auto-detect: Is this a major change?              │                    │
│  │  ┌─────────────────────────────────────────────┐   │                    │
│  │  │ • Major version bump?         → Full tests  │   │                    │
│  │  │ • Core package changed?       → Full tests  │   │                    │
│  │  │ • [full-test] in commit?      → Full tests  │   │                    │
│  │  │ • Multiple blocks changed?    → Full tests  │   │                    │
│  │  │ • Otherwise                   → Auto-release│   │                    │
│  │  └─────────────────────────────────────────────┘   │                    │
│  │                                                     │                    │
│  │  Manual override available:                         │                    │
│  │  [🚀 Release Now]  [🧪 Run Full Tests]  [⏸️ Hold]  │                    │
│  │                                                     │                    │
│  └──────────────────────┬──────────────────────────────┘                    │
│                         │                                                    │
│           ┌─────────────┼─────────────┐                                     │
│           │             │             │                                     │
│           ▼             ▼             ▼                                     │
│     Auto-release   Full tests    Wait for                                   │
│           │             │         operator                                  │
│           │             ▼                                                   │
│           │      ┌──────────┐                                               │
│           │      │ TIER 3:  │                                               │
│           │      │  FULL    │                                               │
│           │      │~25 mins  │                                               │
│           │      └────┬─────┘                                               │
│           │           │                                                     │
│           │           ▼                                                     │
│           │       ✅ Pass? ───No───▶ ❌ Block, fix required                 │
│           │           │                                                     │
│           │          Yes                                                    │
│           │           │                                                     │
│           ▼           ▼                                                     │
│  ┌─────────────────────────────────────────────────────┐                    │
│  │              📦 PUBLISH TO NPM                      │                    │
│  │                                                     │                    │
│  │  • nx release (version, changelog, tags)           │                    │
│  │  • npm publish --provenance (OIDC auth)            │                    │
│  │  • GitHub release created                          │                    │
│  └─────────────────────────────────────────────────────┘                    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Workflow Files

#### PR Checks (Tier 1)

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks (Tier 1)

on:
  pull_request:
    branches: [main]

jobs:
  tier1:
    name: "Fast Tests"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build packages
        run: npm run build

      - name: Run unit tests
        run: npm run test:unit

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck
```

#### Merge Tests (Tier 2)

```yaml
# .github/workflows/merge-tests.yml
name: Merge Tests (Tier 2)

on:
  push:
    branches: [main]

env:
  API_IMAGE: ${{ secrets.ECR_REGISTRY }}/23blocks-api
  API_VERSION: latest

jobs:
  tier1:
    name: "Tier 1: Fast Tests"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npm run test:unit
      - run: npm run lint

  tier2:
    name: "Tier 2: Integration Tests"
    needs: tier1
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Start API environment
        run: |
          docker-compose -f docker/docker-compose.yml up -d
          npm run test:wait-for-api

      - run: npm ci
      - run: npm run build
      - run: npm run test:integration

      - name: Test consumer apps
        run: npm run test:consumers

      - name: Cleanup
        if: always()
        run: docker-compose -f docker/docker-compose.yml down -v

  analyze-and-gate:
    name: "🚦 Release Gate"
    needs: [tier1, tier2]
    runs-on: ubuntu-latest
    outputs:
      should_run_full: ${{ steps.analyze.outputs.should_run_full }}
      auto_release: ${{ steps.analyze.outputs.auto_release }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Analyze changes
        id: analyze
        run: |
          # Get changed files
          CHANGED=$(git diff --name-only HEAD~1)

          # Check for major change indicators
          MAJOR_CHANGE=false

          # Core packages changed?
          if echo "$CHANGED" | grep -q "packages/transport-http\|packages/jsonapi-codec\|packages/contracts"; then
            echo "Core package changed - requires full tests"
            MAJOR_CHANGE=true
          fi

          # Multiple blocks changed?
          BLOCK_COUNT=$(echo "$CHANGED" | grep -c "packages/block-" || true)
          if [ "$BLOCK_COUNT" -gt 3 ]; then
            echo "$BLOCK_COUNT blocks changed - requires full tests"
            MAJOR_CHANGE=true
          fi

          # Commit message contains [full-test]?
          if git log -1 --pretty=%B | grep -q "\[full-test\]"; then
            echo "Commit message requests full tests"
            MAJOR_CHANGE=true
          fi

          # Check for version bump
          if git log -1 --pretty=%B | grep -q "BREAKING CHANGE\|feat!:"; then
            echo "Breaking change detected - requires full tests"
            MAJOR_CHANGE=true
          fi

          echo "should_run_full=$MAJOR_CHANGE" >> $GITHUB_OUTPUT
          echo "auto_release=$([[ $MAJOR_CHANGE == false ]] && echo true || echo false)" >> $GITHUB_OUTPUT

  tier3:
    name: "Tier 3: Full Tests"
    needs: analyze-and-gate
    if: needs.analyze-and-gate.outputs.should_run_full == 'true'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Start API with full seed data
        env:
          SEED_LEVEL: full
        run: |
          docker-compose -f docker/docker-compose.yml up -d
          npm run test:wait-for-api

      - run: npm ci
      - run: npm run build
      - run: npm run test:integration
      - run: npm run test:workflows
      - run: npm run test:consumers:full

      - name: Cleanup
        if: always()
        run: docker-compose -f docker/docker-compose.yml down -v

  release:
    name: "📦 Release"
    needs: [analyze-and-gate, tier3]
    if: |
      always() &&
      needs.analyze-and-gate.result == 'success' &&
      (needs.tier3.result == 'success' || needs.tier3.result == 'skipped')
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GITHUB_TOKEN }}

      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }

      - run: npm ci
      - run: npm run build

      - name: Release
        run: npx nx release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Publish to npm
        run: |
          for pkg in packages/*/; do
            if [ -f "$pkg/package.json" ]; then
              npm publish "$pkg" --access public --provenance || true
            fi
          done
```

#### Manual Full Tests (Tier 3)

```yaml
# .github/workflows/full-tests.yml
name: Full Tests (Tier 3) - Manual

on:
  workflow_dispatch:
    inputs:
      reason:
        description: 'Reason for running full tests'
        required: true
        type: string
      release_after:
        description: 'Release to npm after tests pass?'
        required: true
        type: boolean
        default: false

jobs:
  full-tests:
    name: "🧪 Full Test Suite"
    runs-on: ubuntu-latest
    steps:
      - name: Log reason
        run: echo "Running full tests - Reason: ${{ inputs.reason }}"

      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }

      - name: Login to ECR
        uses: aws-actions/amazon-ecr-login@v2

      - name: Start full API environment
        env:
          SEED_LEVEL: full
        run: |
          docker-compose -f docker/docker-compose.yml up -d
          npm run test:wait-for-api

      - run: npm ci
      - run: npm run build
      - run: npm run test:unit
      - run: npm run test:integration
      - run: npm run test:workflows
      - run: npm run test:consumers:full

      - name: Cleanup
        if: always()
        run: docker-compose -f docker/docker-compose.yml down -v

  release:
    name: "📦 Release"
    needs: full-tests
    if: inputs.release_after
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - run: npx nx release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - run: npm publish --provenance
```

---

## Test Categories

### Unit Tests (Tier 1)

**Location:** `tests/unit/`

**Purpose:** Test pure functions without network

```typescript
// tests/unit/mappers/auth.mapper.spec.ts
import { describe, it, expect } from 'vitest';
import { mapUserResponse } from '@23blocks/block-authentication';

describe('Auth Mappers', () => {
  describe('mapUserResponse', () => {
    it('should map JSON:API user response to domain object', () => {
      const jsonApiResponse = {
        data: {
          id: '123',
          type: 'users',
          attributes: {
            email: 'test@example.com',
            'first-name': 'John',
            'last-name': 'Doe',
            'created-at': '2024-01-01T00:00:00Z',
          },
        },
      };

      const result = mapUserResponse(jsonApiResponse);

      expect(result).toEqual({
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should handle missing optional fields', () => {
      const jsonApiResponse = {
        data: {
          id: '123',
          type: 'users',
          attributes: {
            email: 'test@example.com',
          },
        },
      };

      const result = mapUserResponse(jsonApiResponse);

      expect(result.id).toBe('123');
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBeUndefined();
    });
  });
});
```

---

### Integration Tests (Tier 2)

**Location:** `tests/integration/blocks/`

**Purpose:** Test SDK against real Docker API

```typescript
// tests/integration/blocks/auth.integration.spec.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { getTestTransport, getTestConfig } from '../setup/test-client';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

describe('Authentication Block', () => {
  const transport = getTestTransport();
  const auth = createAuthenticationBlock(transport, getTestConfig('authentication'));

  describe('Registration', () => {
    it('should register a new user', async () => {
      const email = `test-${Date.now()}@example.com`;

      const result = await auth.registration.signUp({
        email,
        password: 'SecurePassword123!',
        firstName: 'Test',
        lastName: 'User',
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(email);
      expect(result.user.id).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await expect(
        auth.registration.signUp({
          email: 'existing@example.com', // From seed data
          password: 'Password123!',
        })
      ).rejects.toThrow(/already registered|duplicate/i);
    });
  });

  describe('Authentication', () => {
    it('should sign in with valid credentials', async () => {
      const result = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('seeded-user@example.com');
    });

    it('should reject invalid password', async () => {
      await expect(
        auth.auth.signIn({
          email: 'seeded-user@example.com',
          password: 'wrong-password',
        })
      ).rejects.toThrow(/invalid|unauthorized/i);
    });

    it('should sign out successfully', async () => {
      // First sign in
      const session = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      // Then sign out
      await expect(auth.auth.signOut()).resolves.not.toThrow();
    });
  });

  describe('Token Management', () => {
    it('should refresh access token', async () => {
      const session = await auth.auth.signIn({
        email: 'seeded-user@example.com',
        password: 'TestPassword123!',
      });

      const refreshed = await auth.tokens.refresh({
        refreshToken: session.refreshToken,
      });

      expect(refreshed.accessToken).toBeDefined();
      expect(refreshed.accessToken).not.toBe(session.accessToken);
    });
  });
});
```

---

### Workflow Tests (Tier 3)

**Location:** `tests/integration/workflows/`

**Purpose:** Test complex multi-block scenarios

```typescript
// tests/integration/workflows/user-journey.spec.ts
import { describe, it, expect } from 'vitest';
import { getTestTransport, getTestConfig } from '../setup/test-client';
import { createAuthenticationBlock } from '@23blocks/block-authentication';
import { createSearchBlock } from '@23blocks/block-search';
import { createCrmBlock } from '@23blocks/block-crm';

describe('User Journey Workflow', () => {
  const transport = getTestTransport();
  const auth = createAuthenticationBlock(transport, getTestConfig('authentication'));
  const search = createSearchBlock(transport, getTestConfig('search'));
  const crm = createCrmBlock(transport, getTestConfig('crm'));

  it('should complete full user lifecycle', async () => {
    // 1. Register new user
    const email = `journey-${Date.now()}@example.com`;
    const registration = await auth.registration.signUp({
      email,
      password: 'JourneyTest123!',
      firstName: 'Journey',
      lastName: 'Test',
    });
    expect(registration.user.id).toBeDefined();
    const userId = registration.user.id;

    // 2. Sign in
    const session = await auth.auth.signIn({
      email,
      password: 'JourneyTest123!',
    });
    expect(session.accessToken).toBeDefined();

    // 3. Create a CRM contact
    const contact = await crm.contacts.create({
      firstName: 'Journey',
      lastName: 'Contact',
      email: 'contact@example.com',
    });
    expect(contact.id).toBeDefined();

    // 4. Search for the contact
    const searchResults = await search.search.search({
      query: 'Journey Contact',
    });
    expect(searchResults.results.length).toBeGreaterThan(0);

    // 5. Update user profile
    await auth.profile.update({
      firstName: 'Updated Journey',
    });

    // 6. Verify update
    const profile = await auth.profile.get();
    expect(profile.firstName).toBe('Updated Journey');

    // 7. Clean up - delete contact
    await crm.contacts.delete(contact.id);

    // 8. Sign out
    await auth.auth.signOut();
  });

  it('should handle concurrent operations', async () => {
    const session = await auth.auth.signIn({
      email: 'seeded-user@example.com',
      password: 'TestPassword123!',
    });

    // Run multiple operations concurrently
    const results = await Promise.all([
      search.search.search({ query: 'test' }),
      crm.contacts.list({ page: 1, perPage: 10 }),
      auth.profile.get(),
    ]);

    expect(results[0].results).toBeDefined();
    expect(results[1].data).toBeDefined();
    expect(results[2].email).toBeDefined();
  });
});
```

---

### Consumer App Tests

**Location:** `tests/consumers/`

**Purpose:** Verify SDK works in real framework contexts

```typescript
// tests/consumers/angular-app/src/app/app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { AuthService } from '@23blocks/angular';
import { AppComponent } from './app.component';

describe('Angular Consumer App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        // Configure 23blocks providers
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have AuthService injected', () => {
    const authService = TestBed.inject(AuthService);
    expect(authService).toBeTruthy();
  });
});
```

---

## Docker API Environment

### Docker Compose Configuration

```yaml
# docker/docker-compose.yml
version: '3.8'

services:
  api:
    image: ${API_IMAGE:-23blocks/api}:${API_VERSION:-latest}
    ports:
      - "3000:3000"
    environment:
      - RAILS_ENV=test
      - DATABASE_URL=postgres://postgres:postgres@db:5432/blocks_test
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY_BASE=test-secret-key-for-ci-testing-only
      - APP_ID=test-app-id
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 5s
      timeout: 5s
      retries: 20
      start_period: 30s

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: blocks_test
    volumes:
      - ./db/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./db/seeds/${SEED_LEVEL:-base}.sql:/docker-entrypoint-initdb.d/02-seeds.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### Seed Data Structure

```sql
-- docker/db/seeds/base.sql (Tier 2 - minimal data)

-- Test users
INSERT INTO users (id, email, encrypted_password, first_name, last_name, created_at, updated_at)
VALUES
  ('user-001', 'seeded-user@example.com', '$2a$12$...', 'Seeded', 'User', NOW(), NOW()),
  ('user-002', 'existing@example.com', '$2a$12$...', 'Existing', 'User', NOW(), NOW());

-- Test app
INSERT INTO apps (id, name, app_id, created_at, updated_at)
VALUES
  ('app-001', 'Test App', 'test-app-id', NOW(), NOW());
```

```sql
-- docker/db/seeds/full.sql (Tier 3 - comprehensive data)

-- Include base data
\i /docker-entrypoint-initdb.d/seeds/base.sql

-- Additional users for workflow tests
INSERT INTO users (id, email, encrypted_password, first_name, last_name, created_at, updated_at)
VALUES
  ('user-003', 'workflow-user-1@example.com', '$2a$12$...', 'Workflow', 'One', NOW(), NOW()),
  ('user-004', 'workflow-user-2@example.com', '$2a$12$...', 'Workflow', 'Two', NOW(), NOW()),
  -- ... more users for concurrent tests
  ;

-- Products for search tests
INSERT INTO products (id, name, description, price, created_at, updated_at)
VALUES
  ('prod-001', 'Test Product One', 'Description for search', 99.99, NOW(), NOW()),
  ('prod-002', 'Test Product Two', 'Another searchable item', 149.99, NOW(), NOW()),
  -- ... more products
  ;

-- CRM contacts
INSERT INTO contacts (id, first_name, last_name, email, created_at, updated_at)
VALUES
  ('contact-001', 'John', 'Doe', 'john@example.com', NOW(), NOW()),
  ('contact-002', 'Jane', 'Smith', 'jane@example.com', NOW(), NOW()),
  -- ... more contacts
  ;

-- Search index entries
-- ... etc
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1)

| Task | Description | Priority |
|------|-------------|----------|
| Create test directory structure | Set up `tests/` folder hierarchy | High |
| Configure Vitest | Create `vitest.config.ts` with workspaces | High |
| Add npm scripts | `test:unit`, `test:integration`, etc. | High |
| Write first unit tests | Mapper tests for auth block | High |
| Create Docker compose | Basic API + DB + Redis setup | High |

### Phase 2: Integration Tests (Week 2)

| Task | Description | Priority |
|------|-------------|----------|
| Test client setup | Shared transport configuration | High |
| Wait-for-API utility | Health check before tests | High |
| Auth block tests | Full CRUD integration tests | High |
| Search block tests | Basic search integration | High |
| CRM block tests | Contact CRUD | Medium |

### Phase 3: CI/CD (Week 3)

| Task | Description | Priority |
|------|-------------|----------|
| PR checks workflow | Tier 1 on every PR | High |
| Merge tests workflow | Tier 2 with Docker | High |
| Manual full tests | Tier 3 workflow dispatch | Medium |
| Release gate | Operator decision point | Medium |

### Phase 4: Consumer Apps (Week 4)

| Task | Description | Priority |
|------|-------------|----------|
| Angular test app | Minimal app with SDK | Medium |
| React test app | Minimal app with SDK | Medium |
| Node test app | Minimal Node.js consumer | Medium |
| Consumer test scripts | Build and smoke test | Medium |

### Phase 5: Expansion (Ongoing)

| Task | Description | Priority |
|------|-------------|----------|
| All block tests | Integration tests for all 18 blocks | Medium |
| Workflow tests | Complex multi-block scenarios | Medium |
| Performance benchmarks | Response time tracking | Low |
| Documentation | Update CLAUDE.md with test commands | Low |

---

## Appendix

### NPM Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "vitest run --project unit",
    "test:integration": "vitest run --project integration",
    "test:workflows": "vitest run --project workflows",
    "test:consumers": "npm run test:consumers:angular && npm run test:consumers:react && npm run test:consumers:node",
    "test:consumers:angular": "cd tests/consumers/angular-app && npm test",
    "test:consumers:react": "cd tests/consumers/react-app && npm test",
    "test:consumers:node": "cd tests/consumers/node-app && npm test",
    "test:consumers:full": "npm run test:consumers -- --full",
    "test:wait-for-api": "node tests/integration/setup/wait-for-api.js",
    "test:watch": "vitest --project unit",
    "docker:up": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:down": "docker-compose -f docker/docker-compose.yml down -v",
    "docker:logs": "docker-compose -f docker/docker-compose.yml logs -f"
  }
}
```

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    workspace: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.spec.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: ['tests/integration/blocks/**/*.spec.ts'],
          environment: 'node',
          globalSetup: './tests/integration/setup/global-setup.ts',
          globalTeardown: './tests/integration/setup/global-teardown.ts',
          testTimeout: 30000,
        },
      },
      {
        extends: true,
        test: {
          name: 'workflows',
          include: ['tests/integration/workflows/**/*.spec.ts'],
          environment: 'node',
          globalSetup: './tests/integration/setup/global-setup.ts',
          globalTeardown: './tests/integration/setup/global-teardown.ts',
          testTimeout: 60000,
        },
      },
    ],
  },
});
```

### Environment Variables

```bash
# .env.test (for local development)
API_URL=http://localhost:3000
API_IMAGE=23blocks/api
API_VERSION=latest
SEED_LEVEL=base
TEST_APP_ID=test-app-id
```

### Required Secrets (GitHub)

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | For ECR login |
| `AWS_SECRET_ACCESS_KEY` | For ECR login |
| `ECR_REGISTRY` | e.g., `123456789.dkr.ecr.us-east-1.amazonaws.com` |
| `GITHUB_TOKEN` | Auto-provided by GitHub |

---

## References

- [WireMock - Mocking vs Integration Testing](https://www.wiremock.io/post/mocking-vs-integration-testing)
- [Stripe Mock Server](https://github.com/stripe/stripe-mock)
- [Firebase Local Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Vitest Documentation](https://vitest.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | 23blocks Team | Initial version |
