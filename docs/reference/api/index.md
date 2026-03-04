---
id: api-reference-index
title: API Reference
sidebar_label: Reference
sidebar_position: 1
sidebar_class_name: category-api-reference
---

# API Integration Reference

Complete reference documentation for the wdev API integration system.

## Command Reference

| Command | Description | Link |
|---------|-------------|------|
| [`wdev api add`](add) | Add a new API service | [Details](add.md) |
| [`wdev api add-endpoint`](add-endpoint) | Add endpoints from JSON files | [Details](add-endpoint.md) |
| [`wdev api generate`](generate) | Generate Retrofit clients | [Details](generate.md) |
| [`wdev api integrate`](integrate) | Inject service into features | [Details](integrate.md) |
| [`wdev api spec`](spec) | Manage OpenAPI specifications | [Details](spec.md) |
| [Complete Command Reference](commands) | All commands with full options | |

## Individual Command Documentation

### wdev api add

Add a new API service with per-flavor URLs and OpenAPI spec.

```bash
wdev api add --name users
```

**Key Options:**
- `--name`, `-n`: Service name (required)
- `--json`, `-j`: Use JSON-based workflow
- `--examples`, `-e`: Generate example endpoints
- `--force`, `-f`: Overwrite existing

**[Full Documentation](add.md)**

### wdev api add-endpoint

Add API endpoints from JSON definition files.

```bash
wdev api add-endpoint --source users/get_users.json
```

**Key Options:**
- `--source`, `-s`: JSON file or directory (required)
- `--service`, `-v`: Service name
- `--watch`, `-w`: Watch for file changes

**[Full Documentation](add-endpoint.md)**

### wdev api generate

Generate Retrofit API clients from OpenAPI specs.

```bash
wdev api generate --verbose
```

**Key Options:**
- `--verbose`, `-v`: Verbose output
- `--regenerate`, `-r`: Regenerate existing

**[Full Documentation](generate.md)**

### wdev api integrate

Inject an API service into a page with complete service layer.

```bash
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById
```

**Key Options:**
- `--service`, `-s`: Service name (required)
- `--page`, `-p`: Page name (required)
- `--feature`, `-f`: Feature name (required)
- `--cache`, `-c`: Enable Drift caching
- `--powersync`, `-y`: PowerSync offline-first

**[Full Documentation](integrate.md)**

### wdev api spec

Manage OpenAPI specifications (export, migrate).

```bash
wdev api spec export --service users
wdev api spec migrate
```

**[Full Documentation](spec.md)**

## Options Reference

### Global Options

| Option | Description |
|--------|-------------|
| `--help, -h` | Show help |
| `--verbose` | Show detailed output |
| `--quiet` | Suppress non-essential output |

### Service Naming

Services must use **snake_case**:

```
Valid:   users, order_notifications, product_catalog
Invalid: Users, users-service, usersService
```

## File Structure Reference

### API Package Structure

```
packages/api/
├── lib/
│   ├── src/
│   │   ├── api_module.dart        # Client registrations
│   │   └── generated/             # Generated clients
│   │       ├── export.dart
│   │       └── users/
│   │           ├── users_api.dart
│   │           └── models/
│   └── openapi/
│       └── users/
│           ├── users.yaml
│           ├── paths/
│           └── components/
├── openapi_generator.yaml
└── pubspec.yaml
```

### Feature Integration Structure

```
lib/src/features/`{feature}`/
└── `{page}`/
    ├── src/
    │   ├── application/
    │   │   └── `{service}`_`{page}`_notifier.dart
    │   ├── domain/
    │   │   ├── models/
    │   │   │   └── `{service}`_`{page}`_model.dart
    │   │   └── repositories/
    │   │       └── `{service}`_`{page}`_repository_interface.dart
    │   ├── data/
    │   │   ├── local/
    │   │   │   └── `{service}`_`{page}`_drift_repository.dart
    │   │   └── repositories/
    │   │       └── `{service}`_`{page}`_repository_impl.dart
    │   └── presentation/
    │       └── notifiers/
    │           └── `{service}`_`{page}`/
    │               ├── index.dart
    │               └── `{service}`_`{page}`_notifier.dart
    └── api_integrations.yaml
```

## Environment Variables

### Service URLs

```
{ SERVICE_NAME }_SERVICE_URL=`{flavor_value}`
```

Examples:
```
USERS_SERVICE_URL=http://localhost:8080
ORDERS_SERVICE_URL=https://api.example.com/orders
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (validation, file not found, etc.) |

## Related Documentation

- [API Overview](../api/overview.md)
- [How-To Guides](../../howto/api/index.md)
- [Tutorials](../../tutorial/api/index.md)
- [Architecture Explanation](../explanation/architecture.md)
