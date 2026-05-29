#!/usr/bin/env python3
"""Repair guide HTML strings (byline, homeTeaser) after bulk translation."""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
LOCALES = DOCS / "locales"
EN_PATH = LOCALES / "en.json"
TRANSLATE_SCRIPT = DOCS / "scripts" / "translate-guide-locales.py"

spec = importlib.util.spec_from_file_location("translate_guide_locales", TRANSLATE_SCRIPT)
translate_mod = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(translate_mod)

TARGET_LOCALES = translate_mod.TARGET_LOCALES
translate_value = translate_mod.translate_value


def fix_home_teaser(en_teaser: str, locale_id: str, cache: dict[str, str]) -> str:
    target = TARGET_LOCALES[locale_id]
    links = re.findall(
        r'<a href="([^"]+)" class="text-link">([^<]+)</a>',
        en_teaser,
    )
    prefix = en_teaser.split("<a", 1)[0].strip()

    def t(text: str) -> str:
        return translate_value(text, target, cache)

    translated_prefix = t(prefix)
    rendered = [f'<a href="{href}" class="text-link">{t(text)}</a>' for href, text in links]
    if len(rendered) == 1:
        joined = rendered[0]
    else:
        and_word = t("and")
        joined = ", ".join(rendered[:-1]) + f", {and_word} {rendered[-1]}"
    return f"{translated_prefix} {joined}."


def main() -> None:
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    en_teaser = en["guidesHub"]["homeTeaser"]
    en_byline = en["guidesCommon"]["byline"]

    for locale_id in TARGET_LOCALES:
        name = f"{locale_id}.json"
        path = LOCALES / name
        data = json.loads(path.read_text(encoding="utf-8"))
        blog_byline = data.get("blogCommon", {}).get("byline")
        if blog_byline and blog_byline != en_byline:
            data.setdefault("guidesCommon", {})["byline"] = blog_byline
        else:
            print(f"{name}: missing blogCommon.byline fallback", flush=True)

        hub = data.setdefault("guidesHub", {})
        cache_path = LOCALES / "overlay-packs" / "maps" / f"{locale_id}-guides.json"
        cache = (
            json.loads(cache_path.read_text(encoding="utf-8"))
            if cache_path.exists()
            else {}
        )

        hub["homeTeaser"] = fix_home_teaser(en_teaser, locale_id, cache)
        cache_path.parent.mkdir(parents=True, exist_ok=True)
        cache_path.write_text(
            json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"fixed {name}", flush=True)


if __name__ == "__main__":
    main()
