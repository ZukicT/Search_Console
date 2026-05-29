#!/usr/bin/env python3
"""Translate guide-related locale sections where values still match en.json."""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
LOCALES = DOCS / "locales"
EN_PATH = LOCALES / "en.json"
CACHE_DIR = LOCALES / "overlay-packs" / "maps"

TARGET_LOCALES: dict[str, str] = {
    "de": "de",
    "fr": "fr",
    "pt": "pt",
    "ja": "ja",
    "ko": "ko",
    "zh-Hans": "zh-CN",
    "zh-Hant": "zh-TW",
}

GUIDE_SECTIONS = (
    "guidesHub",
    "guidesCommon",
    "guideOfficial",
    "guideMobileOptions",
    "guideCwv",
    "guideRankings",
)

FOOTER_GUIDE_KEYS = (
    "guideOfficial",
    "guideMobileOptions",
    "guideCwv",
    "guideRankings",
)

KEEP_LITERAL = [
    "Search Console",
    "Google Search Console",
    "Google",
    "Core Web Vitals",
    "CrUX",
    "PageSpeed Insights",
    "Lighthouse",
    "Chrome User Experience Report",
    "CTR",
    "LCP",
    "INP",
    "CLS",
    "SERP",
    "SEO",
    "URL",
    "URLs",
    "iOS",
    "API",
    "FAQ",
    "HTTPS",
    "CMS",
    "robots.txt",
    "noindex",
    "hreflang",
    "web.dev",
    "Search Central",
    "Tarik Zukic",
    "search-console.org",
    "App Store",
    "OAuth",
    "JSON-LD",
    "Safari",
    "iPhone",
    "iPad",
    "TestFlight",
    "PageSpeed",
    "PWA",
]


def protect_terms(text: str) -> tuple[str, list[tuple[str, str]]]:
    placeholders: list[tuple[str, str]] = []
    protected = text
    for term in sorted(KEEP_LITERAL, key=len, reverse=True):
        pattern = re.compile(
            r"(?<![A-Za-z0-9])" + re.escape(term) + r"(?![A-Za-z0-9])"
        )
        while True:
            match = pattern.search(protected)
            if not match:
                break
            key = f"⟦{len(placeholders)}⟧"
            placeholders.append((key, term))
            protected = protected[: match.start()] + key + protected[match.end() :]
    return protected, placeholders


def restore_terms(text: str, placeholders: list[tuple[str, str]]) -> str:
    out = text
    for key, token in placeholders:
        out = out.replace(key, token)
    return out


def translate_chunk(text: str, target: str) -> str:
    q = urllib.parse.quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl={target}&dt=t&q={q}"
    )
    last_err = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=45) as resp:
                data = json.loads(resp.read().decode())
            return data[0][0][0]
        except Exception as err:
            last_err = err
            time.sleep(1.0 * (attempt + 1))
    raise last_err


def translate_long(source: str, target: str) -> str:
    protected = source
    html_tags: list[str] = []

    def stash(match: re.Match[str]) -> str:
        html_tags.append(match.group(0))
        return f"⟦{len(html_tags) - 1}⟧"

    protected = re.sub(r"<[^>]+>", stash, protected)
    parts = re.split(r"(?<=[.!?])\s+", protected)
    parts = [part.strip() for part in parts if part.strip()]
    translated = [translate_chunk(part, target) for part in parts]
    time.sleep(0.1 * max(len(parts), 1))
    result = " ".join(translated)
    for index, tag in enumerate(html_tags):
        result = result.replace(f"⟦{index}⟧", tag)
    return result


def translate_value(source: str, target: str, cache: dict[str, str]) -> str:
    if source in cache:
        return cache[source]
    if not source.strip():
        cache[source] = source
        return source
    protected, placeholders = protect_terms(source)
    if len(source) > 80 or "<" in source:
        translated = translate_long(protected, target)
    else:
        translated = translate_chunk(protected, target)
        time.sleep(0.12)
    result = restore_terms(translated, placeholders)
    cache[source] = result
    return result


def collect_pending(
    en_node,
    loc_node,
    pending: list[tuple[list[str], str]],
    prefix: list[str],
) -> None:
    if isinstance(en_node, dict):
        loc_dict = loc_node if isinstance(loc_node, dict) else {}
        for key, en_val in en_node.items():
            loc_val = loc_dict.get(key)
            next_prefix = prefix + [key]
            if isinstance(en_val, dict):
                collect_pending(
                    en_val,
                    loc_val if isinstance(loc_val, dict) else {},
                    pending,
                    next_prefix,
                )
            elif isinstance(en_val, str) and (loc_val is None or loc_val == en_val):
                pending.append((next_prefix, en_val))
        return
    if isinstance(en_node, str) and (loc_node is None or loc_node == en_node):
        pending.append((prefix, en_node))


def set_nested(root: dict, path: list[str], value: str) -> None:
    node = root
    for key in path[:-1]:
        node = node.setdefault(key, {})
    node[path[-1]] = value


def pending_for_locale(en: dict, locale: dict) -> list[tuple[list[str], str]]:
    pending: list[tuple[list[str], str]] = []
    for section in GUIDE_SECTIONS:
        collect_pending(
            en.get(section, {}),
            locale.get(section, {}),
            pending,
            [section],
        )
    for key in FOOTER_GUIDE_KEYS:
        en_val = en.get("footer", {}).get(key)
        loc_val = locale.get("footer", {}).get(key)
        if isinstance(en_val, str) and (loc_val is None or loc_val == en_val):
            pending.append((["footer", key], en_val))
    return pending


def translate_locale(locale_id: str, dry_run: bool = False) -> int:
    if locale_id not in TARGET_LOCALES:
        raise ValueError(f"unsupported locale: {locale_id}")

    target = TARGET_LOCALES[locale_id]
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    locale_path = LOCALES / f"{locale_id}.json"
    locale = json.loads(locale_path.read_text(encoding="utf-8"))

    cache_path = CACHE_DIR / f"{locale_id}-guides.json"
    cache: dict[str, str] = {}
    if cache_path.exists():
        cache = json.loads(cache_path.read_text(encoding="utf-8"))

    pending = pending_for_locale(en, locale)
    print(f"{locale_id}: {len(pending)} strings to translate", flush=True)
    if dry_run:
        return len(pending)

    for index, (path, en_val) in enumerate(pending, start=1):
        translated = translate_value(en_val, target, cache)
        set_nested(locale, path, translated)
        if index % 20 == 0 or index == len(pending):
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            cache_path.write_text(
                json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            locale_path.write_text(
                json.dumps(locale, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"  {locale_id}: {index}/{len(pending)}", flush=True)

    locale_path.write_text(
        json.dumps(locale, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    cache_path.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {locale_path.name}", flush=True)
    return len(pending)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--locale",
        action="append",
        help=f"Locale file id ({', '.join(TARGET_LOCALES)})",
    )
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    locales = args.locale or list(TARGET_LOCALES)
    total = 0
    for locale_id in locales:
        total += translate_locale(locale_id, dry_run=args.dry_run)
    print(f"done ({total} strings across {len(locales)} locale(s))", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
