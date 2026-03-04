---
id: api-explanation-index
title: API Explanations
sidebar_label: Explanations
sidebar_position: 1
sidebar_class_name: category-api-explanation
---

# API Integration Explanations

Conceptual documentation and in-depth explanations of the wdev API integration system.

## Topics

| Topic | Description |
|-------|-------------|
| [Architecture](./architecture) | Understand the design principles and layers |
| [FAQ](./faq) | Frequently asked questions |
| [Troubleshooting](./troubleshooting) | Solutions to common issues |

## Understanding the Architecture

The API integration system follows clean architecture principles with clear separation of concerns. Understanding this architecture helps you:

- Make better use of generated code
- Customize integrations effectively
- Debug issues more efficiently
- Extend functionality when needed

## Key Concepts

### Service Layer Pattern

Each API service injection creates a complete service layer:

- **Domain models** - Business entities
- **Repository pattern** - Data access abstraction
- **Riverpod providers** - State management
- **Local caching** - Offline support

### OpenAPI-Driven Development

The system uses OpenAPI specifications as the single source of truth:

- API contract first approach
- Automated client generation
- Type-safe client code
- Self-documenting APIs

### Flavor-Based Configuration

Different environments use different configurations:

- Development (localhost)
- Staging (pre-production)
- Production (live API)

## When to Use This Documentation

Use the explanations section when you want to:

- Understand how things work under the hood
- Learn best practices and patterns
- Diagnose and fix issues
- Extend or customize the system

## Related Documentation

- [API Overview](../api/overview.md)
- [Tutorials](../../tutorial/api/index.md)
- [How-To Guides](../../howto/api/index.md)
- [Command Reference](../../reference/api/commands.md)
