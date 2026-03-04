---
id: api-howto-inject-services
title: "How-To: Inject API Services into Features"
sidebar_label: Inject Services
sidebar_position: 4
sidebar_class_name: category-api-howto
---

# How to Inject API Services into Features

Learn how to inject API services into feature pages with complete service layer.

:::tip
This guide takes approximately 10 minutes.
:::

## Overview

The `wdev api integrate` command generates:
- Riverpod providers for state management
- Domain models with freezed
- Repository interfaces and implementations
- Optional Drift local caching
- Optional PowerSync offline-first support

## Prerequisites

- API service configured
- OpenAPI specification with endpoints
- Feature package created

## Basic Injection

### Step 1: Inject a Single Endpoint

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --endpoint getUserById
```

### Step 2: Verify Generated Files

```bash
# Check generated files
ls lib/src/features/dashboard/home/

# Output:
# src/
# ├── application/
# │   └── users_home_notifier.dart
# ├── domain/
# │   ├── models/
# │   │   └── users_home_user_model.dart
# │   └── repositories/
# │       └── users_home_repository_interface.dart
# ├── data/
# │   ├── local/
# │   │   └── users_home_drift_repository.dart
# │   └── repositories/
# │       └── users_home_repository_impl.dart
# └── presentation/
#     └── notifiers/
#         └── users_home/
#             ├── index.dart
#             └── users_home_notifier.dart
```

### Step 3: Use the Service in Your Widget

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'src/application/users_home_notifier.dart';

class HomePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(usersHomeNotifierProvider);

    return userAsync.when(
      loading: () => CircularProgressIndicator(),
      data: (user) => Text(user.name),
      error: (error, stack) => Text('Error: $error'),
    );
  }
}
```

## Advanced Options

### Inject All Endpoints from a Service

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --all-methods
```

### Enable Local Caching with Drift

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --endpoint getUserById \
  --cache \
  --cache-keys id
```

### Enable PowerSync for Offline-First

```bash
wdev api integrate \
  --service orders \
  --page checkout \
  --feature dashboard \
  --endpoint createOrder \
  --powersync \
  --cache-keys id
```

### Register Tables in Core Database

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --endpoint getUserById \
  --cache \
  --cache-keys id \
  --register-db
```

## Dry Run Mode

Preview changes without writing files:

```bash
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --endpoint getUserById \
  --dry-run
```

## Complete Example

```bash
# Inject users service with caching into dashboard home feature
wdev api integrate \
  --service users \
  --page home \
  --feature dashboard \
  --endpoint getUserById \
  --cache \
  --cache-keys id \
  --register-db

# Output:
# ✓ Injected 1 endpoint(s) from "users" into dashboard/home

# Next steps:
# 1. Add to feature barrel:
#    export 'src/domain/models/index.dart';
#    export 'src/domain/repositories/index.dart';
#    export 'src/application/index.dart';
#    export 'src/presentation/notifiers/users_home/index.dart';
#    export 'src/data/local/index.dart';
#
# 2. Run code generation:
#    dart run build_runner build
```

## Options Reference

| Option | Description |
|--------|-------------|
| `--service, -s` | Service name (required) |
| `--page, -p` | Page name (required) |
| `--feature, -f` | Feature name (required) |
| `--endpoint, -e` | Endpoint method name |
| `--all-methods, -a` | Generate all endpoints |
| `--output, -o` | Output directory |
| `--cache, -c` | Enable Drift caching |
| `--powersync, -y` | Enable PowerSync |
| `--cache-keys` | Cache key fields |
| `--register-db, -R` | Register in app_database.dart |
| `--dry-run, -d` | Preview without writing |

## Troubleshooting

### Missing Endpoint

```
Error: Service "users" not found in config.yaml
```

**Solution**: Verify the service exists:
```bash
# Check config.yaml
cat config.yaml | grep services
```

### Invalid Cache Keys

```
Error: --cache-keys is required when --cache or --powersync is enabled
```

**Solution**: Provide cache key fields:
```bash
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id
```

## Related Documentation

- [Tutorial: Injecting Services](../../tutorial/api/injecting-services)
- [How-To: Configure Caching](./configure-caching)
- [How-To: Enable Offline-First](./offline-first)
