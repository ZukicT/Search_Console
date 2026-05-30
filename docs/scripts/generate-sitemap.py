#!/usr/bin/env python3
"""Generate sitemap.xml from indexable HTML pages.

Follows Google Search Central sitemap guidance:
- Absolute canonical URLs only (parsed from each page)
- UTF-8 XML urlset
- Accurate lastmod from file mtime (W3C Datetime, UTC)
- Exclude noindex pages (for example 404)
- Omit changefreq and priority (Google ignores them)
"""

from __future__ import annotations

import html
import re
from datetime import UTC, datetime
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
SITEMAP = DOCS / "sitemap.xml"
SITE_ORIGIN = "https://search-console.org"
EXCLUDE_FILES = {"404.html"}

HOMEPAGE_IMAGES = [
    {
        "loc": f"{SITE_ORIGIN}/AppAssetsWebsite/Image1.imageset/Image1.png",
        "title": "Search Console iOS app overview dashboard on iPhone",
        "caption": "Overview dashboard with site visits and performance summary",
    },
    {
        "loc": f"{SITE_ORIGIN}/app-icon-512.jpg",
        "title": "Search Console for iOS app icon",
        "caption": "App icon for the independent Search Console iOS app",
    },
]


def parse_canonical(page_html: str) -> str | None:
    match = re.search(
        r'<link\s+rel="canonical"\s+href="([^"]+)"',
        page_html,
        re.I,
    )
    return match.group(1) if match else None


def is_noindex(page_html: str) -> bool:
    return bool(re.search(r'<meta\s+name="robots"\s+content="[^"]*noindex', page_html, re.I))


def lastmod_for(path: Path) -> str:
    stamp = datetime.fromtimestamp(path.stat().st_mtime, tz=UTC)
    return stamp.strftime("%Y-%m-%dT%H:%M:%SZ")


def discover_entries() -> list[tuple[str, str, Path]]:
    entries: list[tuple[str, str, Path]] = []

    for html_path in sorted(DOCS.rglob("*.html")):
        if html_path.name in EXCLUDE_FILES:
            continue
        if "partials" in html_path.parts:
            continue
        if "marketing" in html_path.parts:
            continue

        page_html = html_path.read_text(encoding="utf-8")
        if is_noindex(page_html):
            continue

        canonical = parse_canonical(page_html)
        if not canonical:
            raise ValueError(f"Missing canonical in {html_path.relative_to(DOCS)}")

        if not canonical.startswith(SITE_ORIGIN):
            raise ValueError(f"Non-site canonical in {html_path}: {canonical}")

        entries.append((canonical, lastmod_for(html_path), html_path))

    entries.sort(key=lambda item: (item[0] != f"{SITE_ORIGIN}/", item[0]))
    return entries


def render_url_block(loc: str, lastmod: str, path: Path) -> str:
    lines = [
        "  <url>",
        f"    <loc>{html.escape(loc)}</loc>",
        f"    <lastmod>{lastmod}</lastmod>",
    ]

    if path.name == "index.html":
        for image in HOMEPAGE_IMAGES:
            lines.extend(
                [
                    "    <image:image>",
                    f"      <image:loc>{html.escape(image['loc'])}</image:loc>",
                    f"      <image:title>{html.escape(image['title'])}</image:title>",
                    f"      <image:caption>{html.escape(image['caption'])}</image:caption>",
                    "    </image:image>",
                ]
            )

    lines.append("  </url>")
    return "\n".join(lines)


def build_sitemap(entries: list[tuple[str, str, Path]]) -> str:
    header = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
"""
    body = "\n\n".join(render_url_block(loc, lastmod, path) for loc, lastmod, path in entries)
    return f"{header}\n{body}\n\n</urlset>\n"


def main() -> None:
    entries = discover_entries()
    SITEMAP.write_text(build_sitemap(entries), encoding="utf-8")
    print(f"wrote {SITEMAP.name} ({len(entries)} urls)")


if __name__ == "__main__":
    main()
