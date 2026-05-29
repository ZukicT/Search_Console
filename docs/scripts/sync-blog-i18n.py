#!/usr/bin/env python3
"""Merge blog translation overlays into locale JSON files."""

from __future__ import annotations

import json
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
LOCALES = DOCS / "locales"
EN_PACK = LOCALES / "overlay-packs" / "en.json"
OVERLAYS = LOCALES / "blog-i18n-overlays.json"

BLOG_SECTIONS = (
    "blog",
    "blogCommon",
    "blogPostCtr",
    "blogPostTraffic",
    "blogPostCwv",
    "blogPostIndexing",
)


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: dict) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def merge_locale_file(locale: str, overlay: dict) -> None:
    path = LOCALES / f"{locale}.json"
    if not path.exists():
        print(f"skip missing locale: {path.name}")
        return
    data = load_json(path)
    nav = overlay.get("nav") or {}
    if nav.get("blog"):
        data.setdefault("nav", {})["blog"] = nav["blog"]
    for section in BLOG_SECTIONS:
        if section in overlay:
            data[section] = overlay[section]
    write_json(path, data)
    print(f"merged blog i18n -> {path.name}")


def main() -> None:
    en_pack = load_json(EN_PACK)
    en_path = LOCALES / "en.json"
    en_data = load_json(en_path)
    en_data["blog"] = en_pack["blog"]
    en_data["blogCommon"] = en_pack["blogCommon"]
    en_data["blogPostCtr"] = en_pack["blogPostCtr"]
    en_data["blogPostTraffic"] = en_pack["blogPostTraffic"]
    en_data["blogPostCwv"] = en_pack["blogPostCwv"]
    en_data["blogPostIndexing"] = en_pack["blogPostIndexing"]
    write_json(en_path, en_data)
    print("merged blog i18n -> en.json")

    overlays = load_json(OVERLAYS)
    for locale, overlay in overlays.items():
        merge_locale_file(locale, overlay)


if __name__ == "__main__":
    main()
