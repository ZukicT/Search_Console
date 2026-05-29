#!/usr/bin/env python3
"""Replace inline guide styles with shared CSS classes."""

from __future__ import annotations

import re
from pathlib import Path

APP_STORE = "https://apps.apple.com/us/app/search-console/id6758431981"

DOCS = Path(__file__).resolve().parents[1]
GUIDES = DOCS / "guides"

REPLACEMENTS: list[tuple[str, str]] = [
    (
        'class="container guide-content reveal-stagger reveal-stagger--tight" data-reveal style="max-width: 800px;"',
        'class="container guide-content reveal-stagger reveal-stagger--tight" data-reveal',
    ),
    (
        'style="font-size: 2.5rem; margin-bottom: 16px; line-height: 1.2;"',
        'class="guide-title"',
    ),
    (
        'style="font-size: 2.5rem; margin-bottom: 24px; line-height: 1.2;"',
        'class="guide-title"',
    ),
    (
        'style="font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: 4px;"',
        'class="guide-byline"',
    ),
    (
        'style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 32px;"',
        'class="guide-updated"',
    ),
    (
        'style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 48px;"',
        'class="guide-lead"',
    ),
    (
        'style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 32px;"',
        'class="guide-lead guide-lead--compact"',
    ),
    (
        'style="font-size: 1.75rem; margin: 40px 0 20px;"',
        'class="guide-heading"',
    ),
    (
        'style="font-size: 1.75rem; margin: 40px 0 24px;"',
        'class="guide-heading"',
    ),
    (
        'style="margin-bottom: 24px; font-size: 1.0625rem; color: var(--text-secondary);"',
        'class="guide-body-text"',
    ),
    (
        'style="font-size: 1.0625rem; color: var(--text-secondary);"',
        'class="guide-body-text"',
    ),
    (
        'style="background: var(--bg); padding: 32px; border-radius: 12px; margin: 32px 0;"',
        'class="guide-callout"',
    ),
    ('style="margin-bottom: 16px;"', 'class="guide-callout-title"'),
    (
        'style="list-style-position: inside; line-height: 1.8; color: var(--text-secondary);"',
        'class="guide-callout-list"',
    ),
    (
        'style="padding-left: 20px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 24px;"',
        'class="guide-steps"',
    ),
    (
        'style="padding-left: 20px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 48px;"',
        'class="guide-list guide-list--related"',
    ),
    (
        'style="padding-left: 20px; line-height: 1.8; color: var(--text-secondary);"',
        'class="guide-list"',
    ),
    (
        'style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 48px; padding: 16px; background: var(--bg); border-radius: 8px;"',
        'class="guide-disclaimer"',
    ),
    (
        'style="list-style: none; padding: 0; margin: 0 0 48px;"',
        'class="guide-index-list"',
    ),
    (
        'style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border);"',
        'class="guide-index-item"',
    ),
    (
        'style="font-size: 1.125rem; font-weight: 500; display: block; margin-bottom: 8px;"',
        'class="guide-index-link"',
    ),
    (
        'style="font-size: 1rem; color: var(--text-secondary); margin: 0;"',
        'class="guide-index-desc"',
    ),
    ('<p style="margin-bottom: 24px;">', '<p class="guide-cta">'),
    ('<p style="margin-bottom: 32px;">', '<p class="guide-cta">'),
    ('<li style="margin-bottom: 24px;">', '<li class="guide-index-item">'),
    (
        'style="font-size: 0.875rem; color: var(--text-secondary);"',
        'class="guide-back"',
    ),
]


def normalize_file(path: Path) -> bool:
    text = path.read_text()
    updated = text
    for old, new in REPLACEMENTS:
        updated = updated.replace(old, new)
    updated = re.sub(
        r'\n  <link href="https://fonts\.googleapis\.com/css2\?[^"]+" rel="stylesheet">\n',
        "\n",
        updated,
    )
    updated = updated.replace('<article class="section page-guide">', '<article class="section">')
    updated = updated.replace(
        'href="/" class="btn btn-primary" data-i18n="guide.downloadCta"',
        f'href="{APP_STORE}" class="btn btn-primary" target="_blank" rel="noopener" data-i18n="guide.downloadCta"',
    )
    body_match = re.search(r"<body([^>]*)>", updated)
    if body_match:
        body_attrs = body_match.group(1)
        if "page-guide" not in body_attrs:
            if body_attrs.strip():
                updated = updated.replace(
                    f"<body{body_attrs}>",
                    f'<body class="page-guide"{body_attrs}>',
                    1,
                )
            else:
                updated = updated.replace("<body>", '<body class="page-guide">', 1)
    if updated != text:
        path.write_text(updated)
        return True
    return False


def main() -> None:
    changed = 0
    for path in sorted(GUIDES.glob("*.html")):
        if normalize_file(path):
            print(f"normalized {path.relative_to(DOCS)}")
            changed += 1
    if not changed:
        print("no guide files changed")


if __name__ == "__main__":
    main()
