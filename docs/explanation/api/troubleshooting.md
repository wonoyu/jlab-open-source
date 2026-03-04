---
id: api-explanation-troubleshooting
title: API Troubleshooting
sidebar_label: Troubleshooting
sidebar_position: 3
sidebar_class_name: category-api-explanation
---

# API Integration Troubleshooting

Solutions to common issues encountered when using the wdev API integration system.

## Common Errors

### "Service name must be snake_case"

**Error:**
```
Error: Invalid service name. Use snake_case (e.g., users, orders)
```

**Cause:** Service names must follow snake_case convention.

**Solution:** Use lowercase with underscores:

```bash
# Valid service names
wdev api add --name users
wdev api add --name order_notifications
wdev api add --name product_catalog

# Invalid service names
wdev api add --name Users
wdev api add --name users-service
wdev api add --name usersService
```

---

### "packages/api directory not found"

**Error:**
```
Error: packages/api directory not found.
```

**Cause:** The API package structure is missing.

**Solution:** Create the required structure:

```bash
mkdir -p packages/api/lib
```

Or initialize a new API package:

```bash
dart create -t package packages/api
```

---

### "No services defined in config.yaml"

**Error:**
```
Warn: No services defined in config.yaml
```

**Cause:** The config.yaml file has no services configured.

**Solution:** Add services to your config.yaml:

```yaml
# config.yaml
services:
  users:
    openapi_spec: packages/api/lib/openapi/users/users.yaml
  orders:
    openapi_spec: packages/api/lib/openapi/orders/orders.yaml
```

---

### "--cache-keys is required when --cache is enabled"

**Error:**
```
Error: --cache-keys is required when --cache or --powersync is enabled.
```

**Cause:** Cache keys are required for Drift/PowerSync integration.

**Solution:** Provide cache key fields:

```bash
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --cache --cache-keys id
```

For multiple keys:

```bash
wdev api integrate --service orders --page checkout --feature dashboard \
  --endpoint getOrder --cache --cache-keys id,orderNumber
```

---

### "Service not found in config.yaml"

**Error:**
```
Warn: Service "users" not found in config.yaml
```

**Cause:** The specified service is not configured.

**Solution:** Verify the service exists:

```bash
cat config.yaml | grep services
```

Or add the service:

```bash
wdev api add --name users
```

---

### build_runner Build Failures

**Error:**
```
Target of URI hasn't been generated: 'package:api/src/generated/users/users_api.g.dart'
```

**Cause:** Generated files are missing.

**Solution:** Run build_runner:

```bash
cd packages/api
dart run build_runner build
```

If still failing, try a clean build:

```bash
dart run build_runner clean
dart run build_runner build
```

---

### OpenAPI Specification Validation Errors

**Error:**
```
Error: Invalid OpenAPI specification
```

**Cause:** The OpenAPI spec has syntax or structure errors.

**Solution:** Validate your specification:

```bash
# Check YAML syntax
yamllint packages/api/lib/openapi/users/users.yaml

# Validate OpenAPI structure
npx @apidevtools/swagger-cli validate packages/api/lib/openapi/users/users.yaml
```

Common issues:
- Missing required fields (info, paths)
- Invalid schema references
- Incorrect data types

---

### Retrofit Generation Errors

**Error:**
```
Error: Could not generate @RestApi annotations
```

**Cause:** OpenAPI specification issues.

**Solution:** Check for:
1. Invalid HTTP methods
2. Missing path definitions
3. Incorrect parameter definitions

Example fix:

```yaml
# Incorrect
paths:
  /users:  # Missing HTTP method
    getUsers:

# Correct
paths:
  /users:
    get:
      operationId: listUsers
      responses:
        '200':
          description: Success
```

---

### Environment Variable Issues

**Error:**
```
Error: Environment variable 'USERS_SERVICE_URL' not found
```

**Cause:** Missing or misconfigured environment variable.

**Solution:** Check your .env files:

```bash
# .env.development
USERS_SERVICE_URL=http://localhost:8080
```

Ensure envied is generated:

```bash
cd packages/api
dart run build_runner build
```

---

### Circular Dependency Errors

**Error:**
```
Error: Circular dependency detected in api_module.dart
```

**Cause:** Incorrect dependency injection ordering.

**Solution:** Review your `api_module.dart`:

```dart
@lazySingleton
UsersClient usersClient(Dio dio, Env env) {
  return UsersClient(dio, baseUrl: env.usersServiceUrl ?? '');
}

@lazySingleton
UsersRepository usersRepository(UsersClient client) {
  return UsersRepositoryImpl(client);
}
```

Ensure dependencies are registered in correct order.

---

### Drift Table Conflicts

**Error:**
```
Error: Table 'users_home' already exists in app_database.dart
```

**Cause:** Duplicate table names.

**Solution:** Use unique namespaces for each injection:

```bash
# First injection
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById

# Second injection (different page)
wdev api integrate --service users --page profile --feature dashboard \
  --endpoint getUserProfile
```

This creates unique table names: `users_home` and `users_profile`.

---

### Watch Mode Not Working

**Error:** Changes not being detected in watch mode.

**Cause:** File watching not properly configured.

**Solution:**
1. Check that file paths are correct
2. Ensure files are saved
3. Try restarting watch mode:

```bash
# Stop existing watch (Ctrl+C)
wdev api add-endpoint --source packages/api/lib/openapi --watch
```

---

### Slow Build Times

**Cause:** Large number of generated files or complex specifications.

**Solution:**
1. Use build_runner with caching:

```bash
dart run build_runner build --define=source_gen:conflicting_branches=ignore
```

2. Split large OpenAPI specs into smaller service-specific files:

```bash
wdev api spec migrate
```

3. Use `--verbose` to identify bottlenecks:

```bash
wdev api generate --verbose
```

---

## Debug Mode

### Enable Verbose Logging

```bash
wdev api add --name users --verbose
wdev api generate --verbose
```

### Dry Run Mode

Preview changes without writing files:

```bash
wdev api integrate --service users --page home --feature dashboard \
  --endpoint getUserById --dry-run
```

### Validate Only Mode

Check specifications without generating:

```bash
wdev api add-endpoint --source path/to/endpoints --validate
```

---

## Getting Help

### Check Logs

Review command output for detailed error messages.

### Search Existing Issues

- [GitHub Issues](https://github.com/yourusername/wdev_cli/issues)
- [Discord Community](https://discord.gg/wdev_cli)

### Create a New Issue

If you find a bug:

1. Search existing issues first
2. Include reproduction steps
3. Add error output
4. Include your environment:
   - Flutter version
   - Dart version
   - wdev_cli version
   - Operating system

---

## Related Documentation

- [API FAQ](./faq.md)
- [Architecture Explanation](./architecture.md)
- [Command Reference](../../reference/api/commands.md)
- [How-To Guides](../../howto/api/index.md)
