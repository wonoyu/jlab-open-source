---
id: api-add-endpoint
title: API Add-Endpoint Command
sidebar_label: add-endpoint
description: Add API endpoints from JSON definition files
keywords:
  - wdev api add-endpoint
  - endpoint definition
  - OpenAPI paths
  - JSON endpoint structure
---

# wdev api add-endpoint

Add API endpoints from JSON definition files to an existing API service.

## Synopsis

```bash
wdev api add-endpoint [options]
```

## Description

The `wdev api add-endpoint` command reads endpoint definitions from JSON files and adds them to an existing API service's OpenAPI specification. This command supports single files, directories, and includes validation and watch mode for development.

When executed, the command:
1. Locates the target service's OpenAPI specification
2. Reads endpoint definitions from JSON files
3. Validates the JSON structure
4. Merges endpoints into the main OpenAPI spec
5. Optionally watches for file changes and regenerates

:::tip Development Workflow
Use `--watch` mode during development to automatically regenerate OpenAPI specs when endpoint files are modified.
:::

## Options

| Option | Abbreviation | Description |
|--------|--------------|-------------|
| `--source <path>` | `-s` | Path to endpoint JSON file or directory (required) |
| `--service <name>` | `-v` | Service name for OpenAPI spec (auto-detected if not provided) |
| `--watch` | `-w` | Watch for changes and regenerate on save |
| `--validate` | `-V` | Validate JSON files without generating YAML |
| `--help` | `-h` | Show help information |

## Examples

### Basic Usage

```bash
# Add endpoints from a single JSON file
wdev api add-endpoint --source users/get_users.json --service users

# Auto-detect service from file path
wdev api add-endpoint --source packages/api/lib/openapi/users/get_users.json

# Short form
wdev api add-endpoint -s users/get_users.json -v users
```

### Directory-Based Workflow

```bash
# Add all endpoints from a service directory
wdev api add-endpoint --source packages/api/lib/openapi/users

# Add endpoints from a specific subdirectory
wdev api add-endpoint --source packages/api/lib/openapi/users/paths
```

### Watch Mode

```bash
# Watch for changes and regenerate automatically
wdev api add-endpoint --source packages/api/lib/openapi/users --watch

# Watch with verbose output
wdev api add-endpoint --source packages/api/lib/openapi/users --watch --verbose
```

### Validation Mode

```bash
# Validate JSON files without modifying OpenAPI specs
wdev api add-endpoint --source users/endpoints.json --validate
```

## Endpoint JSON Structure

### Basic Endpoint Definition

```json
{
  "summary": "Get all users",
  "description": "Retrieves a paginated list of users",
  "operationId": "getUsers",
  "tags": ["users"],
  "parameters": [],
  "responses": {
    "200": {
      "description": "Successful response",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/UserListResponse"
          }
        }
      }
    }
  }
}
```

### Endpoint with Path Parameters

```json
{
  "summary": "Get user by ID",
  "description": "Retrieves a specific user by their ID",
  "operationId": "getUserById",
  "tags": ["users"],
  "parameters": [
    {
      "name": "userId",
      "in": "path",
      "required": true,
      "schema": {
        "type": "integer",
        "format": "int64"
      }
    }
  ],
  "responses": {
    "200": {
      "description": "Successful response",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/User"
          }
        }
      }
    },
    "404": {
      "description": "User not found"
    }
  }
}
```

### Endpoint with Request Body

```json
{
  "summary": "Create a new user",
  "description": "Creates a new user with the provided information",
  "operationId": "createUser",
  "tags": ["users"],
  "requestBody": {
    "required": true,
    "content": {
      "application/json": {
        "schema": {
          "$ref": "#/components/schemas/CreateUserRequest"
        }
      }
    }
  },
  "responses": {
    "201": {
      "description": "User created successfully",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/User"
          }
        }
      }
    }
  }
}
```

## File Organization

### Recommended Structure

```
packages/api/lib/openapi/users/
├── users.yaml              # Main OpenAPI spec
└── paths/
    ├── get_users.json
    ├── get_user_by_id.json
    ├── create_user.json
    ├── update_user.json
    └── delete_user.json
```

### Batch Endpoint Files

You can organize endpoints in subdirectories:

```
packages/api/lib/openapi/users/
├── users.yaml
└── paths/
    ├── users/
    │   ├── get_users.json
    │   └── search_users.json
    └── admin/
        ├── create_admin.json
        └── get_admin_stats.json
```

## Generated OpenAPI Paths

After adding endpoints, the OpenAPI spec's paths section is generated:

```yaml
paths:
  /users:
    get:
      summary: Get all users
      description: Retrieves a paginated list of users
      operationId: getUsers
      tags:
        - users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
  /users/`{userId}`:
    get:
      summary: Get user by ID
      description: Retrieves a specific user by their ID
      operationId: getUserById
      tags:
        - users
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: integer
            format: int64
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
```

## Validation

### JSON Schema Validation

The command validates JSON files against OpenAPI 3.0 schema:

- **Required fields**: `operationId`, `responses`
- **Valid values**: HTTP methods, status codes, parameter locations
- **References**: Schema references are validated for existence

### Validation Errors

```bash
# Example: Missing required field
wdev api add-endpoint --source invalid.json --validate

# Output:
# ERROR: Missing required field 'operationId' in get_users.json
# ERROR: Missing required field 'responses' in get_users.json
```

## Auto-Detection of Service

When `--service` is not provided, the command attempts to auto-detect the service name from the source path:

```bash
# Source: packages/api/lib/openapi/users/get_users.json
# Auto-detected service: users
wdev api add-endpoint --source packages/api/lib/openapi/users/get_users.json

# Source: packages/api/lib/openapi/orders/create_order.json
# Auto-detected service: orders
wdev api add-endpoint --source packages/api/lib/openapi/orders/create_order.json
```

## Watch Mode

When `--watch` is enabled, the command:

1. Monitors the source path for file changes
2. Regenerates OpenAPI specs on file save
3. Displays status for each change
4. Continues running until interrupted (Ctrl+C)

```bash
# Start watch mode
wdev api add-endpoint --source packages/api/lib/openapi/users --watch

# Output:
# Watching for changes in packages/api/lib/openapi/users...
# Changed: paths/get_users.json → Regenerated users.yaml
# Changed: paths/create_user.json → Regenerated users.yaml
# Changed: paths/delete_user.json → Regenerated users.yaml
# ^C to stop watching
```

## Troubleshooting

### Service Not Found

Ensure the service exists before adding endpoints:

```bash
# First create the service
wdev api add --name users

# Then add endpoints
wdev api add-endpoint --source users/endpoints.json --service users
```

### Invalid JSON

Validate JSON files before running the command:

```bash
# Validate without generating
wdev api add-endpoint --source users/endpoints.json --validate
```

### Path Not Found

Verify the source path exists:

```bash
# Check path exists
ls packages/api/lib/openapi/users/

# Use absolute path if needed
wdev api add-endpoint --source /full/path/to/users/endpoints.json
```

## See Also

- [API Overview](overview.md) - Main API documentation
- [API Add](add.md) - Creating new API services
- [API Generate](generate.md) - Generating API clients
- [API Integrate](integrate.md) - Injecting services into features
- [API Spec](spec.md) - Managing OpenAPI specifications
