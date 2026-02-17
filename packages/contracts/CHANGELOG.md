## 2.3.0 (2026-02-17)

### 🚀 Features

- add health() method to all 18 blocks for service connectivity checks ([73514a3](https://github.com/23blocks-OS/frontend-sdk/commit/73514a3))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 2.2.0 (2026-02-08)

### 🚀 Features

- add comprehensive JSDoc documentation and llms.txt for AI agent consumption ([fd97df2](https://github.com/23blocks-OS/frontend-sdk/commit/fd97df2))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 2.1.3 (2026-02-07)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 2.1.2 (2026-02-06)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 2.1.1 (2026-01-20)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 2.1.0 (2026-01-01)

### 🚀 Features

- add SDK developer experience improvements and testing package ([37db5f9](https://github.com/23blocks-OS/frontend-sdk/commit/37db5f9))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 2.0.1 (2025-12-17)

### 🩹 Fixes

- include README documentation in npm packages ([eacb9c1](https://github.com/23blocks-OS/frontend-sdk/commit/eacb9c1))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 2.0.0 (2025-12-17)

### 🚀 Features

- ⚠️  rename appId to apiKey and add test infrastructure ([fb02c62](https://github.com/23blocks-OS/frontend-sdk/commit/fb02c62))

### ⚠️  Breaking Changes

- rename appId to apiKey and add test infrastructure  ([fb02c62](https://github.com/23blocks-OS/frontend-sdk/commit/fb02c62))
  The configuration property 'appId' has been renamed to 'apiKey' across all packages. The HTTP header sent to the API changed from 'appid' to 'api-key'.
  - Rename appId to apiKey in BlockConfig interface
  - Update SDK client, Angular providers, and React context
  - Update all documentation with new apiKey examples
  - Add comprehensive test infrastructure:
    - Vitest workspace configuration (unit/integration/workflows)
    - Docker compose for API testing
    - Unit tests for mappers (32 tests passing)
    - Integration test templates for Auth and Search blocks
    - CI workflows for tiered testing (pr-checks, merge-tests, full-tests)
  - Add BACKLOG.md tracking test prerequisites and pending work
  - Add TEST_SUITE_STRATEGY.md documenting tiered testing approach
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 1.0.4 (2025-12-14)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 1.0.3 (2025-12-14)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 1.0.2 (2025-12-14)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 1.0.1 (2025-12-14)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

# 1.0.0 (2025-12-13)

### 🚀 Features

- ⚠️  add simplified client API with automatic token management ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))

### ⚠️  Breaking Changes

- add simplified client API with automatic token management  ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))
  None - new APIs are additive, existing APIs unchanged
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 0.1.2 (2025-12-13)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 0.1.1 (2025-12-13)

This was a version bump only for @23blocks/contracts to align it with other projects, there were no code changes.

## 0.1.0 (2025-12-13)

### 🚀 Features

- 23blocks SDK initial release ([ab53789](https://github.com/23blocks-OS/frontend-sdk/commit/ab53789))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez