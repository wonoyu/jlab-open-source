---
id: api-add
title: API Add Command
sidebar_label: add
description: Add a new API service with per-flavor URLs and OpenAPI specification
keywords:
  - wdev api add
  - API service creation
  - OpenAPI spec
  - per-flavor URLs
---

# wdev api add

Add a new API service with per-flavor URLs and OpenAPI specification.

## Synopsis

```bash
wdev api add [options]
```

## Description

The `wdev api add` command creates a new API service with per-flavor URL configuration and generates an OpenAPI specification template. This command is the first step in setting up API integration for your Flutter monorepo.

When executed, the command:
1. Detects configured flavors from `config.yaml`
2. Prompts for or accepts a service name
3. Collects base URLs for each flavor
4. Generates OpenAPI specification templates
5. Creates directory structure for endpoints and components

:::info Interactive Mode
When run without `--name`, the command enters interactive mode and prompts for required inputs.
:::

## Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--name <name>` | `-n` | Service name (e.g., users, orders) |
| `--json` | `-j` | Use JSON-based endpoint structure instead of YAML |
| `--examples` | `-e` | Generate example endpoints (used with `--json`, default: true) |
| `--output <dir>` | `-o` | Output directory for OpenAPI specs (default: `packages/api/lib/openapi`) |
| `--force` | `-f` | Overwrite existing files |
| `--help` | `-h` | Show help information |

## Examples

### Basic Usage

```bash
# Interactive mode (prompts for service name)
wdev api add

# Non-interactive mode with service name
wdev api add --name users

# Short form
wdev api add -n users
```

### JSON-Based Workflow

```bash
# Create service with JSON endpoint structure
wdev api add --name orders --json

# Create service without example endpoints
wdev api add --name products --json --no-examples
```

### Custom Output Directory

```bash
# Output to custom directory
wdev api add --name users --output custom/api/openapi

# Force overwrite existing files
wdev api add --name users --force
```

## Service Name Requirements

Service names must follow snake_case convention:

| Valid | Invalid | Reason |
|-------|---------|--------|
| `users` | `Users` | Lowercase only |
| `order_notifications` | `order-notifications` | Underscores, not hyphens |
| `product_catalog` | `product catalog` | No spaces |

## Generated Structure

### YAML-Based Service (Default)

```
packages/api/lib/openapi/
└── users/
    ├── users.yaml              # Main OpenAPI spec
    ├── paths/                  # Endpoint definitions
    │   └── .gitkeep
    └── components/             # Reusable components
        ├── schemas/
        │   └── .gitkeep
        └── parameters/
            └── .gitkeep
```

### JSON-Based Service (with `--json`)

```
packages/api/lib/openapi/users/
├── users.json              # Main OpenAPI spec
└── paths/                  # Endpoint definitions
    ├── get_users.json
    ├── get_user_by_id.json
    └── create_user.json
```

## OpenAPI Specification Template

The generated OpenAPI specification includes:

```yaml
# packages/api/lib/openapi/users/users.yaml
openapi: 3.0.3
info:
  title: Users API
  description: API for managing users
  version: 1.0.0
servers:
  - url: https://users-dev.example.com
    description: Development server
  - url: https://users-staging.example.com
    description: Staging server
  - url: https://users-prod.example.com
    description: Production server
paths: {}
components:
  schemas: {}
```

## Per-Flavor URLs

The command collects base URLs for each configured flavor. These are added to the OpenAPI spec as server entries:

```yaml
servers:
  - url: https://users-dev.example.com
    description: Development server
  - url: https://users-staging.example.com
    description: Staging server
  - url: https://users-prod.example.com
    description: Production server
```

## Next Steps

After creating an API service:

1. **Add Endpoints**: Use [`wdev api add-endpoint`](add-endpoint.md) to define endpoints
2. **Generate Clients**: Run [`wdev api generate`](generate.md) to create Retrofit clients
3. **Inject Service**: Use [`wdev api integrate`](integrate.md) to inject into features

```bash
# Complete workflow
wdev api add --name users
wdev api add-endpoint --source packages/api/lib/openapi/users
wdev api generate
wdev api integrate --service users --page home --feature dashboard
```

## Troubleshooting

### Service Already Exists

If a service with the same name already exists:

```bash
# Use --force to overwrite
wdev api add --name users --force
```

### No Flavors Configured

Ensure flavors are configured in `config.yaml`:

```yaml
flavors:
  dev:
    name: Development
    envFile: .env.dev
  prod:
    name: Production
    envFile: .env.prod
```

### Invalid Service Name

Use snake_case for service names:

```bash
# Valid
wdev api add --name users
wdev api add --name order_notifications

# Invalid (will error)
wdev api add --name Users
wdev api add --name users-service
```

## See Also

- [API Overview](overview.md) - Main API documentation
- [API Add-Endpoint](add-endpoint.md) - Adding endpoints to services
- [API Generate](generate.md) - Generating API clients
- [API Integrate](integrate.md) - Injecting services into features
- [API Spec](spec.md) - Managing OpenAPI specifications
