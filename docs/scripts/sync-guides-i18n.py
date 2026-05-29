#!/usr/bin/env python3
"""Merge guide body strings into en.json, wire guide HTML, sync hr translations."""

from __future__ import annotations

import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
LOCALES = DOCS / "locales"
GUIDES = DOCS / "guides"
BODY_PACK = LOCALES / "overlay-packs" / "guides-body-en.json"

RELATED_BY_FILE = {
    "how-to-use-google-search-console-on-iphone.html": [
        ("is-there-an-official-google-search-console-app.html", "guidesHub.item2Title"),
        ("google-search-console-mobile-app-options.html", "guidesHub.item3Title"),
        ("../index.html", "guidesCommon.homepage"),
    ],
    "is-there-an-official-google-search-console-app.html": [
        ("google-search-console-mobile-app-options.html", "guidesHub.item3Title"),
        ("how-to-use-google-search-console-on-iphone.html", "guidesHub.item1Title"),
        ("../index.html", "guidesCommon.homepage"),
    ],
    "google-search-console-mobile-app-options.html": [
        ("is-there-an-official-google-search-console-app.html", "guidesHub.item2Title"),
        ("how-to-use-google-search-console-on-iphone.html", "guidesHub.item1Title"),
        ("track-keyword-rankings-from-iphone.html", "guidesHub.item5Title"),
        ("../index.html", "guidesCommon.homepage"),
    ],
    "check-core-web-vitals-on-iphone.html": [
        ("how-to-use-google-search-console-on-iphone.html", "guidesHub.item1Title"),
        ("track-keyword-rankings-from-iphone.html", "guidesHub.item5Title"),
        ("../index.html", "guidesCommon.homepage"),
    ],
    "track-keyword-rankings-from-iphone.html": [
        ("google-search-console-mobile-app-options.html", "guidesHub.item3Title"),
        ("check-core-web-vitals-on-iphone.html", "guidesHub.item4Title"),
        ("../index.html", "guidesCommon.homepage"),
    ],
}

WIRE_ORDER = {
    "is-there-an-official-google-search-console-app.html": [
        ("h2", "guideOfficial.h2GoogleOffers"),
        ("p", "guideOfficial.pGoogleOffers1"),
        ("p", "guideOfficial.pGoogleOffers2"),
        ("h2", "guideOfficial.h2WhyExpect"),
        ("p", "guideOfficial.pWhyExpect1"),
        ("p", "guideOfficial.pWhyExpect2"),
        ("h2", "guideOfficial.h2ThirdParty"),
        ("p", "guideOfficial.pThirdParty1"),
        ("p", "guideOfficial.pThirdParty2"),
        ("h2", "guideOfficial.h2RedFlags"),
        ("p", "guideOfficial.pRedFlags1"),
        ("p", "guideOfficial.pRedFlags2"),
        ("h2", "guideOfficial.h2Choose"),
        ("p", "guideOfficial.pChoose1"),
        ("p", "guideOfficial.pChoose2"),
        ("p", "guideOfficial.pChoose3"),
    ],
    "google-search-console-mobile-app-options.html": [
        ("h2", "guideMobileOptions.h2Option1"),
        ("p", "guideMobileOptions.pOption1a"),
        ("p", "guideMobileOptions.pOption1b"),
        ("h2", "guideMobileOptions.h2Option2"),
        ("p", "guideMobileOptions.pOption2a"),
        ("p", "guideMobileOptions.pOption2b"),
        ("h2", "guideMobileOptions.h2Option3"),
        ("p", "guideMobileOptions.pOption3a"),
        ("p", "guideMobileOptions.pOption3b"),
        ("h2", "guideMobileOptions.h2Pick"),
        ("p", "guideMobileOptions.pPick1"),
        ("p", "guideMobileOptions.pPick2"),
        ("h2", "guideMobileOptions.h2Breakdown"),
        ("p", "guideMobileOptions.pBreakdown1"),
        ("p", "guideMobileOptions.pBreakdown2"),
        ("h2", "guideMobileOptions.h2CannotReplace"),
        ("p", "guideMobileOptions.pCannotReplace1"),
    ],
    "check-core-web-vitals-on-iphone.html": [
        ("h2", "guideCwv.h2ThreeMetrics"),
        ("p", "guideCwv.pThreeMetrics1"),
        ("p", "guideCwv.pThreeMetrics2"),
        ("h2", "guideCwv.h2FindReport"),
        ("p", "guideCwv.pFindReport1"),
        ("p", "guideCwv.pFindReport2"),
        ("h2", "guideCwv.h2UsingApp"),
        ("p", "guideCwv.pUsingApp1"),
        ("p", "guideCwv.pUsingApp2"),
        ("h2", "guideCwv.h2FieldVsLab"),
        ("p", "guideCwv.pFieldVsLab1"),
        ("p", "guideCwv.pFieldVsLab2"),
        ("h2", "guideCwv.h2Fixes"),
        ("p", "guideCwv.pFixes1"),
        ("h2", "guideCwv.h2Routine"),
        ("li", "guideCwv.routineStep1"),
        ("li", "guideCwv.routineStep2"),
        ("li", "guideCwv.routineStep3"),
        ("li", "guideCwv.routineStep4"),
        ("p", "guideCwv.pRoutineOutro"),
    ],
    "track-keyword-rankings-from-iphone.html": [
        ("h2", "guideRankings.h2WhatData"),
        ("p", "guideRankings.pWhatData1"),
        ("p", "guideRankings.pWhatData2"),
        ("h2", "guideRankings.h2OpenPerf"),
        ("p", "guideRankings.pOpenPerf1"),
        ("p", "guideRankings.pOpenPerf2"),
        ("h2", "guideRankings.h2FilterQueries"),
        ("p", "guideRankings.pFilterQueries1"),
        ("p", "guideRankings.pFilterQueries2"),
        ("h2", "guideRankings.h2WatchSignals"),
        ("p", "guideRankings.pWatchSignals1"),
        ("p", "guideRankings.pWatchSignals2"),
        ("h2", "guideRankings.h2MobileWorkflow"),
        ("li", "guideRankings.workflowStep1"),
        ("li", "guideRankings.workflowStep2"),
        ("li", "guideRankings.workflowStep3"),
        ("li", "guideRankings.workflowStep4"),
        ("p", "guideRankings.pWorkflowOutro"),
        ("h2", "guideRankings.h2VsTrackers"),
        ("p", "guideRankings.pVsTrackers1"),
        ("p", "guideRankings.pVsTrackers2"),
    ],
}


def merge_en() -> dict:
    en_path = LOCALES / "en.json"
    en = json.loads(en_path.read_text(encoding="utf-8"))
    body = json.loads(BODY_PACK.read_text(encoding="utf-8"))
    for section, keys in body.items():
        en.setdefault(section, {}).update(keys)
    en_path.write_text(json.dumps(en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"merged guide body into {en_path.name}")
    return en


def wire_element(html: str, tag: str, i18n_key: str) -> str:
    if tag == "h2":
        pattern = re.compile(
            r'(<h2 class="guide-heading")(?![^>]*data-i18n)([^>]*>)(.*?)(</h2>)',
            re.DOTALL,
        )
    elif tag == "p":
        pattern = re.compile(
            r'(<p class="guide-body-text")(?![^>]*data-i18n)([^>]*>)(.*?)(</p>)',
            re.DOTALL,
        )
    elif tag == "li":
        pattern = re.compile(
            r'(<ol class="guide-steps">(?:\s*<li[^>]*>.*?</li>)*\s*<li)(?![^>]*data-i18n)([^>]*>)(.*?)(</li>)',
            re.DOTALL,
        )
    else:
        raise ValueError(tag)

    match = pattern.search(html)
    if not match:
        raise RuntimeError(f"missing unwired {tag} for {i18n_key}")
    replacement = (
        f'{match.group(1)} data-i18n="{i18n_key}"{match.group(2)}'
        f"{match.group(3)}{match.group(4)}"
    )
    return html[: match.start()] + replacement + html[match.end() :]


def wire_related_links(html: str, filename: str) -> str:
    links = RELATED_BY_FILE[filename]
    block = re.search(
        r'(<ul class="guide-list guide-list--related">)(.*?)(</ul>)',
        html,
        re.DOTALL,
    )
    if not block:
        raise RuntimeError(f"related list missing in {filename}")

    items = re.findall(r'<li><a href="([^"]+)">([^<]+)</a></li>', block.group(2))
    if len(items) != len(links):
        raise RuntimeError(f"related link count mismatch in {filename}: {len(items)} vs {len(links)}")

    new_items = []
    for (href, _text), (_, i18n_key) in zip(items, links):
        new_items.append(f'          <li><a href="{href}" data-i18n="{i18n_key}">{_text}</a></li>')

    new_block = block.group(1) + "\n" + "\n".join(new_items) + "\n        " + block.group(3)
    return html[: block.start()] + new_block + html[block.end() :]


def wire_guide_steps(html: str, i18n_keys: list[str]) -> str:
    block = re.search(
        r'(<ol class="guide-steps">)(.*?)(</ol>)',
        html,
        re.DOTALL,
    )
    if not block:
        raise RuntimeError("guide-steps block missing")
    inner = block.group(2)
    for key in i18n_keys:
        inner = re.sub(
            r'(\s*<li)(?![^>]*data-i18n)([^>]*>)(.*?)(</li>)',
            rf'\1 data-i18n="{key}"\2\3\4',
            inner,
            count=1,
            flags=re.DOTALL,
        )
    return html[: block.start()] + block.group(1) + inner + block.group(3) + html[block.end() :]


def wire_guides() -> None:
    for filename, order in WIRE_ORDER.items():
        path = GUIDES / filename
        html = path.read_text(encoding="utf-8")
        li_keys = [key for tag, key in order if tag == "li"]
        non_li = [(tag, key) for tag, key in order if tag != "li"]
        for tag, key in non_li:
            html = wire_element(html, tag, key)
        if li_keys:
            html = wire_guide_steps(html, li_keys)
        html = wire_related_links(html, filename)
        path.write_text(html, encoding="utf-8")
        print(f"wired {filename} ({len(order)} blocks + related links)")

    iphone_path = GUIDES / "how-to-use-google-search-console-on-iphone.html"
    html = iphone_path.read_text(encoding="utf-8")
    html = wire_related_links(html, "how-to-use-google-search-console-on-iphone.html")
    iphone_path.write_text(html, encoding="utf-8")
    print("wired how-to-use related links")


def translate_chunk(text: str) -> str:
    q = urllib.parse.quote(text)
    url = (
        "https://translate.googleapis.com/translate_a/single"
        f"?client=gtx&sl=en&tl=hr&dt=t&q={q}"
    )
    with urllib.request.urlopen(url, timeout=45) as resp:
        data = json.loads(resp.read().decode())
    return data[0][0][0]


def translate_long(source: str) -> str:
    protected = source
    html_tags: list[str] = []

    def stash(match: re.Match[str]) -> str:
        html_tags.append(match.group(0))
        return f"⟦{len(html_tags) - 1}⟧"

    protected = re.sub(r"<[^>]+>", stash, protected)
    parts = re.split(r"(?<=[.!?])\s+", protected)
    parts = [part.strip() for part in parts if part.strip()]
    translated = [translate_chunk(part) for part in parts]
    time.sleep(0.12 * len(parts))
    result = " ".join(translated)
    for index, tag in enumerate(html_tags):
        result = result.replace(f"⟦{index}⟧", tag)
    return result


def sync_hr(en: dict) -> None:
    hr_path = LOCALES / "hr.json"
    cache_path = LOCALES / "overlay-packs" / "maps" / "hr.json"
    hr = json.loads(hr_path.read_text(encoding="utf-8"))
    cache = json.loads(cache_path.read_text(encoding="utf-8")) if cache_path.exists() else {}
    body = json.loads(BODY_PACK.read_text(encoding="utf-8"))

    pending = []
    for section, keys in body.items():
        for key, en_val in keys.items():
            hr_val = hr.get(section, {}).get(key)
            if hr_val is None or hr_val == en_val:
                pending.append((section, key, en_val))

    print(f"translating {len(pending)} new guide strings to hr...")
    for index, (section, key, en_val) in enumerate(pending, start=1):
        hr.setdefault(section, {})[key] = translate_long(en_val) if len(en_val) > 80 else translate_chunk(en_val)
        cache[en_val] = hr[section][key]
        if index % 15 == 0:
            print(f"  {index}/{len(pending)}")
        time.sleep(0.12)

    hr_path.write_text(json.dumps(hr, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    cache_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"updated {hr_path.name}")


def main() -> None:
    en = merge_en()
    wire_guides()
    sync_hr(en)


if __name__ == "__main__":
    main()
