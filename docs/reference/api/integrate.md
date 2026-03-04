---
id: api-integrate
title: API Integrate Command
sidebar_label: integrate
description: Inject an API service into a page with complete service layer
keywords:
  - wdev api integrate
  - service injection
  - repository layer
  - provider layer
  - offline caching
---

# wdev api integrate

Inject an API service into a page with complete service layer including models, providers, and repositories.

## Synopsis

```bash
wdev api integrate [options]
```

## Description

The `wdev api integrate` command creates a complete service layer for a feature by injecting an API service. This includes generating a repository layer, data providers, and integrating them with the feature's state management. The command supports optional caching with Drift local database and PowerSync for offline-first scenarios.

When executed, the command:
1. Locates the target feature and page
2. Generates a repository class for the service
3. Creates data providers for state management
4. Updates feature barrel files to export new components
5. Optionally sets up local caching with Drift
6. Optionally configures PowerSync for offline-first

:::info Complete Service Layer
This command generates a complete service layer including repository, providers, and state classes ready for use.
:::

## Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--service <name>` | `-s` | Service name to inject (required) |
| `--page <name>` | `-p` | Page name to inject into (required) |
| `--feature <name>` | `-f` | Feature name (required) |
| `--endpoint <name>` | `-e` | API endpoint method name |
| `--all-methods` | `-a` | Generate all endpoints from service |
| `--output <dir>` | `-o` | Output directory (default: `lib/src/features`) |
| `--dry-run` | `-d` | Preview changes without writing files |
| `--with-repository` | `-r` | Generate repository layer (default: true) |
| `--cache` | `-c` | Enable local caching with Drift |
| `--powersync` | `-y` | Enable PowerSync offline-first mode |
| `--cache-keys <keys>` | - | Comma-separated cache key fields |
| `--register-db` | `-R` | Register tables in core app_database.dart |
| `--help` | `-h` | Show help information |

## Examples

### Basic Usage

```bash
# Inject specific endpoint into a page
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById

# Short form
wdev api integrate -s users -p home -f dashboard -e getUserById

# Inject all endpoints from a service
wdev api integrate --service users --page home --feature dashboard --all-methods
```

### With Caching

```bash
# Enable local caching with Drift
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id

# Enable caching with database registration
wdev api integrate --service orders --page checkout --feature dashboard \
  --endpoint createOrder --cache --cache-keys id --register-db
```

### With PowerSync

```bash
# Enable PowerSync for offline-first
wdev api integrate --service products --page product_list --feature catalog \
  --endpoint listProducts --powersync

# PowerSync with caching
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --powersync --cache --cache-keys id
```

### Dry Run Mode

```bash
# Preview changes without writing files
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --dry-run
```

## Generated Service Layer

### Repository Class

```dart
// features/dashboard/lib/src/users/repository/users_repository.dart
import 'package:api/api.dart';
import 'package:core/core.dart';

class UsersRepository {
  UsersRepository({required UsersApi api}) : _api = api;

  final UsersApi _api;

  Future<Result<User, UserRepositoryError>> getUserById(int id) async {
    try {
      final response = await _api.getUserById(id);
      return Result.success(response);
    } catch (e) {
      return Result.failure(UserRepositoryError.fromException(e));
    }
  }

  Future<Result<List<User>, UserRepositoryError>> getUsers() async {
    try {
      final response = await _api.getUsers();
      return Result.success(response);
    } catch (e) {
      return Result.failure(UserRepositoryError.fromException(e));
    }
  }
}
```

### Provider Class

```dart
// features/dashboard/lib/src/users/providers/users_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:core/core.dart';
import '../repository/users_repository.dart';

final usersRepositoryProvider = Provider<UsersRepository>((ref) {
  final api = ref.read(usersApiProvider);
  return UsersRepository(api: api);
});

final userByIdProvider = FutureProvider.family<User, int>((ref, userId) async {
  final repository = ref.read(usersRepositoryProvider);
  final result = await repository.getUserById(userId);
  return result.fold(
    (user) => user,
    (error) => throw error,
  );
});

final usersProvider = FutureProvider<List<User>>((ref) async {
  final repository = ref.read(usersRepositoryProvider);
  final result = await repository.getUsers();
  return result.fold(
    (users) => users,
    (error) => throw error,
  );
});
```

### State Class (with Freezed)

```dart
// features/dashboard/lib/src/users/states/users_state.dart
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:api/api.dart';

part 'users_state.freezed.dart';

@freezed
class UsersState with _$UsersState {
  const factory UsersState({
    @Default([]) List<User> users,
    @Default(AsyncValue.loading()) AsyncValue loading,
    String? error,
  }) = _UsersState;

  factory UsersState.fromJson(Map<String, dynamic> json) =>
      _$UsersStateFromJson(json);
}
```

## Caching with Drift

### Entity Class

```dart
// features/dashboard/lib/src/users/data/user_entity.dart
import 'package:drift/drift.dart';
import 'package:api/api.dart';

class UsersTable extends Table {
  IntColumn get id => integer()();
  TextColumn get name => text()();
  TextColumn get email => text()();
  DateTimeColumn get createdAt => dateTime().nullable();

  @override
  Set<Column> get primaryKey => `{id}`;
}

extension UserMapper on User {
  UsersTableCompanion toCompanion() {
    return UsersTableCompanion(
      id: Value(id),
      name: Value(name),
      email: Value(email),
      createdAt: Value(createdAt),
    );
  }
}
```

### Cached Repository

```dart
// features/dashboard/lib/src/users/repository/users_repository.dart
class UsersRepository {
  UsersRepository({
    required UsersApi api,
    required AppDatabase database,
  })  : _api = api,
        _db = database;

  final UsersApi _api;
  final AppDatabase _db;

  Future<Result<User, UserRepositoryError>> getUserById(int id) async {
    try {
      // Check cache first
      final cached = await (_db.select(_db.usersTable)
            ..where((t) => t.id.equals(id)))
          .getSingleOrNull();

      if (cached != null) {
        return Result.success(cached.toUser());
      }

      // Fetch from API
      final response = await _api.getUserById(id);

      // Cache the result
      await _db.into(_db.usersTable).insert(response.toCompanion());

      return Result.success(response);
    } catch (e) {
      return Result.failure(UserRepositoryError.fromException(e));
    }
  }
}
```

## PowerSync Integration

### PowerSync Configuration

```dart
// features/dashboard/lib/src/users/powersync/users_powersync.dart
import 'package:powersync/powersync.dart';

class UsersPowerSync {
  Future<void> configure(PowerSyncDatabase database) async {
    // Define sync schema for users
    await database.createTable(
      '''
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        synced_at DATETIME
      )
      ''',
    );

    // Define sync rules
    await database.update(
      'INSERT INTO ps_sync_state(client_id, updated_at) VALUES(?, ?)',
      [await database.clientId(), DateTime.now()],
    );
  }
}
```

## Complete Workflow

```bash
# Step 1: Create and configure API service
wdev api add --name users
wdev api add-endpoint --source packages/api/lib/openapi/users
wdev api generate

# Step 2: Integrate service into feature
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id --register-db

# Step 3: Use the generated provider in UI
dart run build_runner build
```

## Dry Run Output

```bash
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --dry-run

# Output:
# [DRY RUN] Would create:
#   - features/dashboard/lib/src/users/repository/users_repository.dart
#   - features/dashboard/lib/src/users/providers/users_provider.dart
#   - features/dashboard/lib/src/users/states/users_state.dart
#
# Would update:
#   - features/dashboard/lib/src/users/users.dart (export)
#
# Would NOT modify any files (dry run mode)
```

## Feature Integration

After integration, the new components are automatically exported:

```dart
// features/dashboard/lib/src/users/users.dart
export 'repository/users_repository.dart';
export 'providers/users_provider.dart';
export 'states/users_state.dart';
```

## Using in Widgets

```dart
// features/dashboard/lib/src/home/presentation/pages/home_page.dart
class HomePage extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userByIdProvider(1));

    return userAsync.when(
      loading: () => CircularProgressIndicator(),
      error: (error) => Text('Error: $error'),
      data: (user) => UserProfileCard(user: user),
    );
  }
}
```

## Troubleshooting

### Service Not Found

Ensure the service has been generated:

```bash
# Check if service exists
ls packages/api/lib/src/users/

# Generate if missing
wdev api generate
```

### Feature Not Found

Verify the feature exists:

```bash
# Check if feature exists
ls features/dashboard/

# Create feature if missing
wdev feature add --project_name my_project --feature_name dashboard
```

### Endpoint Not Found

Ensure the endpoint exists in the generated API:

```dart
// packages/api/lib/src/users/users_api.dart
@GET('/users/`{id}`')
Future<User> getUserById(@Path('id') int userId);  // ← endpoint method
```

### Caching Issues

When using cache, ensure Drift is configured:

```bash
# Verify Drift configuration in pubspec.yaml
grep -A 5 "drift:" pubspec.yaml
```

## See Also

- [API Overview](overview.md) - Main API documentation
- [API Add](add.md) - Creating new API services
- [API Add-Endpoint](add-endpoint.md) - Adding endpoints to services
- [API Generate](generate.md) - Generating API clients
- [API Spec](spec.md) - Managing OpenAPI specifications
- [Feature Commands](../feature/overview.md) - Managing feature packages
