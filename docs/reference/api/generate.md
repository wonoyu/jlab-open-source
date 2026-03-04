---
id: api-generate
title: API Generate Command
sidebar_label: generate
description: Generate Retrofit API clients from OpenAPI specifications
keywords:
  - wdev api generate
  - Retrofit client generation
  - OpenAPI code generation
  - API client
---

# wdev api generate

Generate Retrofit API clients from OpenAPI specifications.

## Synopsis

```bash
wdev api generate [options]
```

## Description

The `wdev api generate` command reads OpenAPI specifications from the `packages/api/lib/openapi` directory and generates Retrofit API clients for each service. This command uses Retrofit code generation to create type-safe API client classes, model classes with Freezed, and necessary DI registrations.

When executed, the command:
1. Scans the OpenAPI directory for service specifications
2. Validates each OpenAPI spec for completeness
3. Generates Retrofit API client classes
4. Creates model classes with Freezed for immutability
5. Generates dependency injection registrations

:::important Run After Endpoint Changes
Always run this command after modifying OpenAPI specifications to regenerate clients and avoid compilation errors.
:::

## Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--verbose` | `-v` | Show detailed output during generation |
| `--help` | `-h` | Show help information |

## Examples

### Basic Usage

```bash
# Generate all API clients
wdev api generate

# Generate with verbose output
wdev api generate --verbose

# Short form
wdev api generate -v
```

## Generated Output

### API Client Class

For each service, a Retrofit API client is generated:

```dart
// packages/api/lib/src/users/users_api.dart
import 'package:retrofit/retrofit.dart';
import 'package:dio/dio.dart';
import 'user.dart';

part 'users_api.g.dart';

@RestApi(baseUrl: 'https://users-api.example.com')
abstract class UsersApi {
  factory UsersApi(Dio dio, {String baseUrl}) = _UsersApi;

  @GET('/users')
  Future<List<User>> getUsers();

  @GET('/users/`{id}`')
  Future<User> getUserById(@Path('id') int userId);

  @POST('/users')
  Future<User> createUser(@Body() CreateUserRequest request);

  @PUT('/users/`{id}`')
  Future<User> updateUser(
    @Path('id') int userId,
    @Body() UpdateUserRequest request,
  );

  @DELETE('/users/`{id}`')
  Future<void> deleteUser(@Path('id') int userId);
}
```

### Model Classes

Freezed model classes are generated for each schema:

```dart
// packages/api/lib/src/users/models/user.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required int id,
    required String name,
    required String email,
    @JsonKey(name: 'created_at') DateTime? createdAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

### Dependency Injection

DI registration files are generated for each service:

```dart
// packages/api/lib/src/users/users_api.di.dart
import 'package:dio/dio.dart';
import 'users_api.dart';

void registerUsersApi(GetIt locator) {
  locator.registerFactory<UsersApi>(
    () => UsersApi(locator<Dio>()),
  );
}
```

## Complete Workflow

```bash
# Step 1: Create a new API service
wdev api add --name users

# Step 2: Add endpoints to the service
wdev api add-endpoint --source packages/api/lib/openapi/users

# Step 3: Generate API clients (REQUIRED after adding endpoints)
wdev api generate

# Step 4: Integrate service into a feature
wdev api integrate --service users --page home --feature dashboard --endpoint getUserById
```

## Service Structure

After generation, the service structure looks like:

```
packages/api/lib/src/users/
├── users_api.dart              # Retrofit API client
├── users_api.g.dart            # Generated Retrofit code
├── users_api.di.dart           # DI registration
└── models/
    ├── user.dart               # User model
    ├── user.freezed.dart       # Freezed implementation
    ├── user.g.dart             # JSON serialization
    ├── create_user_request.dart
    └── update_user_request.dart
```

## Supported OpenAPI Features

### HTTP Methods

| Method | Annotation | Description |
|--------|------------|-------------|
| GET | `@GET('/path')` | Retrieve resources |
| POST | `@POST('/path')` | Create resources |
| PUT | `@PUT('/path')` | Replace resources |
| PATCH | `@PATCH('/path')` | Partial update |
| DELETE | `@DELETE('/path')` | Delete resources |

### Parameter Types

```dart
// Path parameters
@GET('/users/`{id}`')
Future<User> getUserById(@Path('id') int userId);

// Query parameters
@GET('/users')
Future<List<User>> getUsers(
  @Query('page') int page,
  @Query('limit') int limit,
);

// Header parameters
@GET('/users')
Future<List<User>> getUsers(
  @Header('Authorization') String token,
);

// Request body
@POST('/users')
Future<User> createUser(@Body() CreateUserRequest request);
```

### Response Types

```dart
// Single object
@GET('/users/`{id}`')
Future<User> getUserById(@Path('id') int userId);

// List of objects
@GET('/users')
Future<List<User>> getUsers();

// With custom wrapper
@GET('/users')
Future<ApiResponse<List<User>>> getUsers();
```

## Verbose Output

When `--verbose` is enabled, detailed generation information is displayed:

```bash
wdev api generate --verbose

# Output:
# Scanning OpenAPI specifications...
# Found 2 services: users, orders
#
# Generating users API client...
#   - Validating OpenAPI spec: packages/api/lib/openapi/users/users.yaml
#   - Generating Retrofit client: packages/api/lib/src/users/users_api.dart
#   - Generating models: packages/api/lib/src/users/models/
#   - Generating DI: packages/api/lib/src/users/users_api.di.dart
#   ✓ users API client generated successfully
#
# Generating orders API client...
#   - Validating OpenAPI spec: packages/api/lib/openapi/orders/orders.yaml
#   - Generating Retrofit client: packages/api/lib/src/orders/orders_api.dart
#   - Generating models: packages/api/lib/src/orders/models/
#   - Generating DI: packages/api/lib/src/orders/orders_api.di.dart
#   ✓ orders API client generated successfully
#
# Generation complete: 2 services processed
```

## Error Handling

### Missing OpenAPI Spec

If no OpenAPI specifications are found:

```bash
wdev api generate

# Output:
# ERROR: No OpenAPI specifications found in packages/api/lib/openapi
# Hint: Create a service first with 'wdev api add --name <service_name>'
```

### Invalid OpenAPI Spec

If an OpenAPI specification is invalid:

```bash
wdev api generate

# Output:
# ERROR: Invalid OpenAPI specification in packages/api/lib/openapi/users/users.yaml
# Details: Missing required field 'paths' at line 42
```

### Generation Errors

If code generation fails:

```bash
wdev api generate --verbose

# Output:
# ERROR: Failed to generate users API client
# Details: Retrofit code generation failed
# Hint: Ensure all schema references are valid in the OpenAPI spec
```

## Integration with Build Runner

After generating API clients, run build_runner to complete the Freezed and Retrofit code generation:

```bash
# Generate .g.dart files
dart run build_runner build

# Or use build_runner in watch mode during development
dart run build_runner watch
```

## See Also

- [API Overview](overview.md) - Main API documentation
- [API Add](add.md) - Creating new API services
- [API Add-Endpoint](add-endpoint.md) - Adding endpoints to services
- [API Integrate](integrate.md) - Injecting services into features
- [API Spec](spec.md) - Managing OpenAPI specifications
