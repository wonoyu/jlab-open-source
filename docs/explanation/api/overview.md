---
id: api-overview
title: API Integration Management
sidebar_label: Overview
description: Comprehensive guide to managing API services, endpoints, and code generation in Flutter monorepo projects
keywords:
  - wdev api
  - API integration
  - OpenAPI
  - Retrofit
  - Service injection
---

# API Integration Management

The `wdev api` command provides a comprehensive CLI for managing API services, endpoints, and code generation in your Flutter monorepo. This command supports per-flavor service URLs, OpenAPI specifications, Retrofit client generation, and automatic service injection into features.

:::tip Recommended Workflow
The typical API workflow consists of three steps:
1. Create a new API service with `wdev api add`
2. Add endpoints and generate clients with `wdev api add-endpoint` and `wdev api generate`
3. Inject the service into a feature with `wdev api integrate`
:::

## Overview

API integration management enables Flutter developers to:

- **Create API services** with per-flavor configuration for different environments
- **Define endpoints** using OpenAPI specifications in YAML or JSON format
- **Generate Retrofit clients** automatically from OpenAPI specs
- **Inject services** into features with complete service layer including models, providers, and repositories
- **Manage OpenAPI specs** with export and migration capabilities

## Available Commands

| Command | Description |
|---------|-------------|
| [`wdev api add`](add.md) | Add a new API service with per-flavor URLs and OpenAPI spec |
| [`wdev api add-endpoint`](add-endpoint.md) | Add API endpoints from JSON definition files |
| [`wdev api generate`](generate.md) | Generate Retrofit API clients from OpenAPI specs |
| [`wdev api integrate`](integrate.md) | Inject an API service into a page with complete service layer |
| [`wdev api spec`](spec.md) | Manage OpenAPI specifications (export, migrate) |

## Quick Start

```bash
# Add a new API service
wdev api add --name users

# Add endpoints from JSON files
wdev api add-endpoint --source packages/api/lib/openapi/users

# Generate API clients
wdev api generate

# Inject service into a feature
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById
```

## Common Workflows

### Creating a New API Service

```bash
# Step 1: Create a new API service with per-flavor URLs
wdev api add --name users
# → Configures per-flavor URLs, creates OpenAPI spec

# Step 2: Add endpoints and generate clients
wdev api add-endpoint --source packages/api/lib/openapi/users
wdev api generate
# → Generates Retrofit API clients

# Step 3: Inject service into a feature
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById
# → Creates complete service layer with models, providers, and repository
```

### Managing Endpoints

```bash
# Add endpoints from a single JSON file
wdev api add-endpoint --source users/get_users.json --service users

# Add endpoints from a directory
wdev api add-endpoint --source packages/api/lib/openapi/users

# Watch for changes and regenerate on save
wdev api add-endpoint --source packages/api/lib/openapi --watch
```

### Service Injection with Caching

```bash
# Inject service with local caching using Drift
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id --register-db

# Inject service with PowerSync for offline-first
wdev api integrate --service orders --page checkout --feature dashboard \
  --endpoint createOrder --powersync
```

## Configuration

### Service Naming

Service names must follow snake_case convention:

```bash
# Valid service names
wdev api add --name users
wdev api add --name product_catalog
wdev api add --name order_notifications

# Invalid service names
wdev api add --name Users      # ❌ Uppercase not allowed
wdev api add --name users-service  # ❌ Hyphens not allowed
```

### Flavor Configuration

The API commands automatically detect and use flavors configured in your `config.yaml`:

```yaml
# config.yaml
flavors:
  dev:
    name: Development
    envFile: .env.dev
  staging:
    name: Staging
    envFile: .env.staging
  prod:
    name: Production
    envFile: .env.prod
```

## Output Structure

### Service Structure

When you add a new API service, the following structure is created:

```
packages/api/lib/openapi/
└── users/
    ├── users.yaml           # Main OpenAPI spec
    ├── paths/
    │   ├── get_users.yaml
    │   ├── get_user_by_id.yaml
    │   └── create_user.yaml
    └── components/
        ├── schemas/
        │   └── User.yaml
        └── parameters/
```

### Generated Client Structure

After running `wdev api generate`:

```
packages/api/lib/src/
└── users/
    ├── users_api.dart       # Retrofit API client
    ├── models/
    │   ├── user.dart
    │   └── user.freezed.dart
    └── users_api.di.dart    # Dependency injection
```

## Best Practices

:::note OpenAPI Specification
Always keep your OpenAPI specifications up to date. They serve as the single source of truth for your API contract.
:::

:::tip Use Version Control
Commit your OpenAPI specs to version control. This enables API-first development and makes changes traceable.
:::

:::warning Generate After Changes
Always run `wdev api generate` after modifying OpenAPI specs to regenerate clients and avoid compilation errors.
:::

## See Also

- [API Add Command](add.md) - Adding new API services
- [API Add-Endpoint Command](add-endpoint.md) - Adding endpoints from JSON
- [API Generate Command](generate.md) - Generating Retrofit clients
- [API Integrate Command](integrate.md) - Injecting services into features
- [API Spec Command](spec.md) - Managing OpenAPI specifications
- [Feature Commands](../feature/overview.md) - Managing feature packages
- [Page Commands](../page/overview.md) - Managing feature pages
