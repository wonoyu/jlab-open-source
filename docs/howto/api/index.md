---
id: api-howto-index
title: API How-To Guides
sidebar_label: How-To Guides
sidebar_position: 1
sidebar_class_name: category-api-howto
---

# API Integration How-To Guides

Practical guides for accomplishing specific tasks with the wdev API integration system.

:::warning
How-to guides assume you understand the basics. If you're new, start with the [tutorials](../../tutorial/api/index.md).
:::

## How-To Guides

| Guide | Description |
|-------|-------------|
| [Add a New Service](./add-service) | Create a new API service with configuration |
| [Add Endpoints](./add-endpoints) | Add endpoints from JSON or OpenAPI files |
| [Generate API Clients](./generate-clients) | Generate Retrofit clients from OpenAPI specs |
| [Inject Services](./inject-services) | Inject API services into feature pages |
| [Configure Caching](./configure-caching) | Set up Drift local caching |
| [Enable Offline-First](./offline-first) | Configure PowerSync for offline-first apps |
| [Export OpenAPI Specs](./export-specs) | Export specs to JSON format |
| [Migrate Specifications](./migrate-specs) | Migrate from monolithic to service-specific specs |

## Common Tasks

### Service Management

- [Add a new API service](./add-service)
- [Configure per-flavor URLs](./configure-flavor-urls)
- [Update existing service configuration](./update-service)

### Endpoint Management

- [Add endpoints from JSON files](./add-endpoints)
- [Add endpoints from OpenAPI YAML](./add-openapi-endpoints)
- [Validate endpoint definitions](./validate-endpoints)

### Client Generation

- [Generate Retrofit clients](./generate-clients)
- [Regenerate after spec changes](./regenerate-clients)
- [Configure generator options](./configure-generator)

### Service Injection

- [Inject a single endpoint](./inject-services)
- [Inject all endpoints from a service](./inject-all-endpoints)
- [Add caching to injected services](./configure-caching)
- [Enable PowerSync for offline access](./offline-first)

### Specification Management

- [Export specs to JSON](./export-specs)
- [Migrate monolithic specs](./migrate-specs)
- [Validate OpenAPI specifications](./validate-specs)

## Related Resources

- [Tutorial: Getting Started](../../tutorial/api/getting-started)
- [Reference: Command Options](../../reference/commands)
- [Explanation: Architecture](../explanation/architecture)
