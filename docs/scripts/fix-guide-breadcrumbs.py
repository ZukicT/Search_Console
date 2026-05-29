#!/usr/bin/env python3
"""Remove guides hub from breadcrumb JSON-LD and related links on guide pages."""

from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
GUIDES = DOCS / "guides"

GUIDES_HUB_CRUMB = re.compile(
    r"\s*\{\s*"
    r'"@type": "ListItem",\s*'
    r'"position": 2,\s*'
    r'"name": "Guides",\s*'
    r'"item": "https://search-console\.org/guides/index\.html"\s*'
    r"\},\s*",
    re.S,
)

POSITION_THREE = '"position": 3,'


def fix_file(path: Path) -> bool:
    text = path.read_text()
    updated = GUIDES_HUB_CRUMB.sub("\n      ", text)
    updated = updated.replace(POSITION_THREE, '"position": 2,')
    updated = updated.replace(
        '<li><a href="index.html">All guides</a></li>\n          ',
        "",
    )
    updated = updated.replace(
        '<li><a href="index.html">All guides</a></li>',
        "",
    )
    if updated != text:
        path.write_text(updated)
        return True
    return False


def main() -> None:
    changed = 0
    for path in sorted(GUIDES.glob("*.html")):
        if path.name == "index.html":
            continue
        if fix_file(path):
            print(f"fixed {path.relative_to(DOCS)}")
            changed += 1
    if not changed:
        print("no guide files changed")


if __name__ == "__main__":
    main()
