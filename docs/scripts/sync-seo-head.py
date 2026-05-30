#!/usr/bin/env python3
"""Ensure consistent SEO meta tags across static HTML pages (no visual changes)."""

from __future__ import annotations

import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
SITE = "https://search-console.org"
SITEMAP = f"{SITE}/sitemap.xml"
OG_SOCIAL_JPG = f"{SITE}/og/social-card.jpg"
OG_SOCIAL_GIF = f"{SITE}/og/social-card.gif"
OG_SOCIAL_ALT = (
    "Search Console for iOS. See how your site performs in search. "
    "Same account. Same data. Built for iPhone."
)
OG_SOCIAL_WIDTH = "2064"
OG_SOCIAL_HEIGHT = "2064"

ROOT_PAGES = [
    DOCS / "index.html",
    DOCS / "about.html",
    DOCS / "faq.html",
    DOCS / "releases.html",
    DOCS / "privacy.html",
    DOCS / "terms.html",
    DOCS / "404.html",
    DOCS / "blog.html",
]

GUIDE_PAGES = list((DOCS / "guides").glob("*.html"))
BLOG_PAGES = list((DOCS / "blog").glob("*.html"))

COMMON_META = """
  <meta property="og:site_name" content="Search Console for iOS">
  <meta property="og:locale" content="en_US">
  <link rel="sitemap" type="application/xml" title="Sitemap" href="{sitemap}">
""".strip().format(sitemap=SITEMAP)

ROBOTS_INDEX = 'content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"'
ROBOTS_NOINDEX = 'content="noindex, follow"'

SOCIAL_CARD_OG_BLOCK = f"""  <meta property="og:image" content="{OG_SOCIAL_JPG}">
  <meta property="og:image:width" content="{OG_SOCIAL_WIDTH}">
  <meta property="og:image:height" content="{OG_SOCIAL_HEIGHT}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="{OG_SOCIAL_ALT}">"""


def extract_meta_content(html: str, name: str, *, prop: bool = False) -> str | None:
    if prop:
        pattern = rf'<meta property="{re.escape(name)}" content="([^"]*)"'
    else:
        pattern = rf'<meta name="{re.escape(name)}" content="([^"]*)"'
    match = re.search(pattern, html)
    return match.group(1) if match else None


def insert_after_first(html: str, needle: str, block: str) -> str:
    idx = html.find(needle)
    if idx == -1:
        return html
    end = idx + len(needle)
    return html[:end] + "\n" + block + html[end:]


def ensure_common_meta(html: str) -> str:
    if "og:site_name" in html:
        return html
    anchor = '<meta property="og:url"'
    if anchor not in html:
        anchor = '<link rel="canonical"'
    if anchor not in html:
        return html
    match = re.search(rf"{re.escape(anchor)}[^>]*>", html)
    if not match:
        return html
    return insert_after_first(html, match.group(0), COMMON_META)


def replace_social_card_og_block(html: str) -> str:
    html = re.sub(
        r'<meta property="og:image" content="[^"]*">\s*'
        r'(?:<meta property="og:image:width" content="[^"]*">\s*)?'
        r'(?:<meta property="og:image:height" content="[^"]*">\s*)?'
        r'(?:<meta property="og:image:type" content="[^"]*">\s*)?'
        r'(?:<meta property="og:image:alt" content="[^"]*">\s*)?',
        SOCIAL_CARD_OG_BLOCK + "\n",
        html,
        count=1,
    )
    html = html.replace('"image": "https://search-console.org/og-linkedin-share.png"', f'"image": "{OG_SOCIAL_JPG}"')
    html = html.replace('"image": "https://search-console.org/app-icon-512.jpg"', f'"image": "{OG_SOCIAL_JPG}"')
    return html


def ensure_twitter(html: str) -> str:
    title = extract_meta_content(html, "og:title", prop=True) or extract_meta_content(html, "title")
    description = extract_meta_content(html, "og:description", prop=True) or extract_meta_content(
        html, "description"
    )
    if not title or not description:
        return html

    if 'name="twitter:card"' not in html:
        block = f"""
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="{OG_SOCIAL_GIF}">
  <meta name="twitter:image:alt" content="{OG_SOCIAL_ALT}">""".strip()
        anchor_match = re.search(r'<meta property="og:image(?::alt)?"[^>]*>', html)
        if anchor_match:
            return insert_after_first(html, anchor_match.group(0), block)
        og_url = re.search(r'<meta property="og:url"[^>]*>', html)
        if og_url:
            return insert_after_first(html, og_url.group(0), block)
        return html

    if 'name="twitter:title"' not in html:
        block = f"""
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">""".strip()
        card = re.search(r'<meta name="twitter:card"[^>]*>', html)
        if card:
            html = insert_after_first(html, card.group(0), block)
    elif 'name="twitter:description"' not in html:
        tw_title = re.search(r'<meta name="twitter:title"[^>]*>', html)
        if tw_title:
            html = insert_after_first(
                html,
                tw_title.group(0),
                f'  <meta name="twitter:description" content="{description}">',
            )

    if 'name="twitter:image"' in html:
        html = re.sub(
            r'<meta name="twitter:image" content="[^"]*">',
            f'<meta name="twitter:image" content="{OG_SOCIAL_GIF}">',
            html,
            count=1,
        )
    else:
        tw_desc = re.search(r'<meta name="twitter:description"[^>]*>', html)
        if tw_desc:
            html = insert_after_first(
                html,
                tw_desc.group(0),
                f'  <meta name="twitter:image" content="{OG_SOCIAL_GIF}">',
            )

    if 'name="twitter:image:alt"' not in html:
        tw_image = re.search(r'<meta name="twitter:image"[^>]*>', html)
        if tw_image:
            html = insert_after_first(
                html,
                tw_image.group(0),
                f'  <meta name="twitter:image:alt" content="{OG_SOCIAL_ALT}">',
            )
    else:
        html = re.sub(
            r'<meta name="twitter:image:alt" content="[^"]*">',
            f'<meta name="twitter:image:alt" content="{OG_SOCIAL_ALT}">',
            html,
            count=1,
        )

    return html


def ensure_author(html: str) -> str:
    if 'name="author"' in html:
        return html
    block = '  <meta name="author" content="Tarik Zukic">'
    robots = re.search(r'<meta name="robots"[^>]*>', html)
    if robots:
        return insert_after_first(html, robots.group(0), block)
    return html


def ensure_googlebot(html: str) -> str:
    if 'name="googlebot"' in html:
        return html
    if 'content="noindex' in html:
        return html
    block = '  <meta name="googlebot" content="index, follow">'
    robots = re.search(r'<meta name="robots"[^>]*>', html)
    if robots:
        return insert_after_first(html, robots.group(0), block)
    return html


def upgrade_robots(html: str) -> str:
    if "max-image-preview:large" in html:
        return html
    if ROBOTS_NOINDEX in html:
        return html
    return html.replace('content="index, follow"', ROBOTS_INDEX, 1)


def patch_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    updated = original
    updated = ensure_common_meta(updated)
    updated = replace_social_card_og_block(updated)
    updated = ensure_twitter(updated)
    updated = ensure_author(updated)
    updated = ensure_googlebot(updated)
    updated = upgrade_robots(updated)
    if updated != original:
        path.write_text(updated, encoding="utf-8")
        return True
    return False


def main() -> None:
    changed = 0
    for path in ROOT_PAGES + GUIDE_PAGES + BLOG_PAGES:
        if path.exists() and patch_file(path):
            print(f"patched {path.relative_to(DOCS)}")
            changed += 1
    print(f"done ({changed} files updated)")


if __name__ == "__main__":
    main()
