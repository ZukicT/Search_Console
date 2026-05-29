#!/usr/bin/env python3
"""Verify blog post HTML i18n wiring against overlay-packs/en.json."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
BLOG = DOCS / "blog"
OVERLAY = DOCS / "locales" / "overlay-packs" / "en.json"

FILES = {
    "improve-search-click-through-rate.html": {
        "post": "blogPostCtr",
        "common": [
            "categoryPerformance",
            "datePublished",
            "byline",
            "sourcesTitle",
            "legendImpressions",
            "legendClicks",
            "visualLabelFilteredQuery",
            "visualPagesTabArrow",
            "visualMetricClicks",
            "visualMetricCtr",
            "visualMetricImpressions",
            "visualMetricPosition",
            "visualLabelBefore",
            "visualLabelAfter",
        ],
    },
    "find-pages-losing-traffic.html": {
        "post": "blogPostTraffic",
        "common": [
            "categoryPerformance",
            "datePublished",
            "byline",
            "sourcesTitle",
            "legendPreviousPeriod",
            "legendCurrentPeriod",
            "visualPagesHeadPage",
            "visualPagesHeadPrev",
            "visualPagesHeadCurr",
            "visualPagesHeadDiff",
        ],
    },
    "prioritize-core-web-vitals-fixes.html": {
        "post": "blogPostCwv",
        "common": [
            "categoryPageExperience",
            "datePublished",
            "byline",
            "sourcesTitle",
            "statusGood",
            "statusNeedImprovement",
        ],
    },
    "catch-indexing-issues-early.html": {
        "post": "blogPostIndexing",
        "common": [
            "categoryIndexing",
            "datePublished",
            "byline",
            "sourcesTitle",
        ],
    },
}

META_BODY_KEYS = {"metaTitle", "metaDescription"}


def load_overlay() -> dict:
    return json.loads(OVERLAY.read_text(encoding="utf-8"))


def extract_i18n_keys(html: str) -> set[str]:
    return set(re.findall(r'data-i18n="([^"]+)"', html))


def extract_body_meta_keys(html: str) -> tuple[str | None, str | None]:
    body = re.search(r"<body[^>]*>", html)
    if not body:
        return None, None
    tag = body.group(0)
    title = re.search(r'data-i18n-title-key="([^"]+)"', tag)
    desc = re.search(r'data-i18n-description-key="([^"]+)"', tag)
    return (title.group(1) if title else None, desc.group(1) if desc else None)


def main() -> int:
    overlay = load_overlay()
    failed = False

    for filename, cfg in FILES.items():
        path = BLOG / filename
        html = path.read_text(encoding="utf-8")
        post_section = cfg["post"]
        post_keys = set(overlay[post_section].keys())
        expected_post_wired = post_keys - META_BODY_KEYS

        expected = {f"{post_section}.{k}" for k in expected_post_wired}
        expected |= {f"blogCommon.{k}" for k in cfg["common"]}

        title_key, desc_key = extract_body_meta_keys(html)
        expected_title = f"{post_section}.metaTitle"
        expected_desc = f"{post_section}.metaDescription"

        found = extract_i18n_keys(html)
        article_keys = {
            k
            for k in found
            if k.startswith(f"{post_section}.") or k.startswith("blogCommon.")
        }

        missing = sorted(expected - article_keys)
        extra = sorted(
            k
            for k in article_keys
            if k.startswith(f"{post_section}.") and k not in expected
        )

        print(f"\n{filename}")
        print(f"  body title key: {title_key} ({'ok' if title_key == expected_title else 'BAD'})")
        print(f"  body desc key:  {desc_key} ({'ok' if desc_key == expected_desc else 'BAD'})")
        print(f"  overlay post keys: {len(post_keys)} (2 meta on body)")
        print(f"  expected wired: {len(expected)}")
        print(f"  found blog keys: {len(article_keys)}")

        if title_key != expected_title or desc_key != expected_desc:
            failed = True
            print("  FAIL: body meta keys")
        if missing:
            failed = True
            print(f"  MISSING ({len(missing)}): {', '.join(missing)}")
        if extra:
            failed = True
            print(f"  EXTRA ({len(extra)}): {', '.join(extra)}")
        if not missing and not extra and title_key == expected_title and desc_key == expected_desc:
            print("  OK")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
