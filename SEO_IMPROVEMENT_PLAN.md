# SEO Improvement Plan for 23blocks SDK

A multi-phase plan to improve repository and package discoverability across GitHub, npm, and search engines.

---

## Current State Assessment

### Completed
| Area | Status | Details |
|------|--------|---------|
| README.md | ✅ Done | Badges, comparison tables, feature highlights |
| GitHub Topics | ✅ Done | 18 topics configured |
| npm Keywords | ✅ Done | 22 keywords in @23blocks/sdk |
| CONTRIBUTING.md | ✅ Done | Community guidelines |
| SECURITY.md | ✅ Done | Security policy |
| Description | ✅ Done | Optimized with keywords |

### Gaps Identified
| Area | Status | Issue |
|------|--------|-------|
| GitHub Homepage URL | ❌ Missing | Should link to docs/website |
| GitHub Discussions | ❌ Disabled | Missing community engagement |
| GitHub Wiki | ❌ Unused | Missing searchable documentation |
| GitHub Pages | ❌ Not Set Up | No SEO-indexable docs site |
| Changelog | ⚠️ Partial | Auto-generated, needs polish |
| Social Preview Image | ❌ Missing | No custom og:image for shares |
| Individual Package Keywords | ⚠️ Inconsistent | Not all blocks optimized |

---

## Phase 1: Quick Wins (1-2 hours)

Low-effort, high-impact improvements.

### 1.1 Set GitHub Homepage URL
```bash
gh repo edit --homepage "https://23blocks.com/docs/sdk"
```

### 1.2 Add Social Preview Image
- Create a 1280x640px branded image
- Upload via GitHub Settings > Social Preview
- Include: logo, tagline, key features

### 1.3 Enable GitHub Discussions
```bash
gh repo edit --enable-discussions
```
Categories to create:
- General
- Q&A
- Ideas & Feature Requests
- Show and Tell

### 1.4 Optimize Individual Package Keywords
Ensure all 18 block packages have consistent, SEO-optimized keywords in their package.json.

Priority packages:
- `@23blocks/block-authentication` - add: "oauth", "jwt", "mfa", "login-sdk"
- `@23blocks/react` - add: "react-sdk", "react-baas", "react-hooks-backend"
- `@23blocks/angular` - add: "angular-sdk", "angular-baas", "rxjs-backend"

---

## Phase 2: Content & Documentation (3-5 hours)

Improve searchable content and documentation.

### 2.1 Create GitHub Wiki Pages
- Getting Started
- API Reference Overview
- Migration Guides
- FAQ
- Troubleshooting

### 2.2 Add CHANGELOG.md (Human-Readable)
Create a curated changelog highlighting major features:
```markdown
# Changelog

## [6.1.0] - 2026-01-01
### Added
- Testing package with mock transport and fixtures
- Debug mode for request/response logging

## [6.0.0] - 2025-12-17
### Added
- Request tracing with unique IDs
...
```

### 2.3 Create Examples Directory
```
examples/
├── react-basic/
├── nextjs-app-router/
├── angular-standalone/
└── vanilla-typescript/
```
Each with a README that ranks for "[framework] backend SDK example"

### 2.4 Enhance Docs with SEO Keywords
Update `docs/*.md` files:
- Add frontmatter with title/description
- Include relevant keywords naturally
- Add internal links between docs

---

## Phase 3: GitHub Pages & External SEO (4-6 hours)

Make documentation indexable by Google.

### 3.1 Set Up GitHub Pages Documentation Site
Options:
1. **Docusaurus** (recommended) - Full-featured, great SEO
2. **VitePress** - Lightweight, fast
3. **MkDocs** - Python-based, simple

Structure:
```
docs-site/
├── docs/
│   ├── getting-started.md
│   ├── blocks/
│   │   ├── authentication.md
│   │   ├── products.md
│   │   └── ...
│   ├── frameworks/
│   │   ├── react.md
│   │   ├── angular.md
│   │   └── nextjs.md
│   └── api/
│       └── reference.md
├── blog/
│   └── announcing-v6.md
└── docusaurus.config.js
```

### 3.2 SEO Metadata for Docs Site
- Unique title/description per page
- Open Graph tags
- Twitter cards
- Canonical URLs
- Sitemap.xml
- robots.txt

### 3.3 Structured Data (JSON-LD)
Add SoftwareApplication schema:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "23blocks SDK",
  "codeRepository": "https://github.com/23blocks-OS/frontend-sdk",
  "programmingLanguage": "TypeScript",
  "runtimePlatform": "Node.js"
}
```

---

## Phase 4: Community & Distribution (Ongoing)

Grow visibility through community engagement.

### 4.1 Content Marketing
Write articles on:
- [ ] Dev.to - "Building a SaaS with 23blocks SDK"
- [ ] Medium - "Firebase vs Supabase vs 23blocks: A TypeScript Developer's Perspective"
- [ ] Hashnode - "How We Built a Modular Backend SDK"
- [ ] Reddit (r/typescript, r/reactjs, r/angular)

### 4.2 Package Comparison Positioning
Target keywords:
- "firebase alternative typescript"
- "supabase alternative react"
- "baas sdk typescript"
- "headless backend react"

### 4.3 GitHub Activity Signals
- Regular releases (monthly minimum)
- Meaningful commit messages
- Issue triage and response
- PR review turnaround

### 4.4 Cross-Promotion
- Link from 23blocks.com to SDK repo
- Add SDK link to email signatures
- Include in company social bios
- Mention in API documentation

---

## Phase 5: Analytics & Iteration (Monthly)

Track and improve based on data.

### 5.1 Set Up Tracking
- GitHub Traffic insights (weekly review)
- npm download stats
- Google Search Console (for docs site)
- Plausible/Fathom for docs analytics

### 5.2 Monitor Rankings
Track search position for:
- "typescript backend sdk"
- "react backend as a service"
- "angular baas"
- "modular backend blocks"
- "23blocks"

### 5.3 A/B Test README
Test variations of:
- Headline copy
- Badge arrangement
- CTA placement
- Code example length

---

## Quick Reference: Priority Actions

| Priority | Action | Impact | Effort |
|----------|--------|--------|--------|
| 🔴 High | Set GitHub homepage URL | Medium | 1 min |
| 🔴 High | Enable Discussions | Medium | 5 min |
| 🔴 High | Add social preview image | High | 30 min |
| 🟡 Medium | Optimize block package keywords | Medium | 1 hour |
| 🟡 Medium | Create examples directory | High | 3 hours |
| 🟡 Medium | Set up GitHub Pages docs | High | 4 hours |
| 🟢 Low | Write Dev.to articles | Medium | 2 hours each |
| 🟢 Low | GitHub Wiki | Low | 2 hours |

---

## Resources

- [GitHub SEO Guide 2025](https://www.infrasity.com/blog/github-seo)
- [GitHub Project Visibility Guide](https://www.codemotion.com/magazine/dev-life/github-project/)
- [npm Package Best Practices](https://docs.npmjs.com/creating-a-package-json-file)
- [Docusaurus SEO](https://docusaurus.io/docs/seo)

---

*Last updated: 2026-01-01*
