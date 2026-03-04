# How to Test a Mason Brick

This guide explains how to test mason bricks in wdev_cli.

## Testing Overview

Bricks can be tested at two levels:
1. **Hook tests**: Test pre/post generation logic
2. **Integration tests**: Test the full generation process

## Hook Testing

### Test Structure

```
bricks/`{brick_name}`/hooks/test/
└── post_gen_test.dart
```

### Example Test

```dart
import 'package:test/test.dart';

void main() {
  group('post_gen', () {
    test('runs successfully with valid input', () {
      // This is a placeholder - actual testing requires
      // running the hook with a generated context
      expect(true, true);
    });

    test('handles edge cases', () {
      expect(true, true);
    });
  });
}
```

### Running Hook Tests

```bash
cd bricks/`{brick_name}`/hooks
dart test
```

## Integration Testing

### Manual Integration Testing

```bash
# 1. Regenerate mason.lock
mason get

# 2. Test brick generation
mason make `{brick_name}` \
  --variable1 value1 \
  --variable2 value2 \
  --output-dir /tmp/test_output

# 3. Verify generated files
ls -la /tmp/test_output/

# 4. Clean up
rm -rf /tmp/test_output
```

### Using wdev_cli Commands

When the brick is integrated with wdev_cli:

```bash
# Example: Test add_feature brick
wdev add-feature --feature_name test_feature --project_name test_project

# Verify in generated project
ls features/
```

## Test Scenarios

### Variable Validation Tests

```dart
void run(HookContext context) {
  final projectName = context.vars['project_name'] as String;
  
  if (projectName.isEmpty) {
    throw Exception('project_name cannot be empty');
  }
  
  if (!RegExp(r'^[a-z][a-z0-9_]*$').hasMatch(projectName)) {
    throw Exception(
      'Invalid project name: "$projectName". '
      'Use lowercase letters, numbers, and underscores.',
    );
  }
}
```

### File Generation Tests

Verify that expected files are created:

```bash
# After running mason make
test -f output/path/to/file.dart && echo "File exists" || echo "File missing"
```

### Template Variable Tests

Verify variables are correctly applied:

```bash
# Check generated file contains expected content
grep "expected_content" output/path/to/file.dart
```

## Automated Testing in CI

Add brick tests to CI pipeline:

```yaml
# .github/workflows/test-bricks.yml
name: Test Bricks

on: [push, pull_request]

jobs:
  test-bricks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dart-lang/setup-dart@v1
      - name: Install Mason
        run: dart pub global activate mason_cli
      - name: Get Dependencies
        run: mason get
      - name: Test Each Brick
        run: |
          for brick in bricks/*/; do
            echo "Testing $(basename $brick)"
            mason make $(basename $brick) --output-dir /tmp/test
          done
```

## Test Checklist

- [ ] Hook logic tests pass
- [ ] Variables are correctly applied
- [ ] Generated file structure matches expected
- [ ] Template syntax is valid
- [ ] Integration with wdev_cli works
- [ ] Edge cases are handled

## Debugging Tips

### Verbose Output

```bash
mason make brick_name -v
```

### View Generated Files

```bash
# List all generated files
find /tmp/mason_output -type f
```

### Check Template Syntax

```bash
# Validate brick.yaml
mason validate
```

## See Also

- [Creating a New Brick](./creating-a-brick.md)
- [Modifying a Brick](./modifying-a-brick.md)
- [Mason Testing Documentation](https://docs.brickhub.dev/)
