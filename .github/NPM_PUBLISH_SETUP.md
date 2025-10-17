# NPM Publishing Workflows Setup Guide

## Overview

Your package now has two complementary workflows for publishing to npm:

1. **Automated Release Please Workflow** - Main release process with automatic changelog generation
2. **Manual Publish Workflow** - Emergency deployments or manual version bumps

## Prerequisites

### 1. Create NPM Token

```bash
npm login
npm token create --read-and-write
```

Save the generated token securely.

### 2. Add NPM Token to GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to: `Settings` → `Secrets and variables` → `Actions`
3. Click `New repository secret`
4. Name: `NPM_TOKEN`
5. Value: Paste the npm token from step 1
6. Click `Add secret`

## Workflow 1: Automated Release Please

**File**: `.github/workflows/release-please.yml`

### How It Works

1. Triggers on push to `main` or `prod` branches
2. Uses conventional commits to generate changelog
3. Creates/updates a release PR automatically
4. When the PR is merged, publishes to npm

### Usage

**Step 1**: Use conventional commits in your development:

```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug in filter"
git commit -m "docs: update README"
git commit -m "chore: update dependencies"
```

**Step 2**: Push to main or prod:

```bash
git push origin main
```

**Step 3**: Release Please creates a PR with:
- Updated version in package.json
- Generated CHANGELOG.md
- Git tag

**Step 4**: Review and merge the PR

**Step 5**: Package automatically publishes to npm 🚀

### Conventional Commit Types

- `feat:` - New feature (bumps minor version)
- `fix:` - Bug fix (bumps patch version)
- `docs:` - Documentation only
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test updates
- `chore:` - Build process or auxiliary tool changes

**Breaking Changes**: Add `BREAKING CHANGE:` in commit body to bump major version

## Workflow 2: Manual Publish

**File**: `.github/workflows/npm-publish.yml`

### Trigger Options

#### Option A: Workflow Dispatch (Manual)

1. Go to GitHub Actions tab
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Select version type: `patch`, `minor`, or `major`
5. Click "Run workflow"

This will:
- Run all quality gates
- Publish to npm
- Create a git tag automatically

#### Option B: GitHub Release

1. Go to repository "Releases" page
2. Click "Draft a new release"
3. Choose a tag version (e.g., `v4.1.0`)
4. Fill in release title and description
5. Click "Publish release"

This will trigger the workflow and publish to npm.

## Quality Gates

Both workflows enforce these checks before publishing:

1. ✅ TypeScript compilation (`pnpm run typecheck`)
2. ✅ ESLint validation (`pnpm run lint`)
3. ✅ Test suite (`pnpm run test`)
4. ✅ Build verification
5. ✅ Package creation

If any check fails, the publish is aborted.

## Security Features

- **Provenance Signing**: Release Please workflow uses `--provenance` flag for supply chain security
- **Access Control**: Package configured as public in `publishConfig`
- **Scoped Permissions**: Workflows use minimal required permissions
- **Frozen Lockfile**: Ensures reproducible builds

## Package Configuration

Your `package.json` now includes:

```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}
```

This ensures your scoped package `@mcabreradev/filter` is published as public.

## Recommended Branch Protection

For `prod` branch:

1. Go to `Settings` → `Branches`
2. Add rule for `prod`
3. Enable:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass (select "Code Check" workflow)
   - ✅ Require branches to be up to date before merging

## Testing the Workflows

### Test Without Publishing

You can test the build process locally:

```bash
pnpm install
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

### Dry Run Publish

To verify package contents without publishing:

```bash
pnpm pack
```

This creates a `.tgz` file you can inspect.

## Troubleshooting

### Workflow Fails on Publish Step

**Issue**: `npm publish` fails with authentication error

**Solution**: Verify `NPM_TOKEN` secret is set correctly in GitHub

### Release Please Doesn't Create PR

**Issue**: No PR appears after pushing to main/prod

**Solution**:
- Ensure commits follow conventional commit format
- Check if there are already unreleased changes
- Try manually triggering with workflow_dispatch

### Version Conflict

**Issue**: Version in package.json already exists on npm

**Solution**:
- Use Release Please workflow for automatic version management
- Or manually bump version before running manual workflow

## Version Strategy

- **Patch (4.0.1)**: Bug fixes, small changes
- **Minor (4.1.0)**: New features, non-breaking changes
- **Major (5.0.0)**: Breaking changes

## Monitoring

After publish, verify:

1. Package appears on npm: https://www.npmjs.com/package/@mcabreradev/filter
2. GitHub release is created
3. Git tag is pushed
4. CHANGELOG is updated (Release Please workflow)

## Version 4 Notes

This setup uses `googleapis/release-please-action@v4` which:
- Automatically detects package name from package.json
- No longer requires `package-name` parameter
- Uses simplified configuration
- Supports manifest-based releases for monorepos

## Additional Resources

- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Release Please Action](https://github.com/googleapis/release-please-action)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)

