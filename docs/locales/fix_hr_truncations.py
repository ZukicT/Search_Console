#!/usr/bin/env python3
"""Re-translate truncated hr.json strings using sentence-aware chunking."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).parent
EN_PATH = ROOT / "en.json"
HR_PATH = ROOT / "hr.json"
CACHE_PATH = ROOT / "overlay-packs" / "maps" / "hr.json"


def translate(text: str) -> str:
    q = urllib.parse.quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl=hr&dt=t&q={q}"
    )
    for attempt in range(5):
        try:
            with urllib.request.urlopen(url, timeout=45) as resp:
                data = json.loads(resp.read().decode())
            return data[0][0][0]
        except Exception:
            time.sleep(1.0 * (attempt + 1))
    return text


def protect_html(text: str) -> tuple[str, list[str]]:
    tags: list[str] = []

    def repl(match: re.Match[str]) -> str:
        tags.append(match.group(0))
        return f"⟦{len(tags) - 1}⟧"

    return re.sub(r"<[^>]+>", repl, text), tags


def restore_html(text: str, tags: list[str]) -> str:
    out = text
    for index, tag in enumerate(tags):
        out = out.replace(f"⟦{index}⟧", tag)
    return out


def translate_long(source: str) -> str:
    if not source.strip():
        return source

    protected, html_tags = protect_html(source)
    chunks = re.split(r"(?<=[.!?])\s+|\s*\|\s*", protected)
    chunks = [chunk.strip() for chunk in chunks if chunk.strip()]
    if len(chunks) <= 1 and len(protected) > 80:
        chunks = re.split(r"(?<=[,;])\s+", protected)
        chunks = [chunk.strip() for chunk in chunks if chunk.strip()]

    translated: list[str] = []
    for chunk in chunks:
        translated.append(translate(chunk))
        time.sleep(0.12)

    joiner = " | " if "|" in protected else " "
    result = joiner.join(translated)
    return restore_html(result, html_tags)


def is_bad(en_value: str, hr_value: str) -> bool:
    if en_value == hr_value:
        return False
    if len(en_value) <= 30:
        return len(hr_value) < max(8, len(en_value) * 0.55)
    return len(hr_value) < len(en_value) * 0.65


def collect_pairs(en_node, hr_node, cache: dict[str, str], path: str = "") -> list[str]:
    bad: list[str] = []
    if isinstance(en_node, dict):
        for key in en_node:
            if key in hr_node:
                bad.extend(collect_pairs(en_node[key], hr_node[key], cache, f"{path}.{key}" if path else key))
        return bad
    if isinstance(en_node, str) and isinstance(hr_node, str):
        if is_bad(en_node, hr_node):
            bad.append(en_node)
    return bad


def apply_map(node, mapping: dict[str, str]):
    if isinstance(node, dict):
        return {key: apply_map(value, mapping) for key, value in node.items()}
    if isinstance(node, str):
        return mapping.get(node, node)
    return node


def main() -> None:
    en = json.loads(EN_PATH.read_text(encoding="utf-8"))
    hr = json.loads(HR_PATH.read_text(encoding="utf-8"))
    cache = json.loads(CACHE_PATH.read_text(encoding="utf-8")) if CACHE_PATH.exists() else {}

    bad_sources = sorted(set(collect_pairs(en, hr, cache)))
    print(f"Re-translating {len(bad_sources)} strings...", flush=True)

    for index, source in enumerate(bad_sources, start=1):
        cache[source] = translate_long(source)
        if index % 10 == 0 or index == len(bad_sources):
            print(f"  {index}/{len(bad_sources)}", flush=True)

    CACHE_PATH.write_text(
        json.dumps(cache, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    hr = apply_map(en, cache)
    hr["locale"] = "hr"
    hr.setdefault("aria", {})["selectLanguage"] = "Odaberite jezik"
    HR_PATH.write_text(json.dumps(hr, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("updated hr.json", flush=True)


if __name__ == "__main__":
    main()
