# Publishing Guide

## Publishing to npm

### Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **npm login**: Run `npm login` and enter your credentials
3. **Verify login**: Run `npm whoami` to confirm you're logged in

### Publishing a Scoped Package Publicly

Since this is a scoped package (`@prmichaelsen/eventbrite-mcp`), you need to explicitly set it as public.

### Steps to Publish

1. **Ensure you're logged in:**
   ```bash
   npm whoami
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Test locally first** (see [`LOCAL-TESTING.md`](./LOCAL-TESTING.md))

4. **Update version** (if needed):
   ```bash
   npm version patch  # 0.1.0 -> 0.1.1
   npm version minor  # 0.1.0 -> 0.2.0
   npm version major  # 0.1.0 -> 1.0.0
   ```

5. **Publish publicly:**
   ```bash
   npm run publish:public
   ```
   
   Or manually:
   ```bash
   npm publish --access public
   ```

### First Time Publishing

If this is your first time publishing this package:

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages to make them publicly accessible.

### Subsequent Publishes

After the first publish, you can use:

```bash
npm publish
```

The access level will be remembered from the first publish.

### Verify Publication

1. **Check npm:**
   ```bash
   npm view @prmichaelsen/eventbrite-mcp
   ```

2. **Visit npm page:**
   https://www.npmjs.com/package/@prmichaelsen/eventbrite-mcp

3. **Test installation:**
   ```bash
   npx @prmichaelsen/eventbrite-mcp
   ```

## Version Management

### Semantic Versioning

Follow [semver](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.0.1): Bug fixes, backwards compatible

### Version Commands

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major

# Pre-release versions
npm version prerelease --preid=beta  # 0.1.0-beta.0
npm version prerelease --preid=alpha # 0.1.0-alpha.0
```

## Publishing Checklist

Before publishing:

- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] README is up to date
- [ ] CHANGELOG is updated (if you have one)
- [ ] Version number is bumped
- [ ] No sensitive data in code (API keys, tokens, etc.)
- [ ] .gitignore is properly configured
- [ ] package.json `files` field includes all necessary files
- [ ] Local testing completed successfully

## Troubleshooting

### "You do not have permission to publish"

Make sure you're logged in:
```bash
npm login
```

### "You cannot publish over the previously published versions"

Version already exists. Bump the version:
```bash
npm version patch
npm publish --access public
```

### "Package name too similar to existing package"

Choose a different package name or use a scope (@username/package-name).

### "402 Payment Required"

For scoped packages, you need to either:
1. Use `--access public` flag (free)
2. Or have an npm paid account for private packages

### "403 Forbidden"

You don't have permission to publish under this scope. Make sure:
1. You're logged in as the correct user
2. The scope matches your npm username
3. You have 2FA enabled if required

## Unpublishing

**Warning:** Unpublishing is permanent and discouraged.

```bash
# Unpublish specific version
npm unpublish @prmichaelsen/eventbrite-mcp@0.1.0

# Unpublish entire package (within 72 hours of publish)
npm unpublish @prmichaelsen/eventbrite-mcp --force
```

## Best Practices

1. **Test before publishing** - Always test locally first
2. **Use semantic versioning** - Follow semver strictly
3. **Keep README updated** - Documentation is critical
4. **Add a CHANGELOG** - Track changes between versions
5. **Tag releases in git** - `git tag v0.1.0 && git push --tags`
6. **Use CI/CD** - Automate testing and publishing
7. **Monitor downloads** - Check npm stats regularly
8. **Respond to issues** - Monitor GitHub issues and npm feedback

## Automation (Optional)

### GitHub Actions for Auto-Publish

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then publish by creating a git tag:
```bash
git tag v0.1.1
git push --tags
```

## Quick Reference

```bash
# Login
npm login

# Publish publicly (first time)
npm publish --access public

# Publish (subsequent times)
npm publish

# Bump version and publish
npm version patch && npm publish

# View package info
npm view @prmichaelsen/eventbrite-mcp

# Test installation
npx @prmichaelsen/eventbrite-mcp
```
