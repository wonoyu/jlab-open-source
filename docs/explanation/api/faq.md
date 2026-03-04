---
id: api-explanation-faq
title: API FAQ
sidebar_label: FAQ
sidebar_position: 2
sidebar_class_name: category-api-explanation
---

# API Integration FAQ

Frequently asked questions about the wdev API integration system.

## General Questions

### What is the wdev API integration system?

The wdev API integration system is a comprehensive CLI tool for managing API services in Flutter monorepo projects. It handles:

- Creating API services with per-flavor configuration
- Defining endpoints using OpenAPI specifications
- Generating Retrofit API clients
- Injecting services into feature pages with complete service layer
- Managing local caching with Drift and PowerSync

### Do I need an API package in my monorepo?

Yes, the API integration system expects a `packages/api` directory in your monorepo. This package contains:

- OpenAPI specifications
- Generated API clients
- Service module registrations

### What Flutter version is required?

wdev_cli requires:
- Flutter SDK 3.0.0 or higher
- Dart SDK 3.0.0 or higher

## Service Management

### Can I add multiple services?

Yes, you can add multiple API services:

```bash
wdev api add --name users
wdev api add --name orders
wdev api add --name products
```

Each service gets its own directory in `packages/api/lib/openapi/`.

### How do I update an existing service?

To update an existing service, use the `--force` flag:

```bash
wdev api add --name users --force
```

This will overwrite existing files while preserving your customizations.

### Can I delete a service?

To delete a service, manually remove the service directory:

```bash
rm -rf packages/api/lib/openapi/users
```

Then remove client registrations from `packages/api/lib/src/api_module.dart`.

## Endpoint Definitions

### What formats are supported for endpoint definitions?

The system supports:
- **JSON files** - For simple endpoint definitions
- **OpenAPI YAML** - For full OpenAPI specifications

### How do I define endpoints?

Create a JSON file with the endpoint definition:

```json
{
  "method": "GET",
  "path": "/users",
  "operationId": "listUsers",
  "summary": "List all users"
}
```

Then run:

```bash
wdev api add-endpoint --source path/to/endpoint.json --service users
```

### Can I use watch mode for development?

Yes, use the `--watch` flag:

```bash
wdev api add-endpoint --source packages/api/lib/openapi --watch
```

This will regenerate endpoints when files change.

## Client Generation

### What client generator is used?

wdev_cli uses **openapi_retrofit_generator** to generate Retrofit clients from OpenAPI specifications.

### How do I regenerate clients after changing specs?

```bash
wdev api generate
cd packages/api
dart run build_runner build
```

### What happens if generation fails?

Check for:
- Invalid OpenAPI specification syntax
- Missing required fields
- Type mismatches in schemas

Run with verbose output for debugging:

```bash
wdev api generate --verbose
```

## Service Injection

### What is generated when I inject a service?

For each injection, the following are generated:

- Riverpod notifier for state management
- Domain model with freezed
- Repository interface
- Repository implementation (data layer)
- Optional Drift table for caching

### Can I inject multiple endpoints at once?

Yes, use the `--all-methods` flag:

```bash
wdev api integrate --service users --page home --feature dashboard --all-methods
```

### How do I use the injected service?

```dart
final userAsync = ref.watch(usersHomeNotifierProvider);

userAsync.when(
  data: (user) => Text(user.name),
  loading: () => CircularProgressIndicator(),
  error: (error) => Text('Error: $error'),
);
```

## Caching

### How does Drift caching work?

When `--cache` is enabled:
1. A Drift table is created for the entity
2. Data is synced to local SQLite database
3. Offline access is available

### What is PowerSync?

PowerSync is an offline-first sync solution:
- Real-time sync with backend
- Conflict resolution
- Optimistic updates
- Works with Drift tables

### Can I enable caching later?

Yes, you can re-inject with caching enabled:

```bash
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id
```

## Troubleshooting

### Service name validation fails

Ensure the service name is in snake_case:

```bash
# Valid
wdev api add --name users
wdev api add --name order_notifications

# Invalid
wdev api add --name Users
wdev api add --name users-service
```

### API package not found error

Create the API package structure:

```bash
mkdir -p packages/api/lib
```

### Build runner fails

Ensure you have the required dependencies:

```yaml
# packages/api/pubspec.yaml
dependencies:
  retrofit: ^4.0.0
  freezed_annotation: ^2.4.0
  drift: ^2.15.0

dev_dependencies:
  build_runner: ^2.4.0
  retrofit_generator: ^8.0.0
  freezed: ^2.4.0
```

### Environment variables not loaded

Ensure envied is properly configured:

```bash
cd packages/api
dart run build_runner build
```

### Circular dependency errors

Check your dependency injection setup in `api_module.dart`.

## Best Practices

### Keep OpenAPI specs version controlled

Commit your OpenAPI specifications to version control:

```bash
git add packages/api/lib/openapi/
git commit -m "Add users API specification"
```

### Generate clients after every spec change

Run `wdev api generate` and `dart run build_runner build` after any spec change.

### Use meaningful operation IDs

```yaml
# Good
operationId: listUsers
operationId: getUserById

# Bad
operationId: getUsers1
operationId: getData
```

### Test generated clients

Always test that generated clients compile and work correctly.

## Related Documentation

- [API Overview](../api/overview.md)
- [Architecture Explanation](./architecture.md)
- [How-To Guides](../../howto/api/index.md)
- [Command Reference](../../reference/api/commands.md)
