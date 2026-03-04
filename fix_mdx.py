#!/usr/bin/env python3
"""Fix all curly brace placeholders in markdown files for MDX compatibility"""

import re
import os


def fix_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Find ALL {word} patterns and wrap them in backticks
    # This regex matches {word} where word is alphanumeric/underscore
    # and it's NOT already inside backticks

    # Replace {word} with `{word}` globally
    # But be careful to not break existing backticks
    content = re.sub(r"\{([a-zA-Z_][a-zA-Z0-9_]*)\}", r"`{\1}`", content)

    # Fix double backticks that may have been created
    content = content.replace("``{", "`{")
    content = content.replace("}`", "}`")

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False


def main():
    docs_dir = "docs"
    fixed_count = 0

    for root, dirs, files in os.walk(docs_dir):
        for file in files:
            if file.endswith(".md"):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    fixed_count += 1
                    print(f"Fixed: {filepath}")

    print(f"\nTotal files fixed: {fixed_count}")


if __name__ == "__main__":
    main()
