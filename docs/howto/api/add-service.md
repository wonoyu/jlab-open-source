---
id: api-howto-add-service
title: "How-To: Add a New API Service"
sidebar_label: Add New Service
sidebar_position: 1
sidebar_class_name: category-api-howto
---

# How to Add a New API Service

Learn how to create a new API service with per-flavor URLs and OpenAPI specification.

:::tip
This guide takes approximately 5 minutes.
:::

## Overview

The `wdev api add` command creates a new API service with:
- Per-flavor service URLs
- OpenAPI specification template
- Service directory structure

## Prerequisites

- Flutter monorepo with API package
- wdev_cli installed
- Flavor configuration in `config.yaml`

## Steps

### Step 1: Run the Add Command

```bash
# Navigate to your monorepo root
cd my_flutter_app

# Add a new service
wdev api add --name users
```

### Step 2: Configure Service URLs

Set environment variables for each flavor:

```bash
# .env.development
USERS_SERVICE_URL=http://localhost:8080

# .env.staging
USERS_SERVICE_URL=https://staging-api.example.com

# .env.production
USERS_SERVICE_URL=https://api.example.com
```

### Step 3: Verify Generated Structure

```bash
# Check generated files
ls packages/api/lib/openapi/users/

# Output:
# users.yaml
# paths/
# components/
```

### Step 4: Add Your First Endpoint

Add an endpoint definition to your service:

```bash
wdev api add-endpoint --source packages/api/lib/openapi/users
```

### Step 5: Generate API Clients

```bash
cd packages/api
dart run build_runner build
```

## Complete Example

```bash
# Full workflow to add a new "orders" service
cd my_flutter_app

# 1. Add the service
wdev api add --name orders

# 2. Configure URLs (add to your .env files)
echo "ORDERS_SERVICE_URL=http://localhost:8081" >> .env.development
echo "ORDERS_SERVICE_URL=https://staging-orders.example.com" >> .env.staging
echo "ORDERS_SERVICE_URL=https://orders.example.com" >> .env.production

# 3. Add endpoints
wdev api add-endpoint --source packages/api/lib/openapi/orders

# 4. Generate clients
wdev api generate

# 5. Build
cd packages/api && dart run build_runner build
```

## Options

| Option | Description |
|--------|-------------|
| `--name, -n` | Service name (required, snake_case) |
| `--json, -j` | Use JSON-based endpoint structure |
| `--examples, -e` | Generate example endpoints (default: true) |
| `--output, -o` | Output directory for OpenAPI specs |
| `--force, -f` | Overwrite existing files |

## Troubleshooting

### Service Name Invalid

```
Error: Invalid service name. Use snake_case (e.g., users, orders)
```

**Solution**: Use lowercase with underscores:
```bash
wdev api add --name order_notifications  # ✓
wdev api add --name OrderNotifications   # ✗
```

### API Package Not Found

```
Error: packages/api directory not found
```

**Solution**: Create the API package structure:
```bash
mkdir -p packages/api/lib
```

## Next Steps

- [Add endpoints to your service](./add-endpoints)
- [Generate API clients](./generate-clients)
- [Inject service into a feature](./inject-services)
