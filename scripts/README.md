# Build Scripts

This directory contains build and utility scripts for SmartChart Pro.

## Available Scripts

### `npm run check`

**Comprehensive pre-commit check** - Run this before committing!

- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Production build test

### `npm run build`

**Production build** with Prisma client generation

- Attempts to generate Prisma client (gracefully handles Windows permission issues)
- Builds Next.js application for production
- Safe for CI/CD environments

### `npm run build:simple`

**Simple Next.js build** without Prisma generation

- Use when Prisma client is already generated
- Faster build for development testing

### `npm run seed:shifts`

**Seed default shift templates**

- Creates Morning, Day, and Night shifts
- Safe to run multiple times (won't create duplicates)

## CI/CD Compatibility

The build scripts are designed to work reliably in CI/CD environments:

- **Graceful Prisma handling**: If Prisma generation fails (common on Windows), the build continues with the existing client
- **TypeScript exclusions**: Seed files are excluded from TypeScript compilation to avoid build-time issues
- **Comprehensive checking**: The `check` script catches all issues before they reach CI/CD

## Usage Recommendations

**Before committing:**

```bash
npm run check
```

**For CI/CD:**

```bash
npm run build
```

**For local development:**

```bash
npm run build:simple
```
