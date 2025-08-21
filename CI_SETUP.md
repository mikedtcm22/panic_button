# CI/CD Setup Documentation

## Overview

This project uses GitHub Actions for continuous integration and deployment. The
CI pipeline ensures code quality, type safety, and test coverage across all
changes.

## Workflows

### 1. Main CI Workflow (`ci.yml`)

Runs on:

- Pushes to `main` branch
- Pull requests to `main` branch
- Manual trigger (workflow_dispatch)

#### Jobs:

**Lint**

- Runs ESLint on all TypeScript/JavaScript files
- Checks code formatting with Prettier
- Ensures consistent code style

**Type Check**

- Verifies TypeScript compilation
- Generates Prisma client
- Ensures type safety across the codebase

**Test**

- Runs Jest test suite with coverage
- Uses test sharding for parallel execution (3 shards)
- Uploads coverage reports to Codecov
- All tests run in mock mode with test database

**Build**

- Verifies Next.js production build
- Generates Prisma client
- Reports bundle sizes for monitoring

**Security**

- Runs npm audit for vulnerability scanning
- Dependency check for known security issues
- Fails on high-severity vulnerabilities

**Lighthouse**

- Performance testing with Lighthouse CI
- Measures Core Web Vitals
- Monitors bundle size and performance metrics

### 2. PR Checks Workflow (`pr-checks.yml`)

Additional checks specifically for pull requests:

**Label Size**

- Automatically labels PRs based on size (xs/s/m/l/xl)
- Helps reviewers prioritize review efforts

**Check Conflicts**

- Detects and labels merge conflicts
- Comments on PR when conflicts exist

**Verify Files**

- Ensures package-lock.json is updated with package.json
- Warns about Prisma schema changes
- Alerts on environment variable modifications

**Test Coverage Delta**

- Runs tests and generates coverage report
- Comments coverage changes on PR
- Shows lines covered/uncovered

**Bundle Analysis**

- Analyzes bundle size changes
- Uploads detailed bundle analysis
- Comments size impact on PR

**Dependency Review**

- Reviews new dependencies for security/licenses
- Fails on high-severity issues
- Allows only approved licenses (MIT, Apache-2.0, BSD)

**PR Title Check**

- Enforces conventional commit format
- Ensures consistent PR titles for changelog generation

## Local Development

### Prerequisites

- Node.js 20 (use `.nvmrc` with nvm)
- npm 10+

### Setup

```bash
# Install Node version
nvm use

# Install dependencies
npm install

# Run all CI checks locally
npm run ci
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:ci         # Run tests in CI mode

# Code Quality
npm run type-check      # TypeScript type checking
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting

# Combined
npm run ci              # Run all CI checks locally
```

## Environment Variables for CI

The CI environment uses mock mode with the following test variables:

```env
DATABASE_URL=file:./test.db
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_mock
CLERK_SECRET_KEY=sk_test_mock
OPENAI_API_KEY=sk-mock-key
CLOUDFLARE_R2_ACCESS_KEY_ID=mock-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=mock-secret-key
CLOUDFLARE_R2_BUCKET_NAME=mock-bucket
CLOUDFLARE_R2_ACCOUNT_ID=mock-account-id
CLOUDFLARE_R2_REGION=auto
PINECONE_API_KEY=mock-pinecone-key
PINECONE_INDEX_NAME=mock-index
PINECONE_NAMESPACE=mock-namespace
PADDLE_VENDOR_ID=mock-vendor-id
PADDLE_API_KEY=mock-api-key
PADDLE_PUBLIC_KEY=mock-public-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## GitHub Secrets

For production deployments, configure these secrets in GitHub:

- `CODECOV_TOKEN` - For coverage reporting (optional)
- Production API keys (when ready for deployment)

## Testing CI Locally

You can test GitHub Actions workflows locally using
[act](https://github.com/nektos/act):

```bash
# Install act
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash  # Linux

# Run CI workflow
act push -W .github/workflows/ci.yml

# Run specific job
act push -W .github/workflows/ci.yml -j test

# Run with secrets
act push -W .github/workflows/ci.yml --secret-file .env.local
```

## Troubleshooting

### Common Issues

1. **ESLint errors**: Run `npm run lint:fix` to auto-fix
2. **Type errors**: Run `npm run type-check` to see details
3. **Test failures**: Run `npm run test:watch` for debugging
4. **Build failures**: Check for missing environment variables

### CI Badge

Add to your README:

```markdown
[![CI](https://github.com/mikedtcm22/panic_button/actions/workflows/ci.yml/badge.svg)](https://github.com/mikedtcm22/panic_button/actions/workflows/ci.yml)
```

## Best Practices

1. **Always run `npm run ci` before pushing**
2. **Keep PRs small** - Aim for S or M size labels
3. **Write tests** - Maintain >80% coverage
4. **Use conventional commits** - For automatic versioning
5. **Fix security issues immediately** - Don't ignore audit warnings

## Maintenance

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Audit and fix vulnerabilities
npm audit
npm audit fix
```

### Monitoring

- Check GitHub Actions tab for workflow runs
- Review Codecov for coverage trends
- Monitor bundle size in PR comments
- Track Lighthouse scores over time

## Contributing

1. Create feature branch from `main`
2. Make changes following TDD methodology
3. Ensure `npm run ci` passes
4. Create PR with descriptive title
5. Wait for CI checks to pass
6. Request review

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
