#!/usr/bin/env python3
"""
Script to update all test files to use the correct httpx.AsyncClient pattern.
"""

import os
import re

def update_test_file(file_path):
    """Update a single test file to use correct AsyncClient pattern."""
    with open(file_path, 'r') as f:
        content = f.read()

    # Check if file needs updating
    if 'async with AsyncClient(app=' not in content:
        return False

    print(f"Updating {file_path}...")

    # Add httpx import if not present
    if 'import httpx' not in content and 'from httpx import AsyncClient' in content:
        content = content.replace('from httpx import AsyncClient', 'import httpx')
    elif 'import httpx' not in content:
        # Add after pytest import
        content = re.sub(r'(import pytest\n)', r'\1import httpx\n', content)

    # Replace AsyncClient patterns
    pattern = r'async with AsyncClient\(app=(.*?), base_url="http://test"\) as client:'
    replacement = r'transport = httpx.ASGITransport(app=\1)\n    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:'
    content = re.sub(pattern, replacement, content)

    # Write updated content
    with open(file_path, 'w') as f:
        f.write(content)

    return True

def main():
    """Update all test files in the test_api directory."""
    test_dir = '/mnt/dev_drive/Repos/Cephadex_2/server/tests/test_api'

    updated_files = []

    for filename in os.listdir(test_dir):
        if filename.startswith('test_') and filename.endswith('.py'):
            file_path = os.path.join(test_dir, filename)
            if update_test_file(file_path):
                updated_files.append(filename)

    if updated_files:
        print(f"\nUpdated {len(updated_files)} files:")
        for filename in updated_files:
            print(f"  - {filename}")
    else:
        print("No files needed updating.")

if __name__ == "__main__":
    main()