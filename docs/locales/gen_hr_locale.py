#!/usr/bin/env python3
"""Generate locales/hr.json (Croatian / Bosnian) from en.json."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
EN_PATH = ROOT / "en.json"
OUT_PATH = ROOT / "hr.json"
CACHE_PATH = ROOT / "overlay-packs" / "maps" / "hr.json"

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
    "Diff",
    "Prev",
    "Curr",
    "App Store",
    "OAuth",
    "JSON-LD",
    "X",
    "LinkedIn",
    "Facebook",
    "Safari",
    "iPhone",
    "iPad",
    "TestFlight",
    "PageSpeed",
]


def translate(text: str, target: str = "hr") -> str:
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


def collect_unique_strings(node, out: set[str]) -> None:
    if isinstance(node, dict):
        for value in node.values():
            collect_unique_strings(value, out)
    elif isinstance(node, str):
        out.add(node)


def apply_map(node, mapping: dict[str, str]):
    if isinstance(node, dict):
        return {key: apply_map(value, mapping) for key, value in node.items()}
    if isinstance(node, str):
        return mapping.get(node, node)
    return node


def save_cache(cache: dict[str, str]) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    unique: set[str] = set()
    collect_unique_strings(en, unique)

    cache: dict[str, str] = {}
    if CACHE_PATH.exists():
        cache = json.loads(CACHE_PATH.read_text(encoding="utf-8"))

    pending = [s for s in sorted(unique) if s not in cache]
    total = len(unique)
    print(f"{total} unique strings, {len(cache)} cached, {len(pending)} to translate", flush=True)

    for index, source in enumerate(pending, start=1):
        if not source.strip():
            cache[source] = source
            continue
        protected, placeholders = protect_terms(source)
        translated = translate(protected)
        cache[source] = restore_terms(translated, placeholders)
        if index % 25 == 0 or index == len(pending):
            save_cache(cache)
            print(f"  {len(cache)}/{total}", flush=True)
        time.sleep(0.15)

    save_cache(cache)
    hr = apply_map(en, cache)
    hr["locale"] = "hr"
    hr.setdefault("aria", {})["selectLanguage"] = "Odaberite jezik"
    OUT_PATH.write_text(
        json.dumps(hr, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"wrote {OUT_PATH.name}", flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(130)
