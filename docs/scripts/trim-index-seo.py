#!/usr/bin/env python3
"""Trim index.html features/FAQ to teasers and remove duplicate FAQ schema."""

from __future__ import annotations

import re
from pathlib import Path

INDEX = Path(__file__).resolve().parents[1] / "index.html"


def main() -> None:
    html = INDEX.read_text()

    html = re.sub(
        r'  <script type="application/ld\+json" id="faq-schema">.*?</script>\n',
        "",
        html,
        count=1,
        flags=re.S,
    )

    html = html.replace(
        '"url": "https://search-console.org/#faq"',
        '"url": "https://search-console.org/faq.html"',
    )

    html = html.replace(
        """        </ol>
        <p class="chapter-bridge reveal" data-reveal>
          <a href="#features" class="chapter-bridge__link">
            <span data-i18n="story.bridgeToFeatures">Continue · What each view answers</span>""",
        """        </ol>
        <p class="chapter-lead reveal" data-reveal style="margin-top: 1.5rem;">
          New to mobile workflows? Browse the <a href="guides/index.html">Search Console guides for iPhone</a>.
        </p>
        <p class="chapter-bridge reveal" data-reveal>
          <a href="#features" class="chapter-bridge__link">
            <span data-i18n="story.bridgeToFeatures">Continue · What each view answers</span>""",
        1,
    )

    html = re.sub(
        r'        <div class="chart-grid chart-grid--showcase">.*?</div>\n        <ul class="feature-stack',
        '        <ul class="feature-stack',
        html,
        count=1,
        flags=re.S,
    )

    html = re.sub(
        r'(          <li class="feature-stack__item">\n            <div class="feature-stack__icon" aria-hidden="true">\n              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />.*?</li>\n)(          <li class="feature-stack__item">\n            <div class="feature-stack__icon" aria-hidden="true">\n              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />.*?</li>\n)+',
        r"\1",
        html,
        count=1,
        flags=re.S,
    )

    html = html.replace(
        """        </ul>
        <p class="chapter-bridge reveal" data-reveal>
          <a href="#screenshots" class="chapter-bridge__link">
            <span data-i18n="story.bridgeToScreens">Continue · Walk through the app</span>""",
        """        </ul>
        <p class="chapter-lead reveal" data-reveal style="margin-top: 1.25rem;">
          <a href="features.html">See all google search console ios app features</a>
        </p>
        <p class="chapter-bridge reveal" data-reveal>
          <a href="#screenshots" class="chapter-bridge__link">
            <span data-i18n="story.bridgeToScreens">Continue · Walk through the app</span>""",
        1,
    )

    html = re.sub(
        r'(          <div class="faq-item">\n            <button class="faq-question">\n              <span data-i18n="faq.q4">.*?</div>\n          </div>\n)(          <div class="faq-item">.*?)+(\n        </div>\n      </div>\n    </section>\n\n    <section class="story-chapter cta-section)',
        r'\1        <p class="chapter-lead reveal" data-reveal style="margin-top: 1.25rem;">\n          <a href="faq.html">Read the full google search console app for iPhone FAQ</a> (17 questions).\n        </p>\n\3',
        html,
        count=1,
        flags=re.S,
    )

    INDEX.write_text(html)
    print("trimmed index.html")


if __name__ == "__main__":
    main()
