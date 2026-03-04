# How to Modify an Existing Mason Brick

This guide explains how to modify existing mason bricks in wdev_cli.

## Common Modification Types

1. **Add new variables**: Extend brick functionality
2. **Update template files**: Change generated code
3. **Modify hooks**: Update pre/post generation logic
4. **Add dependencies**: Update pubspec.yaml

## Adding a New Variable

### Step 1: Update brick.yaml

Add the variable definition:

```yaml
vars:
  existing_variable:
    type: string
    # ... existing config
  new_variable:
    type: boolean
    description: Enable new feature
    default: false
    prompt: Enable new feature?
```

### Step 2: Update Templates

Use the variable in template files:

```dart
// In template file
{{#if new_variable}}
// New feature code
{{/if}}
```

### Step 3: Update Hooks (if needed)

If the variable affects hook logic:

```dart
void run(HookContext context) {
  final newEnabled = context.vars['new_variable'] as bool;
  if (newEnabled) {
    // Additional logic
  }
}
```

## Updating Template Files

### Direct Updates

Modify files in `__brick__/` directly:

```bash
# Example: Update the generated page template
edit bricks/add_page/__brick__/features/{`{feature_name}`}/lib/{`{page_name}`}/src/presentation/pages/{`{page_name}`}_page.dart
```

### Variable Updates

When renaming variables, update all occurrences:

```bash
# Use Mason variables with different case conversions
{{old_name.snakeCase}} → {{new_name.snakeCase}}
```

## Modifying Hooks

### Understanding Hook Logic

Most hooks in wdev_cli are intentionally empty - logic is in wdev_cli commands. If you need to modify hook logic:

1. Check if the logic should stay in the hook or move to the command
2. Update `hooks/post_gen.dart` or `hooks/pre_gen.dart`
3. Update hook dependencies in `hooks/pubspec.yaml`

### Example: Adding Validation

```dart
import 'package:mason/mason.dart';

void run(HookContext context) {
  final featureName = context.vars['feature_name'] as String;
  
  // Validate feature name
  if (!RegExp(r'^[a-z][a-z0-9_]*$').hasMatch(featureName)) {
    throw Exception(
      'Invalid feature name: "$featureName". '
      'Use lowercase letters, numbers, and underscores only.',
    );
  }
}
```

## Adding Dependencies

### Update Hook Dependencies

Edit `hooks/pubspec.yaml`:

```yaml
dependencies:
  mason: ^0.1.2
  mason_logger: ^0.3.3
  yaml_edit: ^2.2.3  # New dependency
```

### Update Template Dependencies

Edit `__brick__/path/to/pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  new_package: ^1.0.0  # Add new dependency
```

## Testing Changes

### Manual Testing

```bash
# Regenerate mason.lock
mason get

# Test with sample values
mason make brick_name --variable1 value1 --variable2 value2
```

### Automated Testing

Add or update `hooks/test/post_gen_test.dart`:

```dart
import 'package:test/test.dart';

void main() {
  group('post_gen', () {
    test('runs successfully', () {
      // Test hook execution
    });
  });
}
```

## Brick Modification Checklist

- [ ] Update `brick.yaml` with new variables
- [ ] Update template files in `__brick__/`
- [ ] Update hooks if needed
- [ ] Update `hooks/pubspec.yaml` for new dependencies
- [ ] Test the brick manually
- [ ] Update brick README.md
- [ ] Run `mason get` to regenerate lock file

## Version Bumping

When making breaking changes, update the brick version in `brick.yaml`:

```yaml
version: 0.2.0  # Increment from 0.1.0
```

Follow semantic versioning:
- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

## See Also

- [Creating a New Brick](./creating-a-brick.md)
- [Testing Bricks](./testing-a-brick.md)
- [Mason Variables](https://docs.brickhub.dev/brick-yaml#variables)
