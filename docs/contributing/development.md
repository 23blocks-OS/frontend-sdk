# 23blocks SDK Development Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 10.0.0

## Getting Started

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test
```

## Project Structure

```
packages/
├── contracts/              # Core types & interfaces
├── jsonapi-codec/          # JSON:API v1.0 codec
├── transport-http/         # HTTP transport layer
├── block-authentication/   # Authentication block
├── block-search/           # Search block
├── angular/                # Angular bindings (RxJS)
├── react/                  # React bindings (hooks)
└── sdk/                    # Meta-package
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build all packages |
| `npm run build:affected` | Build only affected packages |
| `npm run test` | Run all tests |
| `npm run test:affected` | Test only affected packages |
| `npm run lint` | Lint all packages |
| `npm run typecheck` | Type-check all packages |
| `npm run clean` | Clean all build artifacts |
| `npm run graph` | Visualize dependency graph |

## Local Testing (Without Publishing to NPM)

### Option 1: yalc (Recommended)

yalc creates a local package registry, simulating a real npm install.

```bash
# Install yalc globally (one-time)
npm install -g yalc

# Build and publish to local yalc store
npm run build
npm run yalc:publish

# In your consumer project:
cd /path/to/your/project

# Add packages from yalc
yalc add @23blocks/contracts
yalc add @23blocks/jsonapi-codec
yalc add @23blocks/transport-http
yalc add @23blocks/block-authentication
yalc add @23blocks/react  # or @23blocks/angular

# Install dependencies
npm install

# When you make changes to the SDK:
cd /path/to/sdk
npm run build
npm run yalc:push  # Updates all linked projects automatically
```

To remove yalc links:
```bash
yalc remove @23blocks/contracts
yalc remove --all  # Remove all yalc packages
```

### Option 2: npm link

```bash
# In SDK root
npm run build

# Link each package
cd packages/contracts && npm link
cd ../jsonapi-codec && npm link
cd ../transport-http && npm link
cd ../block-authentication && npm link
cd ../react && npm link

# In your consumer project
npm link @23blocks/contracts
npm link @23blocks/jsonapi-codec
npm link @23blocks/transport-http
npm link @23blocks/block-authentication
npm link @23blocks/react
```

### Option 3: Local Verdaccio Registry

```bash
# Start local registry (runs on http://localhost:4873)
npm run local-registry

# In another terminal, publish to local registry
npm config set registry http://localhost:4873
npm run build
npx nx release publish --registry http://localhost:4873

# In your consumer project
npm config set registry http://localhost:4873
npm install @23blocks/react

# Reset to npm public registry when done
npm config set registry https://registry.npmjs.org
```

### Option 4: file: Protocol

In your consumer project's package.json:
```json
{
  "dependencies": {
    "@23blocks/contracts": "file:../sdk/packages/contracts",
    "@23blocks/react": "file:../sdk/packages/react"
  }
}
```

## Releasing

### Automatic Release (CI/CD)

Pushing to `main` triggers the release workflow:
1. Builds all packages
2. Runs tests
3. Versions packages based on conventional commits
4. Generates changelogs
5. Publishes to NPM
6. Creates GitHub releases

### Manual Release

```bash
# Dry run to see what would happen
npm run release:dry-run

# Version packages (interactive)
npm run release:version

# Generate changelogs
npm run release:changelog

# Publish to NPM
npm run release:publish
```

### Manual Version Bump

Via GitHub Actions:
1. Go to Actions > "Publish Manual"
2. Select version type (patch/minor/major/prerelease)
3. Optionally add prerelease identifier (alpha, beta, rc)
4. Run workflow

## Conventional Commits

Use conventional commit format for automatic versioning:

```
feat: add new feature       -> minor version bump
fix: fix a bug              -> patch version bump
feat!: breaking change      -> major version bump
chore: maintenance work     -> no version bump
docs: documentation         -> no version bump
```

Examples:
```bash
git commit -m "feat(auth): add MFA support"
git commit -m "fix(search): handle empty results"
git commit -m "feat(react)!: change hook API"
```

## Adding a New Block

1. Generate package:
   ```bash
   npx nx g @nx/js:lib block-{name} --directory=packages/block-{name} --bundler=swc
   ```

2. Update `tsconfig.json` to add project reference

3. Update `tsconfig.base.json` to add path alias

4. Create types, mappers, services following existing patterns

5. Add framework bindings in `@23blocks/angular` and `@23blocks/react`

## Debugging

```bash
# View dependency graph
npm run graph

# Check what would be affected by changes
npx nx affected:apps --plain
npx nx affected:libs --plain

# Run specific package build with verbose output
npx nx build block-authentication --verbose
```

## CI/CD Secrets Required

For GitHub Actions to publish:

| Secret | Description |
|--------|-------------|
| `NPM_TOKEN` | npm access token with publish permissions |
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions |

To create NPM token:
1. Go to npmjs.com > Access Tokens
2. Generate new token (Automation type)
3. Add to GitHub repo: Settings > Secrets > Actions
