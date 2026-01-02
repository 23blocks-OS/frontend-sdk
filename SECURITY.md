# Security Policy

## Reporting a Vulnerability

We take security seriously at 23blocks. If you discover a security vulnerability in the SDK, please report it responsibly.

### How to Report

**Please DO NOT open a public GitHub issue for security vulnerabilities.**

Instead, report vulnerabilities via email:

**Email:** security@23blocks.com

Include the following in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### What to Expect

| Timeframe | Action |
|-----------|--------|
| 24 hours | Acknowledgment of your report |
| 72 hours | Initial assessment and severity classification |
| 7 days | Status update with remediation plan |
| 30 days | Fix released (for critical/high severity) |

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Remote code execution, auth bypass | 24-48 hours |
| **High** | Data exposure, privilege escalation | 7 days |
| **Medium** | Limited impact vulnerabilities | 30 days |
| **Low** | Minor issues, hardening | Next release |

## Supported Versions

| Version | Supported |
|---------|-----------|
| 6.x.x | ✅ Active support |
| 5.x.x | ⚠️ Security fixes only |
| < 5.0 | ❌ No longer supported |

We recommend always using the latest version to ensure you have the most recent security patches.

## Security Best Practices

When using the 23blocks SDK:

### API Keys
- Never commit API keys to version control
- Use environment variables for sensitive configuration
- Rotate API keys periodically
- Use different keys for development and production

```typescript
// ✅ Good - use environment variables
const client = create23BlocksClient({
  apiKey: process.env.BLOCKS_API_KEY,
  urls: { authentication: process.env.AUTH_URL },
});

// ❌ Bad - hardcoded keys
const client = create23BlocksClient({
  apiKey: 'sk_live_abc123...',
});
```

### Token Storage
- Use `authMode: 'cookie'` for web apps when possible (more secure)
- If using token mode, prefer `sessionStorage` over `localStorage` for sensitive apps
- Implement proper token refresh logic

```typescript
// More secure cookie-based auth
<Provider
  apiKey={process.env.NEXT_PUBLIC_API_KEY}
  urls={{ authentication: authUrl }}
  authMode="cookie"
/>
```

### HTTPS
- Always use HTTPS URLs in production
- The SDK will warn if you use HTTP in non-development environments

### Debug Mode
- Never enable `debug: true` in production
- Debug logs may expose sensitive request/response data

```typescript
const client = create23BlocksClient({
  // Only enable in development
  debug: process.env.NODE_ENV === 'development',
});
```

## Security Features

The SDK includes built-in security features:

- **Automatic token refresh** - Prevents session expiration issues
- **Request ID tracing** - Helps identify and investigate suspicious activity
- **Sensitive data masking** - Debug logs automatically mask passwords, tokens, and API keys
- **Timeout protection** - Prevents hanging requests
- **Retry with backoff** - Protects against cascading failures

## Acknowledgments

We appreciate security researchers who help keep 23blocks safe. With your permission, we'll acknowledge your contribution in our release notes.

## Contact

- **Security issues:** security@23blocks.com
- **General questions:** hello@23blocks.com
- **GitHub Issues:** For non-security bugs and feature requests
