# wdev_cli Documentation

This directory contains the Docusaurus-based documentation for wdev_cli.

## Quick Start

### Installation

```bash
# Install dependencies
cd docs
npm install

# Start development server
npm start
```

The documentation site will be available at `http://localhost:3000`.

## Building for Production

```bash
# Build the documentation
npm run build

# Output will be in the `build` directory
```

## Deployment

### GitHub Pages

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

### Manual Deployment

```bash
# Build the documentation
npm run build

# Deploy the build directory to your hosting solution
```

## Project Structure

```
docs/
├── api/                    # API command documentation
│   ├── overview.md         # API overview page
│   ├── add.md              # wdev api add command
│   ├── add-endpoint.md     # wdev api add-endpoint command
│   ├── generate.md         # wdev api generate command
│   ├── integrate.md        # wdev api integrate command
│   └── spec.md             # wdev api spec command
├── src/
│   └── css/
│       └── custom.css      # Custom styles
├── docusaurus.config.js    # Docusaurus configuration
├── sidebar.js              # Sidebar configuration
├── package.json            # NPM dependencies
└── README.md               # This file
```

## Documentation Guidelines

### Frontmatter

All documentation files must include frontmatter:

```yaml
---
id: doc-id
title: Document Title
sidebar_label: Short Label
description: Brief description for SEO
keywords:
  - keyword1
  - keyword2
---
```

### Admonitions

Use Docusaurus admonitions for important information:

```markdown
:::info Information
This is an informational message.
:::

:::tip Tip
This is a helpful tip.
:::

:::warning Warning
This is a warning message.
:::

:::danger Danger
This is a dangerous action warning.
:::
```

### Code Blocks

Use language-specific code blocks:

```bash
# Bash command
wdev api add --name users
```

```dart
// Dart code
class UsersRepository {
  Future<void> getUsers() async {
    // Repository implementation
  }
}
```

### Tables

Use tables for option documentation:

```markdown
| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--verbose` | `-v` | Enable verbose output |
```

## Adding New Documentation

### 1. Create the Documentation File

Create a new `.md` file in the appropriate directory:

```markdown
---
id: new-command
title: New Command
sidebar_label: new
description: Description of the new command
keywords:
  - wdev new
  - command
---

# wdev new

Description of the command...

## Options

| Option | Description |
|--------|-------------|
| `--option1` | Description |

## Examples

```bash
wdev new --option1 value
```
```

### 2. Update Sidebar

Add the new document to `sidebar.js`:

```javascript
{
  type: 'doc',
  id: 'new-command',
  label: 'new',
},
```

### 3. Rebuild Documentation

```bash
npm run build
```

## Configuration

### docusaurus.config.js

Key configuration options:

- `title`: Site title
- `url`: Production URL
- `baseUrl`: Base URL path
- `organizationName`: GitHub organization/user name
- `projectName`: GitHub repository name

### Sidebar Configuration

The sidebar is organized by category:

```javascript
const sidebars = {
  apiSidebar: [
    {
      type: 'category',
      label: 'API Integration',
      items: [
        {
          type: 'doc',
          id: 'api/overview',
          label: 'Overview',
        },
      ],
    },
  ],
};
```

## Testing

### Local Development

```bash
# Start development server with hot reload
npm start
```

### Build Verification

```bash
# Build the documentation and check for errors
npm run build
```

## Troubleshooting

### Node.js Version

Ensure you're using Node.js 18 or higher:

```bash
node --version
```

### Dependency Issues

If you encounter dependency issues:

```bash
# Clear cache and reinstall
npm ci

# Or remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Failures

Check for:

- Frontmatter syntax errors
- Broken links
- Missing required fields in frontmatter
- Invalid Markdown syntax

## GitHub Pages Deployment

### Setup

1. Create a `gh-pages` branch:

```bash
git checkout --orphan gh-pages
git rm -rf .
git commit --allow-empty -m "Initial gh-pages commit"
git push origin gh-pages
```

2. Configure GitHub Actions or deploy script

### Automated Deployment

The `npm run deploy` command builds and deploys to the `gh-pages` branch.

## Contributing

### Adding New Commands

1. Add documentation in the appropriate category directory
2. Update the sidebar configuration
3. Add navigation links if needed
4. Test locally before committing

### Updating Existing Documentation

1. Edit the relevant `.md` file
2. Rebuild and verify changes
3. Commit with descriptive message

## License

This documentation is part of the wdev_cli project. See the main project [LICENSE](../LICENSE) for details.
