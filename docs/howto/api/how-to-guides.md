---
sidebar_position: 2
sidebar_label: How-to Guides
---

# API Integration How-to Guides

Practical solutions for common API integration tasks in your Flutter monorepo.

:::info
These guides provide step-by-step solutions for specific API integration scenarios. If you're new to API integration, start with the [Tutorial](tutorial.md).
:::

## Adding Services

### How to Add a New API Service with Per-Flavor URLs

Create a new API service that supports different base URLs for each flavor:

```bash
wdev api add --name orders
```

The command will prompt for URLs for each detected flavor:

```text
? Service name (e.g., users): orders
? URL for dev (e.g., https://orders-dev.example.com): https://orders-dev.api.example.com
? URL for staging (e.g., https://orders-staging.example.com): https://orders-staging.api.example.com
? URL for prod (e.g., https://orders-prod.example.com): https://orders-prod.api.example.com
```

:::tip
Use descriptive service names in snake_case (e.g., `order_management`, `payment_service`).
:::

### How to Create a Service with JSON-Based Endpoints

For teams preferring JSON over YAML for endpoint definitions:

```bash
wdev api add --name products --json
```

This generates a JSON-based structure in `packages/api/lib/openapi/products/`.

### How to Skip Example Endpoints

When you don't need example endpoints generated:

```bash
wdev api add --name inventory --no-examples
```

### How to Specify Custom Output Directory

Generate OpenAPI specs in a custom location:

```bash
wdev api add --name users --output custom/api/specs
```

### How to Overwrite Existing Services

Force overwrite when the service already exists:

```bash
wdev api add --name users --force
```

## Adding Endpoints

### How to Add a Single Endpoint

Add one endpoint from a JSON file:

```bash
wdev api add-endpoint --source packages/api/lib/openapi/users/create_user.json --service users
```

### How to Add All Endpoints from a Service Directory

Process all JSON files in a service directory:

```bash
wdev api add-endpoint --source packages/api/lib/openapi/users
```

### How to Auto-Detect Service Name

Let the command detect the service name from the path:

```bash
wdev api add-endpoint --source packages/api/lib/openapi/products
# Service name "products" is auto-detected
```

### How to Use Watch Mode for Development

Automatically regenerate when JSON files change:

```bash
wdev api add-endpoint --source packages/api/lib/openapi --watch
```

### How to Validate Without Generating

Check JSON files for errors without generating YAML:

```bash
wdev api add-endpoint --source packages/api/lib/openapi/users --validate
```

## Managing OpenAPI Specs

### How to Export Specs to JSON

Export OpenAPI YAML specifications to JSON format:

```bash
wdev api spec export --service users
```

This creates `packages/api/lib/openapi/users/users.json`.

### How to Export with Custom Output

Specify a custom output directory:

```bash
wdev api spec export --service orders --output tools/openapi/json
```

### How to Migrate from Monolithic to Service-Specific Specs

Split a single `api.yaml` into individual service files:

```bash
wdev api spec migrate
```

This reads from `packages/api/lib/api.yaml` and outputs to `packages/api/lib/openapi/`.

### How to Migrate with Custom Paths

Use custom input and output paths:

```bash
wdev api spec migrate --input custom/api.yaml --output custom/specs
```

### How to Force Overwrite During Migration

Overwrite existing files during migration:

```bash
wdev api spec migrate --force
```

## Generating API Clients

### How to Generate All API Clients

Generate Retrofit clients for all services:

```bash
wdev api generate
```

### How to Generate with Verbose Output

See detailed generation progress:

```bash
wdev api generate --verbose
```

### How to Run build_runner Separately

Generate without running `wdev api generate`:

```bash
dart run build_runner build --delete-conflicting-outputs
```

## Integrating Services

### How to Inject a Single Endpoint

Inject one endpoint into a feature:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile
```

### How to Inject with Repository Layer

Include a repository pattern in the generated service:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --with-repository
```

### How to Enable Local Caching

Add Drift-based local caching:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --cache \
  --cache-keys id,name
```

### How to Enable Offline-First with PowerSync

Add PowerSync for offline-first functionality:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --powersync
```

### How to Generate All Endpoints

Inject all endpoints from a service:

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --all-methods
```

### How to Register Database Tables

Register Drift tables in the core app_database.dart:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --cache \
  --register-db
```

### How to Preview Changes Before Writing

Preview the generated files without creating them:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --dry-run
```

### How to Use Custom Output Directory

Generate files in a custom location:

```bash
wdev api integrate \
  --service users \
  --page profile \
  --feature account \
  --endpoint getUserProfile \
  --output custom/features
```

## Complete Workflows

### Complete API Service Setup Workflow

```bash
# 1. Add the service
wdev api add --name orders

# 2. Add endpoint definitions (multiple files)
wdev api add-endpoint --source packages/api/lib/openapi/orders/get_orders.json
wdev api add-endpoint --source packages/api/lib/openapi/orders/create_order.json
wdev api add-endpoint --source packages/api/lib/openapi/orders/update_order.json

# 3. Generate API clients
wdev api generate

# 4. Inject into feature
wdev api integrate \
  --service orders \
  --page order_list \
  --feature sales \
  --endpoint listOrders \
  --all-methods \
  --cache \
  --cache-keys id
```

### Multi-Flavor Production Setup

```bash
# Add service with production URLs for all flavors
wdev api add --name products

# Add all endpoints
wdev api add-endpoint --source packages/api/lib/openapi/products

# Generate clients
wdev api generate

# Inject into features with full caching
wdev api integrate \
  --service products \
  --page product_list \
  --feature catalog \
  --endpoint listProducts \
  --all-methods \
  --cache \
  --cache-keys sku \
  --register-db

# Export specs for external tools
wdev api spec export --service products --output tools/api-docs
```

### CI/CD Integration

```bash
#!/bin/bash
# CI script for API generation

set -e

echo "Generating API clients..."
wdev api generate --verbose

echo "Running build_runner..."
dart run build_runner build --delete-conflicting-outputs

echo "Validating endpoint definitions..."
wdev api add-endpoint --source packages/api/lib/openapi --validate

echo "API generation complete!"
```

## Troubleshooting

### Service Name Validation Errors

If you see:

```text
Invalid service name. Use snake_case (e.g., users, product_catalog)
```

Ensure your service name:
- Uses snake_case (lowercase with underscores)
- Contains only letters, numbers, and underscores
- Doesn't start with a number

```bash
# Correct
wdev api add --name user_management

# Incorrect
wdev api add --name UserManagement  # PascalCase
wdev api add --name user-management # kebab-case
wdev api add --name 123users        # starts with number
```

### Missing Flavors Error

If you see:

```text
No flavors configured. Please set up flavors first.
```

Ensure you have flavors configured in your `wdev.yaml`:

```yaml
flavors:
  dev:
    color: '#00FF00'
  staging:
    color: '#FFA500'
  prod:
    color: '#FF0000'
```

### Endpoint Not Found After Integration

If your integrated endpoint isn't working:

1. Verify the endpoint exists in the generated API:

```dart
// Check the generated users_api.dart
final api = UsersApi.create();
final response = await api.listUsers(); // Ensure method name matches
```

2. Check the operationId in your OpenAPI spec matches what you specified:

```json
{
  "operationId": "listUsers",  // Must match --endpoint value
  ...
}
```

## Best Practices

### Service Naming

- Use descriptive names: `payment_service`, `notification_service`
- Avoid abbreviations: Use `users` not `usr`
- Keep it simple: `orders` not `order_management_system`

### Endpoint Definitions

- One JSON file per endpoint
- Use descriptive operationIds: `createUser` not `post1`
- Include proper response schemas

### Code Generation

- Run `wdev api generate` after any endpoint changes
- Use `--verbose` for debugging generation issues
- Commit generated files to version control

### Integration

- Generate a new feature for each service integration
- Use `--cache` for frequently accessed data
- Use `--powersync` for offline-first requirements
