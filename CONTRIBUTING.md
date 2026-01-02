# Contributing to 23blocks SDK

First off, thank you for considering contributing to 23blocks SDK! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to hello@23blocks.com.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check existing issues to avoid duplicates.

**Great bug reports include:**
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (Node version, framework, OS)
- Code samples or a minimal reproduction repo
- Error messages and stack traces

```markdown
### Bug Report

**Environment:**
- @23blocks/sdk version: X.X.X
- Node.js version: X.X.X
- Framework: React 18 / Angular 16 / etc.
- OS: macOS / Windows / Linux

**Steps to Reproduce:**
1. ...
2. ...

**Expected Behavior:**
...

**Actual Behavior:**
...

**Code Sample:**
```typescript
// Your code here
```
```

### Suggesting Features

We love feature suggestions! Please open an issue with:

- A clear use case
- Why this would benefit other users
- Example API design (if applicable)
- Willingness to contribute (optional but appreciated!)

### Your First Code Contribution

Looking for a good first issue? Check out:

- Issues labeled [`good first issue`](https://github.com/23blocks-OS/frontend-sdk/labels/good%20first%20issue)
- Issues labeled [`help wanted`](https://github.com/23blocks-OS/frontend-sdk/labels/help%20wanted)
- Documentation improvements
- Test coverage improvements

### Pull Requests

We actively welcome pull requests! See the [Pull Request Process](#pull-request-process) below.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0
- Git

### Getting Started

```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/frontend-sdk.git
cd frontend-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test

# Run type checking
npm run typecheck
```

### Project Structure

```
packages/
├── contracts/              # Core types & interfaces
├── jsonapi-codec/          # JSON:API encoder/decoder
├── transport-http/         # HTTP transport layer
├── block-*/                # Feature blocks (auth, search, etc.)
├── angular/                # Angular bindings (RxJS)
├── react/                  # React bindings (hooks)
├── testing/                # Test utilities
└── sdk/                    # Meta-package
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint all packages |
| `npm run typecheck` | Type-check all packages |
| `npm run graph` | Visualize dependency graph |

### Local Testing

See the [Development Guide](DEVELOPMENT.md) for detailed instructions on testing locally with yalc, npm link, or a local registry.

## Pull Request Process

### Before You Start

1. **Check for existing work** - Look for open PRs or issues covering your change
2. **Discuss major changes** - Open an issue first for significant features
3. **Keep PRs focused** - One feature/fix per PR

### Creating a PR

1. **Fork the repo** and create your branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```

2. **Make your changes** following our [coding standards](#coding-standards)

3. **Write/update tests** for your changes

4. **Ensure all checks pass:**
   ```bash
   npm run build
   npm run test
   npm run typecheck
   npm run lint
   ```

5. **Write a clear commit message** following [commit guidelines](#commit-guidelines)

6. **Push and create a PR**

### PR Requirements

- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] New code has test coverage
- [ ] Documentation updated (if applicable)
- [ ] Follows existing code patterns

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release!

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Export types from package entry points

```typescript
// ✅ Good
export interface UserConfig {
  apiKey: string;
  timeout?: number;
}

export function createClient(config: UserConfig): Client {
  // ...
}

// ❌ Avoid
export function createClient(config: any) {
  // ...
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Files | kebab-case | `user-service.ts` |
| Classes | PascalCase | `UserService` |
| Interfaces | PascalCase | `UserConfig` |
| Functions | camelCase | `getCurrentUser` |
| Constants | SCREAMING_SNAKE | `DEFAULT_TIMEOUT` |
| Type parameters | Single uppercase | `T`, `TData` |

### Code Organization

- One class/major export per file
- Group related files in directories
- Use barrel exports (`index.ts`)
- Keep files under 300 lines when possible

### Documentation

- Add JSDoc comments for public APIs
- Include @example tags with usage samples
- Document parameters and return types

```typescript
/**
 * Signs in a user with email and password
 *
 * @param credentials - User credentials
 * @returns Sign-in response with user and tokens
 * @throws {BlockErrorException} If credentials are invalid
 *
 * @example
 * ```typescript
 * const { user, accessToken } = await auth.signIn({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 * ```
 */
async signIn(credentials: SignInRequest): Promise<SignInResponse> {
  // ...
}
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning and changelog generation.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Formatting, no code change | None |
| `refactor` | Code change, no new feature/fix | None |
| `perf` | Performance improvement | Patch |
| `test` | Adding tests | None |
| `chore` | Maintenance | None |

### Scope

Use the package name without `@23blocks/`:
- `auth`, `react`, `angular`, `sdk`, `contracts`, etc.

### Examples

```bash
# Feature
git commit -m "feat(auth): add MFA support"

# Bug fix
git commit -m "fix(react): resolve hook memory leak"

# Breaking change (major version bump)
git commit -m "feat(sdk)!: change client initialization API

BREAKING CHANGE: create23BlocksClient now requires urls object"

# Documentation
git commit -m "docs(readme): add comparison table"
```

## Getting Help

- **Questions:** Open a [Discussion](https://github.com/23blocks-OS/frontend-sdk/discussions)
- **Bugs:** Open an [Issue](https://github.com/23blocks-OS/frontend-sdk/issues)
- **Security:** Email security@23blocks.com (see [SECURITY.md](SECURITY.md))
- **Chat:** Join our community (coming soon)

## Recognition

Contributors are recognized in:
- Release notes
- GitHub contributors page
- Special thanks in documentation (for significant contributions)

---

Thank you for contributing to 23blocks SDK! 🎉
