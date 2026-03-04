---
id: api-explanation-architecture
title: API Architecture
sidebar_label: Architecture
sidebar_position: 1
sidebar_class_name: category-api-explanation
---

# API Integration Architecture

Understand the design principles and architecture behind the wdev API integration system.

## Overview

The API integration system follows a **clean architecture** approach with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Feature Layer                            │
│         (Pages, Notifiers, UI Components)                   │
│                                                             │
│  Responsibilities:                                          │
│  - Display data to users                                    │
│  - Handle user interactions                                 │
│  - Manage local widget state                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Layer                           │
│            (Use Cases, Service Interfaces)                  │
│                                                             │
│  Responsibilities:                                          │
│  - Coordinate between domain and presentation               │
│  - Implement business logic                                 │
│  - Define service contracts                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Domain Layer                              │
│            (Models, Repository Interfaces)                  │
│                                                             │
│  Responsibilities:                                          │
│  - Define business entities                                 │
│  - Define repository interfaces                             │
│  - Pure business logic                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                │
│         (Repositories, API Clients, Local Cache)          │  Responsibilities:                                          │
│  │
│                                                             │
 - Implement repository interfaces                          │
│  - Manage local database (Drift/PowerSync)                  │
│  - Handle API communication                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Layer                                  │
│              (Retrofit Clients, OpenAPI)                    │
│                                                             │
│  Responsibilities:                                          │
│  - HTTP communication                                       │
│  - Serialization/deserialization                            │
│  - API contract definition                                  │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### 1. Dependency Inversion

Lower layers depend on abstractions defined in upper layers:

```dart
// Domain layer defines the interface
abstract class UserRepository {
  Future<User> getUserById(String id);
}

// Data layer implements the interface
class UserRepositoryImpl implements UserRepository {
  final UsersApiClient _apiClient;
  final UserDao _dao;

  @override
  Future<User> getUserById(String id) async {
    // Implementation
  }
}
```

### 2. Per-Flavor Configuration

Service URLs are configured per-flavor using environment variables:

```yaml
# config.yaml
flavors:
  development:
    name: Development
    envFile: .env.dev
  staging:
    name: Staging
    envFile: .env.staging
  production:
    name: Production
    envFile: .env.prod
```

```bash
# .env.development
USERS_SERVICE_URL=http://localhost:8080

# .env.production
USERS_SERVICE_URL=https://api.example.com
```

### 3. Namespace-Based File Organization

Each service injection creates a unique namespace to prevent file collisions:

```
# Service: users, Page: home
├── users_home_notifier.dart
├── users_home_user_model.dart
├── users_home_repository_interface.dart
├── users_home_repository_impl.dart
└── users_home_drift_repository.dart
```

### 4. Offline-First Support

The architecture supports offline-first applications through PowerSync integration:

```
Online Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI Layer   │────▶│   API Layer  │────▶│   Server     │
└──────────────┘     └──────────────┘     └──────────────┘

Offline Flow:
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI Layer   │────▶│   Cache      │────▶│   Local DB   │
└──────────────┘     │   Layer      │     │   (Drift)    │
                     └──────────────┘     └──────────────┘
```

## File Generation Strategy

### Template-Based Generation

The system uses Mason bricks for code generation:

| Brick | Purpose |
|-------|---------|
| `add_api` | Generate service layer for API integration |
| `add_feature` | Generate feature packages |
| `add_page` | Generate feature pages |

### Generated Artifacts

For each `wdev api integrate` call, the following are generated:

1. **Domain Layer**
   - Model class (freezed)
   - Repository interface

2. **Data Layer**
   - Repository implementation
   - Drift table (if caching enabled)
   - PowerSync table (if powersync enabled)

3. **Application Layer**
   - Riverpod notifier (StateNotifier)
   - Provider dependency

4. **Configuration**
   - `api_integrations.yaml` tracking

## Error Handling

The system uses a consistent error handling pattern:

```dart
@override
Future<int> run() async {
  try {
    // ... main logic
    logger.success('Action completed!');
    return 0;
  } catch (e) {
    logger.err('$e');
    return 1;
  }
}
```

## Related Documentation

- [API Overview](../api/overview.md)
- [How-To Guides](../../howto/api/index.md)
- [Reference: Commands](../../reference/api/commands.md)
- [Tutorial: Getting Started](../../tutorial/api/getting-started.md)
