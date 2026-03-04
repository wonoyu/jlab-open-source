---
id: api-reference-commands
title: API Command Reference
sidebar_label: Commands
sidebar_position: 2
sidebar_class_name: category-api-reference
---

# API Command Reference

Complete reference for all `wdev api` commands and their options.

## Command Overview

```
wdev api <command> [options]
```

| Command | Description |
|---------|-------------|
| [`add`](#wdev-api-add) | Add a new API service with per-flavor URLs |
| [`add-endpoint`](#wdev-api-add-endpoint) | Add endpoints from JSON definition files |
| [`spec`](#wdev-api-spec) | Manage OpenAPI specifications |
| [`generate`](#wdev-api-generate) | Generate Retrofit API clients |
| [`integrate`](#wdev-api-integrate) | Inject service into a page |

---

## wdev api add

Add a new API service with per-flavor URLs and OpenAPI specification.

### Usage

```bash
wdev api add --name <service_name> [options]
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--name` | `-n` | Service name (snake_case, required) | - |
| `--json` | `-j` | Use JSON-based endpoint structure | false |
| `--examples` | `-e` | Generate example endpoints | true |
| `--output` | `-o` | Output directory for OpenAPI specs | packages/api/lib/openapi |
| `--force` | `-f` | Overwrite existing files | false |

### Examples

```bash
# Basic usage
wdev api add --name users

# With JSON structure
wdev api add --name orders --json

# Custom output directory
wdev api add --name products --output custom/path

# With examples disabled
wdev api add --name notifications --no-examples

# Force overwrite existing
wdev api add --name users --force
```

### Output

```
✓ Service "users" created successfully!

📄 Generated files:
  • packages/api/lib/openapi/users/users.yaml
  • packages/api/lib/openapi/users/paths/
  • packages/api/lib/openapi/users/components/
```

---

## wdev api add-endpoint

Add API endpoints from JSON definition files.

### Usage

```bash
wdev api add-endpoint --source <path> [options]
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--source` | `-s` | Path to JSON file or directory (required) | - |
| `--service` | `-v` | Service name for OpenAPI spec | auto-detected |
| `--watch` | `-w` | Watch for changes and regenerate | false |
| `--validate` | `-V` | Validate JSON without generating | false |

### Examples

```bash
# Single file
wdev api add-endpoint --source users/get_users.json --service users

# Directory
wdev api add-endpoint --source packages/api/lib/openapi/users

# With watch mode
wdev api add-endpoint --source packages/api/lib/openapi --watch

# Validate only
wdev api add-endpoint --source users/endpoints --validate
```

### Output

```
✓ Generated 3 endpoint(s) for "users" service

📄 Generated files:
  • packages/api/lib/openapi/users/paths/get_users.yaml
  • packages/api/lib/openapi/users/paths/get_user_by_id.yaml
  • packages/api/lib/openapi/users/paths/create_user.yaml
```

---

## wdev api spec

Manage OpenAPI specifications (export, migrate).

### Usage

```bash
wdev api spec <subcommand> [options]
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| [`export`](#wdev-api-spec-export) | Export OpenAPI YAML to JSON |
| [`migrate`](#wdev-api-spec-migrate) | Migrate monolithic to service-specific specs |

### wdev api spec export

Export OpenAPI YAML specifications to JSON format.

```bash
wdev api spec export --service <name> [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--service` | Service name to export (required) | - |
| `--output` | Output directory | packages/api/lib/openapi |
| `--pretty` | Pretty-print JSON output | true |

**Examples:**

```bash
# Export users service
wdev api spec export --service users

# Custom output
wdev api spec export --service orders --output tools/openapi/
```

### wdev api spec migrate

Migrate monolithic api.yaml to service-specific specifications.

```bash
wdev api spec migrate [options]
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `--input` | Input file path | packages/api/lib/api.yaml |
| `--output` | Output directory | packages/api/lib/openapi |
| `--force` | Overwrite existing files | false |

**Examples:**

```bash
# Default migration
wdev api spec migrate

# Custom paths
wdev api spec migrate --input custom/api.yaml --output custom/specs
```

---

## wdev api generate

Generate Retrofit API clients from OpenAPI specs.

### Usage

```bash
wdev api generate [options]
```

### Options

| Option | Description |
|--------|-------------|
| `--verbose` | Show detailed output |

### Examples

```bash
# Generate all clients
wdev api generate

# Verbose output
wdev api generate --verbose
```

### Output

```
✓ API clients generated successfully!

📝 Next steps:
  1. Run: cd packages/api && dart run build_runner build
  2. Inject service into a page: wdev api integrate --service <name> --page <page_name>
```

---

## wdev api integrate

Inject an API service into a page with complete service layer.

### Usage

```bash
wdev api integrate --service <name> --page <name> --feature <name> [options]
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--service` | `-s` | Service name (required) | - |
| `--page` | `-p` | Page name (required) | - |
| `--feature` | `-f` | Feature name (required) | - |
| `--endpoint` | `-e` | API endpoint method name | - |
| `--all-methods` | `-a` | Generate all endpoints | false |
| `--output` | `-o` | Output directory | lib/src/features |
| `--dry-run` | `-d` | Preview without writing | false |
| `--with-repository` | `-r` | Generate repository layer | true |
| `--cache` | `-c` | Enable Drift caching | false |
| `--powersync` | `-y` | Enable PowerSync | false |
| `--cache-keys` | - | Cache key fields | - |
| `--register-db` | `-R` | Register in app_database.dart | false |

### Examples

```bash
# Basic injection
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById

# Inject all endpoints
wdev api integrate --service users --page home --feature dashboard --all-methods

# With caching
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id

# With PowerSync
wdev api integrate --service orders --page checkout --feature dashboard \
  --endpoint createOrder --powersync --cache-keys id

# Dry run
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --dry-run
```

### Output

```
✓ Injected 1 endpoint(s) from "users" into dashboard/home

📄 Generated files:
  • lib/src/features/dashboard/home/src/application/users_home_notifier.dart
  • lib/src/features/dashboard/home/src/domain/models/users_home_user_model.dart
  • lib/src/features/dashboard/home/src/domain/repositories/users_home_repository_interface.dart
  • lib/src/features/dashboard/home/src/data/repositories/users_home_repository_impl.dart
  • lib/src/features/dashboard/home/src/presentation/notifiers/users_home/index.dart

📝 Next steps:
  1. Add to feature barrel:
     export 'src/domain/models/index.dart';
     export 'src/domain/repositories/index.dart';
     export 'src/application/index.dart';
     export 'src/presentation/notifiers/users_home/index.dart';
  2. Run code generation:
     dart run build_runner build
```
