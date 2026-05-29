#!/usr/bin/env python3
"""Generate pt, ja, ko, zh-Hans, zh-Hant maps via Google Translate (unofficial gtx client)."""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
MAPS = ROOT / "overlay-packs" / "maps"
EN_STRINGS = json.loads((ROOT / "overlay-packs/en-unique-strings.json").read_text(encoding="utf-8"))

LOCALE_TL = {
    "pt": "pt",
    "ja": "ja",
    "ko": "ko",
    "hr": "hr",
    "zh-Hans": "zh-CN",
    "zh-Hant": "zh-TW",
}

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
]


def translate(text: str, target: str) -> str:
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
            time.sleep(1.5 * (attempt + 1))
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


def build_map(target: str, existing: dict[str, str] | None = None) -> dict[str, str]:
    mapping: dict[str, str] = dict(existing or {})
    for i, source in enumerate(EN_STRINGS):
        if source in mapping:
            continue
        protected, placeholders = protect_terms(source)
        translated = translate(protected, target)
        result = restore_terms(translated, placeholders)
        if len(source) > 48 and len(result) < len(source) * 0.45:
            translated = translate(source, target)
            result = translated
        mapping[source] = result
        if (i + 1) % 20 == 0:
            print(f"  {target}: {len(mapping)}/{len(EN_STRINGS)}")
        time.sleep(0.25)
    return mapping


def main() -> None:
    MAPS.mkdir(parents=True, exist_ok=True)
    for code, tl in LOCALE_TL.items():
        out_path = MAPS / f"{code}.json"
        existing = None
        if out_path.exists():
            existing = json.loads(out_path.read_text(encoding="utf-8"))
            if len(existing) >= len(EN_STRINGS):
                print(f"skip {code} (complete)")
                continue
            print(f"resume {code} ({len(existing)}/{len(EN_STRINGS)})")
        else:
            print(f"Translating {code} ({tl})...")
        mapping = build_map(tl, existing)
        out_path.write_text(
            json.dumps(mapping, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"wrote {code}.json ({len(mapping)} entries)")


if __name__ == "__main__":
    main()
