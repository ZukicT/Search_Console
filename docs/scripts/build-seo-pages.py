#!/usr/bin/env python3
"""Generate features.html and faq.html from index.html content for SEO."""

from __future__ import annotations

import json
import re
from pathlib import Path

DOCS = Path(__file__).resolve().parents[1]
INDEX = DOCS / "index.html"
FEATURES = DOCS / "features.html"
EN = DOCS / "locales" / "en.json"
APP_STORE = "https://apps.apple.com/us/app/search-console/id6758431981"
CSS_VERSION = "78"
CHART_CSS_VERSION = "12"
JS_VERSION = "16"


def strip_html(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", value)).strip()


def extract_section(html: str, section_id: str) -> str:
    pattern = rf'(<section[^>]*id="{section_id}"[^>]*>.*?</section>)'
    match = re.search(pattern, html, re.S)
    if not match:
        raise ValueError(f"Section #{section_id} not found")
    return match.group(1)


def extract_chart_showcase(features_html: str) -> str:
    match = re.search(
        r'(<div class="chart-grid chart-grid--showcase">.*?</div>\n        )<ul class="feature-stack',
        features_html,
        re.S,
    )
    if not match:
        raise ValueError("chart-grid--showcase block not found in features.html")
    return match.group(1)


def promote_chapter_title_to_h1(section: str) -> str:
    section = section.replace(
        '<h2 class="chapter-title"',
        '<h1 class="chapter-title"',
        1,
    )
    return re.sub(
        r'(<h1 class="chapter-title"[^>]*>.*?</)h2>',
        r"\1h1>",
        section,
        count=1,
        flags=re.S,
    )


def extract_feature_stack(section: str) -> str:
    match = re.search(
        r'(<ul class="feature-stack reveal-stagger" data-reveal>.*?</ul>)',
        section,
        re.S,
    )
    if not match:
        raise ValueError("feature-stack block not found")
    return match.group(1)


def features_outro() -> str:
    return f"""
        <div class="page-features-outro reveal-stagger" data-reveal>
          <p class="chapter-lead">
            Search Console for iOS is a native google search console ios app built for quick reads between meetings, commutes, and site checks.
            Each screen maps to a question you already ask in the web console, without hunting through desktop tabs on a small screen.
          </p>
          <p class="chapter-lead">
            Sign in with Google, pick a property, and move from traffic overview to queries, pages, Core Web Vitals, URL inspection, and sitemaps.
            Export CSV or download a PDF report when you need to share numbers with a client or teammate.
          </p>
          <p class="page-cta-row">
            <a href="{APP_STORE}" class="btn btn-primary" target="_blank" rel="noopener">Download on the App Store</a>
          </p>
          <p class="page-disclaimer">Not affiliated with Google.</p>
        </div>"""


def faq_schema_block() -> str:
    faq = json.loads(EN.read_text())["faq"]
    main_entity = []
    for i in range(1, 18):
        q = faq.get(f"q{i}")
        a = faq.get(f"a{i}")
        if not isinstance(q, str) or not isinstance(a, str):
            continue
        main_entity.append(
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": strip_html(a)},
            }
        )
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".faq-question", ".faq-answer-inner"],
        },
        "mainEntity": main_entity,
    }
    return (
        '  <script type="application/ld+json" id="faq-schema">\n'
        + json.dumps(schema, indent=2)
        + "\n  </script>"
    )


def page_shell(
    *,
    title: str,
    description: str,
    canonical: str,
    og_type: str,
    body_class: str,
    extra_head: str,
    main_content: str,
    include_chart_styles: bool = False,
) -> str:
    chart_css = ""
    if include_chart_styles:
        chart_css = f'\n  <link rel="stylesheet" href="css/performance-chart.css?v={CHART_CSS_VERSION}">'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="{canonical}">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
  <link rel="icon" type="image/png" href="favicon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <meta name="robots" content="index, follow">
  <meta name="download-ping-api" content="https://search-console-nine.vercel.app">
  <meta name="author" content="Tarik Zukic">
  <meta name="theme-color" content="#000000">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:type" content="{og_type}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="https://search-console.org/og/social-card.jpg?v=2">
  <meta property="og:image:secure_url" content="https://search-console.org/og/social-card.jpg?v=2">
  <meta property="og:image:width" content="2064">
  <meta property="og:image:height" content="2064">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="Search Console for iOS. See how your site performs in search. Same account. Same data. Built for iPhone.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="https://search-console.org/og/social-card.gif?v=2">
  <link rel="stylesheet" href="css/style.css?v={CSS_VERSION}">{chart_css}
{extra_head}
</head>
<body class="{body_class}">
  <div class="scroll-progress" id="scroll-progress" aria-hidden="true"></div>
  <a class="skip-link" href="#main" data-i18n="aria.skipToContent">Skip to content</a>
  <header class="header"></header>
  <main id="main">
{main_content}
  </main>
  <footer class="footer"></footer>
  <script src="js/hero-dot-wave.js?v=14"></script>
  <script src="js/site-charts.js?v=14"></script>
  <script src="js/site-ui.js?v=16"></script>
  <script src="js/i18n.js?v=14"></script>
  <script src="js/site-chrome-scripts.js?v=14"></script>
</body>
</html>
"""


def build_features(index_html: str) -> None:
    section = extract_section(index_html, "features")
    section = promote_chapter_title_to_h1(section)
    section = re.sub(
        r'<p class="chapter-lead reveal" data-reveal style="margin-top: 1.25rem;">.*?</p>\s*',
        "",
        section,
        flags=re.S,
        count=1,
    )
    section = re.sub(
        r'<p class="chapter-bridge reveal" data-reveal>.*?</p>\s*',
        "",
        section,
        flags=re.S,
        count=1,
    )

    header_match = re.search(
        r'(<header class="chapter-header reveal-stagger" data-reveal>.*?</header>)',
        section,
        re.S,
    )
    if not header_match:
        raise ValueError("features header not found")
    header = header_match.group(1)

    feature_stack = extract_feature_stack(section)
    chart_showcase = extract_chart_showcase(FEATURES.read_text())

    main = f"""    <section class="story-chapter story-chapter--alt page-features-intro" id="features">
      <div class="story-chapter__inner">
        {header}
      </div>
    </section>
    <section class="story-chapter story-chapter--wide page-features-showcase">
      <div class="story-chapter__inner">
        {chart_showcase}
      </div>
    </section>
    <section class="story-chapter story-chapter--alt page-features-detail">
      <div class="story-chapter__inner">
        {feature_stack}
        {features_outro()}
      </div>
    </section>"""

    extra = """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Google Search Console iOS App Features",
    "description": "Feature overview for Search Console for iOS, an independent native app for Google Search Console data on iPhone and iPad.",
    "url": "https://search-console.org/features.html",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Search Console for iOS",
      "url": "https://search-console.org/"
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://search-console.org/"},
      {"@type": "ListItem", "position": 2, "name": "Features", "item": "https://search-console.org/features.html"}
    ]
  }
  </script>"""

    html = page_shell(
        title="Google Search Console iOS App Features | Search Console for iOS",
        description="See what the independent Search Console iOS app covers: traffic, queries, pages, Core Web Vitals, URL inspection, exports, and alerts. Not made by Google.",
        canonical="https://search-console.org/features.html",
        og_type="website",
        body_class="page-features",
        extra_head=extra,
        main_content=main,
        include_chart_styles=True,
    )
    FEATURES.write_text(html)
    print("wrote features.html")


def build_faq(index_html: str) -> None:
    section = extract_section(index_html, "faq")
    section = promote_chapter_title_to_h1(section)
    intro = """
        <p class="chapter-lead page-faq-lead reveal" data-reveal>
          Answers about the google search console app for iPhone: data access, pricing, Google affiliation, and day-to-day use.
        </p>
        <p class="page-disclaimer reveal" data-reveal>Not affiliated with Google.</p>
    """
    section = section.replace(
        '<section class="story-chapter faq" id="faq">',
        '<section class="story-chapter faq page-faq-intro" id="faq">',
        1,
    )
    section = section.replace(
        '<div class="faq-grid reveal-stagger" data-reveal>',
        intro + '\n        <div class="faq-grid reveal-stagger" data-reveal>',
        1,
    )

    extra = faq_schema_block() + """
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://search-console.org/"},
      {"@type": "ListItem", "position": 2, "name": "FAQ", "item": "https://search-console.org/faq.html"}
    ]
  }
  </script>"""

    html = page_shell(
        title="Google Search Console App for iPhone FAQ | Search Console for iOS",
        description="FAQ for the independent Search Console iOS app: official Google app, pricing, data safety, iPad support, and how to sign in. Not made by Google.",
        canonical="https://search-console.org/faq.html",
        og_type="website",
        body_class="page-faq",
        extra_head=extra,
        main_content=f"    {section}",
    )
    (DOCS / "faq.html").write_text(html)
    print("wrote faq.html")


def main() -> None:
    index_html = INDEX.read_text()
    build_features(index_html)
    build_faq(index_html)


if __name__ == "__main__":
    main()
