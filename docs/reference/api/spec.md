---
id: api-spec
title: API Spec Command
sidebar_label: spec
description: Manage OpenAPI specifications (export, migrate)
keywords:
  - wdev api spec
  - OpenAPI export
  - OpenAPI migrate
  - API specification management
---

# wdev api spec

Manage OpenAPI specifications including export and migration operations.

## Synopsis

```bash
wdev api spec <subcommand> [options]
```

## Description

The `wdev api spec` command provides utilities for managing OpenAPI specifications. It supports exporting YAML specifications to JSON format and migrating monolithic `api.yaml` files to service-specific specifications.

:::info Subcommand Required
This command requires a subcommand. Run `wdev api spec --help` to see available subcommands.
:::

## Subcommands

| Subcommand | Description |
|------------|-------------|
| [`export`](spec.md#spec-export) | Export OpenAPI YAML specs to JSON format |
| [`migrate`](spec.md#spec-migrate) | Migrate monolithic api.yaml to service-specific specs |

## wdev api spec export

Export OpenAPI YAML specifications to JSON format.

### Synopsis

```bash
wdev api spec export [options]
```

### Description

The `export` subcommand converts OpenAPI YAML specifications to JSON format. This is useful for tools that require JSON-based OpenAPI specifications or for CI/CD pipelines.

When executed, the command:
1. Scans for YAML-based OpenAPI specifications
2. Parses each YAML file
3. Converts to JSON format
4. Writes JSON files alongside YAML originals

### Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--service <name>` | `-s` | Export specific service only |
| `--output <dir>` | `-o` | Output directory for JSON files |
| `--help` | `-h` | Show help information |

### Examples

```bash
# Export all services to JSON
wdev api spec export

# Export specific service
wdev api spec export --service users

# Short form
wdev api spec export -s users

# Export to custom output directory
wdev api spec export --output json_specs/
```

### Generated Output

```
packages/api/lib/openapi/users/
├── users.yaml          # Original YAML spec
└── users.json          # Exported JSON spec
```

### JSON Output Format

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Users API",
    "description": "API for managing users",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://users-dev.example.com",
      "description": "Development server"
    }
  ],
  "paths": {},
  "components": {
    "schemas": {}
  }
}
```

## wdev api spec migrate

Migrate monolithic api.yaml to service-specific specifications.

### Synopsis

```bash
wdev api spec migrate [options]
```

### Description

The `migrate` subcommand converts a monolithic `api.yaml` file into individual service-specific specifications. This is useful for:
- Splitting large APIs into manageable microservices
- Creating per-service OpenAPI specs from a single source
- Preparing for service decomposition

When executed, the command:
1. Locates the monolithic `api.yaml` file
2. Analyzes the structure and identifies services
3. Splits paths into service-specific files
4. Creates per-service OpenAPI specifications with appropriate server URLs

### Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--input <path>` | `-i` | Path to monolithic api.yaml |
| `--output <dir>` | `-o` | Output directory for migrated specs |
| `--dry-run` | `-d` | Preview migration without writing files |
| `--help` | `-h` | Show help information |

### Examples

```bash
# Migrate from default location
wdev api spec migrate

# Migrate from custom input path
wdev api spec migrate --input packages/api/api.yaml

# Preview migration without writing files
wdev api spec migrate --dry-run

# Output to custom directory
wdev api spec migrate --output migrated_specs/
```

### Migration Process

#### Before Migration

```
packages/api/
└── api.yaml              # Monolithic API spec (all services)
```

#### After Migration

```
packages/api/
├── api.yaml              # Original spec preserved
└── lib/openapi/
    ├── users/
    │   ├── users.yaml   # Service-specific spec
    │   └── users.json
    ├── orders/
    │   ├── orders.yaml
    │   └── orders.json
    └── products/
        ├── products.yaml
        └── products.json
```

### Service Detection

The migration detects services based on path prefixes:

```yaml
# api.yaml
paths:
  /users:              # → users service
    get:
      summary: Get users
  /users/`{id}`:         # → users service
    get:
      summary: Get user by ID
  /orders:             # → orders service
    post:
      summary: Create order
  /products:           # → products service
    get:
      summary: List products
```

### Dry Run Output

```bash
wdev api spec migrate --dry-run

# Output:
# [DRY RUN] Would migrate api.yaml to service-specific specs:
#
# Service: users
#   - Paths: /users, /users/`{id}`
#   - Output: packages/api/lib/openapi/users/users.yaml
#
# Service: orders
#   - Paths: /orders, /orders/`{id}`
#   - Output: packages/api/lib/openapi/orders/orders.yaml
#
# Service: products
#   - Paths: /products, /products/`{id}`
#   - Output: packages/api/lib/openapi/products/products.yaml
#
# Would create 3 service specifications
# Would NOT modify any files (dry run mode)
```

### Generated Service Spec

```yaml
# packages/api/lib/openapi/users/users.yaml
openapi: 3.0.3
info:
  title: Users API
  description: Migrated from monolithic api.yaml
  version: 1.0.0
servers:
  - url: https://users-api.example.com
    description: Users service
paths:
  /users:
    get:
      summary: Get users
  /users/`{id}`:
    get:
      summary: Get user by ID
```

## Workflow Examples

### Export Workflow for CI/CD

```bash
# In CI/CD pipeline
wdev api spec export --service users
wdev api spec export --service orders

# Use JSON specs in API documentation tools
```

### Migration Workflow

```bash
# Step 1: Analyze current monolithic spec
wdev api spec migrate --dry-run

# Step 2: Run migration
wdev api spec migrate

# Step 3: Review generated specs
ls packages/api/lib/openapi/*/

# Step 4: Update client generation
wdev api generate

# Step 5: Commit changes
git add packages/api/lib/openapi/
git commit -m "migrate: Split monolithic api.yaml into service specs"
```

## Troubleshooting

### No API Spec Found

For export:
```bash
# Ensure OpenAPI specs exist
ls packages/api/lib/openapi/

# Create a service first
wdev api add --name users
```

For migrate:
```bash
# Ensure monolithic api.yaml exists
ls packages/api/api.yaml

# Create if missing
touch packages/api/api.yaml
```

### Service Detection Issues

If services aren't detected correctly, manually organize paths:

```yaml
# Group paths by service in api.yaml
paths:
  # Users service
  /users:
    ...
  /users/`{id}`:
    ...
  # Orders service
  /orders:
    ...
  /orders/`{id}`:
    ...
```

### Migration Conflicts

If service specs already exist:
```bash
# Use --dry-run to preview
wdev api spec migrate --dry-run

# Backup existing specs
cp -r packages/api/lib/openapi/ packages/api/lib/openapi.backup/

# Run migration
wdev api spec migrate
```

## See Also

- [API Overview](overview.md) - Main API documentation
- [API Add](add.md) - Creating new API services
- [API Add-Endpoint](add-endpoint.md) - Adding endpoints to services
- [API Generate](generate.md) - Generating API clients
- [API Integrate](integrate.md) - Injecting services into features
