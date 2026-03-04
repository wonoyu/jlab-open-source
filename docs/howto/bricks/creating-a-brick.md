# How to Create a New Mason Brick

This guide explains how to create a new mason brick for wdev_cli.

## Prerequisites

- `mason` CLI installed: `dart pub global activate mason_cli`
- Understanding of [Mason documentation](https://docs.brickhub.dev/)
- Understanding of wdev_cli architecture

## Step 1: Create Brick Directory

Create a new directory in `bricks/` with the brick name:

```bash
mkdir bricks/my_new_brick
```

## Step 2: Create brick.yaml

Create `bricks/my_new_brick/brick.yaml` with the following structure:

```yaml
name: my_new_brick
description: Brief description of what the brick does
version: 0.1.0

environment:
  mason: ^0.1.2

vars:
  variable_name:
    type: string
    description: Description of the variable
    default: default_value
    prompt: Prompt text for user input
```

### Variable Types

| Type | Description |
|------|-------------|
| `string` | Text input |
| `number` | Numeric input |
| `boolean` | True/false |
| `list` | Comma-separated list |

## Step 3: Create Template Structure

Create the `__brick__` directory with the generated file structure:

```bash
mkdir -p bricks/my_new_brick/__brick__/path/to/generated/files
```

### Template Variables

Use Mason template variables in file/folder names and content:

| Syntax | Description |
|--------|-------------|
| `{{project_name.snakeCase}}` | snake_case conversion |
| `{{feature_name.pascalCase}}` | PascalCase conversion |
| `{{variable_name.camelCase}}` | camelCase conversion |

Example:
```
bricks/my_new_brick/__brick__/features/{{feature_name.snakeCase}}/lib/{{feature_name.snakeCase}}.dart
```

## Step 4: Create Hooks (Optional)

Create `bricks/my_new_brick/hooks/` directory with:

### pre_gen.dart

Runs before template generation. Useful for validation.

```dart
import 'package:mason/mason.dart';

void run(HookContext context) {
  final projectName = context.vars['project_name'] as String;
  if (projectName.isEmpty) {
    throw Exception('project_name cannot be empty');
  }
}
```

### post_gen.dart

Runs after template generation. Useful for file updates that can't be done via templates.

```dart
import 'package:mason/mason.dart';

void run(HookContext context) {
  // Update files, run commands, etc.
}
```

### pubspec.yaml

For hook dependencies:

```yaml
name: my_new_brick_hooks
publish_to: none

environment:
  sdk: ^3.10.0

dependencies:
  mason: ^0.1.2
  mason_logger: ^0.3.3
```

## Step 5: Register Brick in mason.yaml

Add the brick to `mason.yaml` at the project root:

```yaml
bricks:
  my_new_brick:
    path: bricks/my_new_brick
```

## Step 6: Generate and Test

```bash
# Regenerate mason.lock
mason get

# Test the brick
mason make my_new_brick --variable_name value
```

## Step 7: Integrate with wdev_cli

### Update Command (if applicable)

If the brick is used by a wdev_cli command:

1. Update the command to call `mason make`
2. Pass variables from command arguments
3. Handle post-generation logic in the command

Example (from `add_feature_command.dart`):

```dart
final runner = const MasonRunner();
await runner.masonMake(
  brick: 'add_feature',
  args: {
    'project_name': projectName,
    'feature_name': featureName,
  },
  outputDirectory: outputDir,
);
```

## Brick Structure Checklist

```
bricks/`{brick_name}`/
├── __brick__/                    # Template files
│   └── ...
├── hooks/                        # Hook scripts (optional)
│   ├── pre_gen.dart
│   ├── post_gen.dart
│   └── pubspec.yaml
├── brick.yaml                    # Brick configuration
└── README.md                     # Reference documentation
```

## Best Practices

1. **Keep hooks empty**: Move complex logic to wdev_cli commands for better logging
2. **Use template variables**: Don't hardcode project/feature names
3. **Write tests**: Add `hooks/test/post_gen_test.dart`
4. **Document variables**: Complete description for each variable
5. **Follow naming conventions**: snake_case for files, PascalCase for classes

## See Also

- [Mason Documentation](https://docs.brickhub.dev/)
- [Existing Bricks Reference](../../reference/bricks/index.md)
- [Testing Bricks](./testing-a-brick.md)
