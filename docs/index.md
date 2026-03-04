---
id: intro
title: wdev_cli Documentation
sidebar_label: Introduction
description: Official documentation for wdev_cli - A powerful CLI tool for scaffolding and managing Flutter monorepo projects
keywords:
  - wdev_cli
  - Flutter CLI
  - monorepo
  - code generation
---

# wdev_cli Documentation

Welcome to the official documentation for **wdev_cli**, a powerful CLI tool for scaffolding and managing Flutter monorepo projects.

## Overview

wdev_cli provides a comprehensive set of commands for:

- **Project Management**: Initialize and create Flutter monorepo projects
- **Feature Management**: Add features with navigation support
- **Page Management**: Add pages to features with routing
- **API Integration**: Manage API services, endpoints, and code generation
- **Routing**: Automated route management with go_router
- **Project Setup**: Configure flavors, splash screens, Firebase, and more

## Quick Start

### Installation

```bash
# Activate from pub.dev
dart pub global activate wdev_cli

# Verify installation
wdev --help
```

### Basic Workflow

```bash
# Initialize a new project
wdev project init

# Add a feature
wdev feature add --project_name my_project --feature_name todos

# Add a page to the feature
wdev page add --feature todos --name TodoList

# Add API service
wdev api add --name users

# Generate API clients
wdev api generate
```

## Commands

| Category | Commands |
|----------|----------|
| [Project](category/project) | `init`, `create` |
| [Feature](category/feature) | `add` |
| [Page](category/page) | `add` |
| [API](api/overview) | `add`, `add-endpoint`, `generate`, `integrate`, `spec` |
| [Routing](category/routing) | `create`, `generate` |
| [Setup](category/setup) | `flavors`, `splash`, `firebase`, `powersync`, `cicd`, `env` |
| [Update](category/update) | `update` |

## Features

### Monorepo Support

wdev_cli is designed for Flutter monorepo architectures:

```
my_project/
├── apps/
│   ├── web/
│   ├── mobile/
│   └── desktop/
├── packages/
│   ├── api/
│   ├── core/
│   └── shared/
└── features/
    ├── todos/
    ├── user_profile/
    └── settings/
```

### Code Generation

- **Mason Bricks**: Template-based code generation
- **Freezed**: Immutable data classes
- **Retrofit**: Type-safe HTTP clients
- **Go Router**: Type-safe routing with `@TypedGoRoute`

### State Management

Built-in support for popular state management solutions:

- **Riverpod**: Provider-based state management
- **Bloc**: Event-driven state management
- **Drift**: Local database with caching
- **PowerSync**: Offline-first synchronization

## Installation

### Prerequisites

- Dart SDK 3.10.0 or higher
- Flutter SDK 3.38.2 or higher
- Git

### Activation

```bash
# From pub.dev
dart pub global activate wdev_cli

# From local source
dart pub global activate --source path /path/to/wdev_cli

# Verify installation
wdev --version
```

### Update

```bash
# Update to latest version
wdev update

# Update from local source
wdev update --local
```

## Project Structure

```
wdev_cli/
├── bin/
│   └── wdev_cli.dart      # Executable entry point
├── lib/
│   ├── wdev_cli.dart      # Library export
│   └── src/
│       ├── commands/      # Command implementations
│       ├── config/        # Configuration handling
│       └── utils/         # Utility classes
├── test/                  # Unit tests
└── bricks/                # Mason brick templates
```

## Configuration

### config.yaml

Create a `config.yaml` in your project root:

```yaml
project:
  name: my_project
  description: My Flutter monorepo project

flavors:
  dev:
    name: Development
    envFile: .env.dev
  staging:
    name: Staging
    envFile: .env.staging
  prod:
    name: Production
    envFile: .env.prod

features:
  - todos
  - user_profile
  - settings
```

## Getting Help

### View Command Help

```bash
# General help
wdev --help

# Specific command help
wdev api --help
wdev feature --help
wdev page --help
```

### Troubleshooting

```bash
# Run with verbose output
wdev feature add --project_name my_project --feature_name todos --verbose

# Check version
wdev --version

# Report issues
# https://github.com/yourusername/wdev_cli/issues
```

## Contributing

Contributions are welcome! Please read our [contributing guide](https://github.com/yourusername/wdev_cli/blob/main/CONTRIBUTING.md) for details.

## License

wdev_cli is licensed under the MIT License. See [LICENSE](https://github.com/yourusername/wdev_cli/blob/main/LICENSE) for details.

## Related Links

- [GitHub Repository](https://github.com/yourusername/wdev_cli)
- [Pub.dev Package](https://pub.dev/packages/wdev_cli)
- [Issue Tracker](https://github.com/yourusername/wdev_cli/issues)
- [Changelog](https://github.com/yourusername/wdev_cli/blob/main/CHANGELOG.md)
