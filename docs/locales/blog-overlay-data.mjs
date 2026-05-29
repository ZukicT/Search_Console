/** Blog overlay English source + German pack input */
const blogEn = {
  metaTitle: 'SEO Blog | Practical tips from Search Console data',
  metaDescription:
    'Actionable SEO guides: improve CTR, find pages losing traffic, prioritize Core Web Vitals fixes, and catch indexing issues early using Google Search Console.',
  eyebrow: 'SEO & Search Console',
  title: 'Site improvement guides',
  lead: 'In-depth guides grounded in Google Search Console documentation: improve CTR, find pages losing traffic, prioritize Core Web Vitals from field data, and catch indexing issues before they spread. Each article links to official Google help pages.',
  featuredLabel: 'Featured',
  readPost: 'Read article',
  allPostsHeading: 'Latest articles',
  resourcesHeading: 'Official resources',
  resourceGsc: 'Google Search Console',
  resourceGscHelp: 'Search Console help center',
  post1Category: 'Performance',
  post1Date: 'May 29, 2026',
  post1Title: 'How to Improve Search Click-Through Rate Using Query Data',
  post1Desc:
    'Use Performance query data the way Google documents it: sort by impressions, find weak CTR, improve title links and snippets, and measure after data settles.',
  post2Category: 'Performance',
  post2Date: 'May 29, 2026',
  post2Title: 'How to Find Pages Losing Traffic in Search Console',
  post2Desc:
    'Compare date ranges on the Pages report, read click vs impression drops together, and rule out indexing before rewriting content.',
  post3Category: 'Page experience',
  post3Date: 'May 29, 2026',
  post3Title: 'How to Prioritize Core Web Vitals Fixes That Actually Matter',
  post3Desc:
    "Use CrUX field data in the Core Web Vitals report, prioritize high-traffic URL groups, and validate fixes on Google's 28-day window.",
  post4Category: 'Indexing',
  post4Date: 'May 29, 2026',
  post4Title: 'How to Catch Indexing Issues Before They Cost Clicks',
  post4Desc:
    'Monitor the Page indexing report and URL Inspection, catch canonical and robots issues early, and use sitemaps as a sanity check.',
  promoEyebrow: 'Search Console on iPhone',
  promoTitle: 'Check your data on the go',
  promoDesc:
    "Independent iOS app connected to Google's Search Console API. Same Google account and properties, in a native app.",
  promoCta: 'Get the app',
  promoNote: 'Not made by or affiliated with Google.',
  backToBlog: 'Back to blog',
  relatedHeading: 'More on the blog',
};

const blogCommonEn = {
  byline: 'By <a href="../about.html">Tarik Zukic</a>',
  datePublished: 'May 29, 2026',
  sourcesTitle: 'Google documentation',
  categoryPerformance: 'Performance',
  categoryPageExperience: 'Page experience',
  categoryIndexing: 'Indexing',
  relatedCtrTitle: 'How to Improve Search Click-Through Rate Using Query Data',
  relatedTrafficTitle: 'How to Find Pages Losing Traffic in Search Console',
  relatedCwvTitle: 'How to Prioritize Core Web Vitals Fixes That Actually Matter',
  relatedIndexingTitle: 'How to Catch Indexing Issues Before They Cost Clicks',
  legendImpressions: 'Impressions',
  legendClicks: 'Clicks',
  legendPreviousPeriod: 'Previous period',
  legendCurrentPeriod: 'Current period',
  statusGood: 'Good',
  statusNeedImprovement: 'Need improvement',
  statusPoor: 'Poor',
  visualLabelBefore: 'Before',
  visualLabelAfter: 'After',
  visualLabelFilteredQuery: 'Filtered query',
  visualPagesTabArrow: '↓ Pages tab',
  visualMetricClicks: 'Clicks',
  visualMetricCtr: 'CTR',
  visualMetricImpressions: 'Impressions',
  visualMetricPosition: 'Position',
  visualPagesHeadPage: 'Page',
  visualPagesHeadPrev: 'Prev',
  visualPagesHeadCurr: 'Curr',
  visualPagesHeadDiff: 'Diff',
};

const blogPostCtrEn = {
  metaTitle: 'How to Improve Search Click-Through Rate Using Query Data | Search Console blog',
  metaDescription:
    'Use Search Console query data to find high-impression keywords with weak CTR and improve titles and meta descriptions.',
  title: 'How to Improve Search Click-Through Rate Using Query Data',
  pIntro:
    'Click-through rate (CTR) in Search Console is clicks divided by impressions for a query, page, or other dimension. Google describes CTR as a useful signal for whether users think your result answers their search. Improving snippets on high-impression queries is often faster than chasing ranking changes because you are already visible.',
  h2Performance: 'What the Performance report actually shows',
  pPerformance1:
    'Open <strong>Performance</strong> for <strong>Search results</strong> in Search Console. The default view covers about the last three months, but you can narrow the range (for example, Last 28 days) when you want a recent, stable window. The chart totals clicks, impressions, average CTR, and average position for your property. The table breaks the same metrics down by dimension: Queries, Pages, Countries, Devices, Search appearance, and Dates.',
  pPerformance2:
    'Newer days can show as <strong>preliminary data</strong> in the chart (Google marks this when you hover). Wait a few days after a title or description change before you judge results, because reporting can lag and early numbers may still move.',
  h2Step1: 'Step 1: Find queries with impressions but weak CTR',
  pStep1Intro: "Google's own workflow for low-CTR pages also applies at the query level:",
  liStep1_1: 'Select the <strong>CTR</strong> metric above the chart.',
  liStep1_2: 'Open the <strong>Queries</strong> tab.',
  liStep1_3: 'Sort by <strong>Impressions</strong> so you see terms where Google already shows you often.',
  liStep1_4: 'Look for queries with meaningful impressions and CTR below your property average.',
  pStep1Outro:
    'Brand queries usually CTR higher than broad informational terms. Prioritize commercial or conversion pages first, but do not ignore informational queries that drive discovery if impressions are large.',
  h2Step2: 'Step 2: Confirm which URL earns the click',
  pStep2:
    'Click a query row, then open the <strong>Pages</strong> tab while that query filter is active. You need the URL Google actually ranks for that term. If the wrong URL appears, fix internal linking, consolidate duplicate content, or adjust on-page focus before you rewrite the snippet. Changing a title on page A will not help if Google prefers page B for that query.',
  h2Step3: 'Step 3: Improve the title link and snippet Google may use',
  pStep3Intro:
    'Google generates title links and snippets automatically. It usually starts from your <code>&lt;title&gt;</code> element and visible page content, and may use your meta description when it better summarizes the page. You cannot force exact wording in live results, but you can follow Google\'s published best practices:',
  liStep3_1:
    '<strong>Title:</strong> Unique, descriptive, concise. Avoid keyword stuffing and repeated boilerplate across pages.',
  liStep3_2:
    '<strong>Meta description:</strong> Accurate summary of that specific page. Google may ignore generic or duplicate descriptions.',
  liStep3_3: '<strong>On-page heading:</strong> Make the main topic obvious so Google does not substitute different text.',
  pStep3Outro:
    'Match language to search intent. If the query is transactional, say what the user gets. If it is informational, state what the page explains. Misleading titles that do not match the page are exactly the kind Google may rewrite.',
  h2Step4: 'Step 4: Use Search appearance and device filters',
  pStep4:
    'CTR differs by device and result type. Filter by <strong>Device</strong> to see whether mobile snippets underperform desktop. Use the <strong>Search appearance</strong> dimension when you have rich results (FAQ, product, and similar). A drop in CTR can reflect a SERP layout change rather than a bad title on the page itself.',
  h2Step5: 'Step 5: Measure in a clean date window',
  pStep5:
    'After you ship changes, compare a fresh date range against the period before the edit. Use the <strong>Date</strong> filter\'s <strong>Compare</strong> tab if you want side-by-side clicks and CTR in one table. Google notes you can run only one comparison at a time. Focus on impressions and clicks over time, not daily average position noise.',
  h2WontFix: 'What CTR work will not fix',
  pWontFix:
    'Low CTR with falling impressions usually points to ranking or indexing problems, not snippet copy alone. Very low impression counts can make CTR swing wildly; ignore tail queries until volume is real. And even perfect snippets cannot help if the page is not indexed or not eligible to appear.',
  visualCaptionCtr: 'High-impression queries with weak CTR',
  visualCaptionPerformance: 'Performance report: sort Queries by Impressions',
  visualMetricsNote:
    '<strong>Queries</strong> tab · sorted by <strong>Impressions</strong> · filter queries below your property average CTR',
  visualCaptionQueryPage: 'Query filter → Pages tab: which URL earns the click',
  visualPagesShare1: '78% clicks',
  visualPagesShare2: '14% clicks',
  visualPagesShare3: '8% clicks',
  visualCaptionSnippet: 'Title and meta description aligned to query intent',
  visualSnippetTitleBefore: 'Search Console App - Home',
  visualSnippetDescBefore: 'Learn about our app. Download today for iOS devices and more features.',
  visualSnippetTitleAfter: 'Google Search Console on iPhone: Mobile App Options',
  visualSnippetDescAfter:
    "Compare official mobile access vs third-party iOS apps that use Google's Search Console API.",
  source1: 'Performance report (Search results) - Search Console Help',
  source2: 'How are you performing on Google? - Search Console Help',
  source3: 'Control your snippets in search results - Google Search Central',
  source4: 'Influencing title links in search results - Google Search Central',
  relatedTraffic: 'How to Find Pages Losing Traffic in Search Console',
  relatedIndexing: 'How to Catch Indexing Issues Before They Cost Clicks',
};

const blogPostTrafficEn = {
  metaTitle: 'How to Find Pages Losing Traffic in Search Console | Search Console blog',
  metaDescription:
    'Compare date ranges in Search Console to spot URLs with falling clicks and impressions before the drop spreads.',
  title: 'How to Find Pages Losing Traffic in Search Console',
  pIntro:
    'Site-wide traffic charts hide which URLs actually changed. The Performance report\'s <strong>Pages</strong> dimension lists search clicks and impressions per URL so you can spot losers, winners, and templates worth investigating.',
  h2Separate: 'Before you panic: separate property trend from page trend',
  pSeparate:
    'Total clicks move for seasonality, algorithm updates, tracking changes, and brand demand. Google recommends using dimensions (page, query, country, device) rather than staring only at the property chart. A flat site total can still contain pages down 40% and others up 30%. Your job is to find the URLs that matter to revenue or content goals.',
  h2Compare: 'Compare two date ranges the way Google documents it',
  pCompareIntro: 'To see what changed period over period:',
  liCompare_1: 'Open <strong>Performance</strong> &gt; <strong>Search results</strong>.',
  liCompare_2: 'Click the <strong>Date</strong> filter at the top.',
  liCompare_3: 'Choose the <strong>Compare</strong> tab.',
  liCompare_4:
    'Pick two ranges (for example, last 28 days vs the previous period, or last week vs the week before).',
  liCompare_5: 'Click <strong>Apply</strong>.',
  pCompareOutro:
    'The chart and table then show both periods. The table often includes a <strong>Difference</strong> column for the metric you select. Switch to the <strong>Pages</strong> tab and sort by click change to surface URLs with the largest drops. Remember: Search Console allows only <strong>one comparison at a time</strong>. Adding a country comparison replaces a date comparison.',
  visualCaptionTraffic: 'Page clicks falling: Compare date ranges',
  visualCaptionPages: 'Pages tab sorted by click difference',
  h2ReadTogether: 'Read clicks and impressions together',
  pReadTogetherIntro: 'Google groups performance by how users interact with results:',
  liRead_1:
    '<strong>Clicks down, impressions stable:</strong> Often snippet, SERP feature, or CTR issue. See our CTR guide before rewriting body content.',
  liRead_2:
    '<strong>Impressions down:</strong> Ranking, demand, or indexing may have changed. Check Indexing and URL Inspection next.',
  liRead_3: '<strong>Both down:</strong> Treat as a broader visibility problem on that URL or template.',
  visualCaptionDiagnosis: 'Diagnose the drop before you rewrite content',
  visualDiagTitle1: 'Snippet or SERP issue',
  visualDiagDesc1:
    'Ranking held but fewer people click. Check title, meta description, and rich result changes first.',
  visualDiagTitle2: 'Visibility or indexing issue',
  visualDiagDesc2:
    'Google shows the URL less often. Open Indexing and URL Inspection before a full content rewrite.',
  visualDiagTitle3: 'Broad ranking or demand shift',
  visualDiagDesc3: 'Compare top queries on the URL and check whether a template-wide pattern appears in Pages.',
  visualDiagClicks: 'Clicks',
  visualDiagImpr: 'Impr',
  h2Slice: 'Slice by device and country',
  pSlice:
    'Use the <strong>Devices</strong> and <strong>Countries</strong> dimensions (or filters) before you rewrite a page. Mobile clicks can fall while desktop holds steady, which points to mobile UX, speed, or mobile-specific ranking rather than the article itself. Country filters help when hreflang, inventory, or local relevance changed for one market.',
  h2Connect: 'Connect drops to real site changes',
  pConnect:
    'Align the drop window with deploy logs, redirect rules, CMS template updates, canonical changes, and content refreshes. If several URLs on the same template fell together, fix the template once. If one URL fell alone, inspect that URL in URL Inspection and compare its top queries in Performance.',
  h2RuleOut: 'Rule out indexing before a full rewrite',
  pRuleOut:
    'A page with zero impressions may simply not be indexed. Google notes that indexed status does not guarantee appearance in every search, but non-indexed URLs will not earn search clicks from Google. For persistent losers, open <strong>Indexing</strong> &gt; <strong>Pages</strong> and URL Inspection before you rewrite thousands of words.',
  h2Weekly: 'Build a lightweight weekly review',
  pWeekly:
    'Every week, run Compare on the Pages tab for your primary date range. Note URLs with large click losses, check indexing status for the worst offenders, and only then decide between snippet work, technical fixes, or content updates. Export is available from the report if you want to track URLs in a spreadsheet.',
  source1: 'Performance report (Search results) - Search Console Help',
  source2: 'How are you performing on Google? - Search Console Help',
  source3: 'Page indexing report - Search Console Help',
  relatedCtr: 'How to Improve Search Click-Through Rate Using Query Data',
  relatedCwv: 'How to Prioritize Core Web Vitals Fixes That Actually Matter',
};

const blogPostCwvEn = {
  metaTitle: 'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog',
  metaDescription:
    'Use Search Console field data to fix URL groups with the most impressions first, not every Poor URL equally.',
  title: 'How to Prioritize Core Web Vitals Fixes That Actually Matter',
  pIntro:
    'Core Web Vitals (CWV) measure real-user loading, interactivity, and visual stability. Search Console shows CWV from field data collected through the Chrome User Experience Report (CrUX), not from a single lab test. That makes the report the right place to prioritize fixes that affect visitors Google already measured.',
  h2Where: 'Where to find the report',
  pWhere1:
    'In Search Console, open <strong>Experience</strong> &gt; <strong>Core Web Vitals</strong>. The overview splits data by <strong>Mobile</strong> and <strong>Desktop</strong>. Google recommends starting with the platform that drives most of your search traffic, which for many sites is mobile.',
  pWhere2:
    'If you see <strong>No data available</strong>, the property may be new in Search Console or CrUX may not yet have enough URL-level data for that device type. You can still test individual URLs with PageSpeed Insights or Lighthouse, but those tools do not replace the field-data report.',
  h2Status: 'How Google assigns Poor, Need improvement, and Good',
  pStatus1:
    'The report groups similar URLs and evaluates three metrics: <strong>LCP</strong> (Largest Contentful Paint), <strong>INP</strong> (Interaction to Next Paint), and <strong>CLS</strong> (Cumulative Layout Shift). Google publishes threshold bands. At a high level for each metric: Good meets the fastest band, Need improvement is in the middle band, and Poor exceeds the slowest threshold.',
  pStatus2:
    'A URL group\'s status equals its <strong>worst</strong> metric on that device. Example: Good LCP plus Poor CLS is labeled Poor. Only <strong>indexed</strong> URLs can appear. The report shows a sample of URL groups meant to represent site-wide experience, not every indexed URL.',
  visualCaptionStatus: 'Core Web Vitals status by metric (mobile field data)',
  visualCaptionThresholds: 'Google threshold bands: Good, Need improvement, Poor',
  visualThresholdLcp: 'LCP (Largest Contentful Paint)',
  visualThresholdInp: 'INP (Interaction to Next Paint)',
  visualThresholdCls: 'CLS (Cumulative Layout Shift)',
  visualThresholdSample: '320ms sample',
  h2Prioritize: 'Prioritize by traffic, not by audit score alone',
  pPrioritize:
    'Search Console is not designed to look up one arbitrary URL\'s status quickly. Google directs you to external tests for that. For prioritization, open Poor or Need improvement groups, note the URL pattern (product template, blog layout, homepage), then cross-check those sections in Performance for impressions and clicks. Fix templates with both CWV problems and meaningful search visibility first.',
  visualCaptionPriority: 'Prioritize URL groups with Poor CWV and high search impressions',
  visualPriorityImprSuffix: 'impr',
  h2Templates: 'Fix shared templates once',
  pTemplatesIntro:
    'URL groups usually share HTML shells, CSS, fonts, tag managers, and hero images. Patching one URL while leaving the template broken wastes time. Typical mobile improvements aligned with Google\'s metric definitions:',
  liTemplate_1:
    '<strong>LCP:</strong> Optimize and prioritize the largest above-the-fold image or text block, improve server response time, remove render-blocking resources where safe.',
  liTemplate_2:
    '<strong>INP:</strong> Reduce long JavaScript tasks on interactive elements such as menus, carts, and filters.',
  liTemplate_3:
    '<strong>CLS:</strong> Set explicit width and height on images and embeds; avoid inserting content above existing content unless space is reserved.',
  h2Lab: 'Use lab tools to debug, not to rank priorities',
  pLab:
    'PageSpeed Insights and Lighthouse help reproduce issues on a specific URL. Google documents important differences: CrUX groups URLs with parameters; PSI often strips parameters. A URL can look fine in lab data but Poor in field data if real users on slow networks dominate. Use lab tools after you pick a group from Search Console.',
  h2Validate: 'Validate after deploy on CrUX timelines',
  pValidate:
    'Field data rolls on a 28-day window. After shipping fixes, allow one to two weeks before expecting movement in the report, then confirm the URL group shifts toward Good. Pair with Performance to ensure clicks did not keep falling during the optimization work.',
  source1: 'Core Web Vitals report - Search Console Help',
  source2: 'Web Vitals - web.dev',
  source3: 'Performance report (Search results) - Search Console Help',
  relatedTraffic: 'How to Find Pages Losing Traffic in Search Console',
  relatedIndexing: 'How to Catch Indexing Issues Before They Cost Clicks',
};

const blogPostIndexingEn = {
  metaTitle: 'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog',
  metaDescription:
    'Monitor indexing coverage, inspect new URLs, and verify important pages stay eligible after site changes.',
  title: 'How to Catch Indexing Issues Before They Cost Clicks',
  pIntro:
    'Indexing means Google crawled a page, processed it, and stored it in Google\'s index where it may become eligible for search results and some other surfaces. A URL can lose clicks while your homepage looks healthy if individual URLs drop out of the index or never get indexed after launch.',
  h2PageReport: 'Use the Page indexing report for site-wide status',
  pPageReport1:
    'Open <strong>Indexing</strong> &gt; <strong>Pages</strong> in Search Console. The summary chart shows counts of indexed and not-indexed URLs Google knows about for your property. The <strong>Why pages aren\'t indexed</strong> table lists reasons (for example, blocked by robots.txt, duplicate without user-selected canonical, crawled - currently not indexed). Click a reason to see example URLs and whether Google considers the source fixable on your site.',
  pPageReport2:
    'Google is explicit: you should not expect 100% of URLs to be indexed. Alternate or duplicate URLs often should stay out of the index while the canonical version is indexed. Focus on canonical URLs that matter for search.',
  h2Inspection: 'Use URL Inspection for one URL at a time',
  pInspectionIntro: 'The URL Inspection tool shows Google\'s indexed version of a specific URL (not a live test unless you run Live Test). It reports:',
  liInspect_1: 'Whether the URL is on Google, not on Google, or on Google with issues.',
  liInspect_2: 'Crawl allowed (robots.txt) and indexing allowed (noindex).',
  liInspect_3: 'User-declared vs Google-selected canonical.',
  liInspect_4: 'Last crawl time and referring sitemap, when available.',
  pInspectionOutro:
    'Important nuance from Google: <strong>URL is on Google</strong> means the URL is indexed and eligible, but it does not guarantee the URL appears in a given search result. Search results personalize by query, location, and history. After you fix a blocking issue, you can request indexing from the tool; Google enforces a daily inspection quota per property.',
  visualCaptionIndex: 'Page indexing report: indexed vs not indexed',
  visualIndexIndexed: 'Indexed',
  visualIndexNotIndexed: 'Not indexed',
  visualIndexKnown: 'Known URLs',
  visualIndexReason1: 'Crawled - currently not indexed',
  visualIndexReason2: 'Duplicate without user-selected canonical',
  visualCaptionInspectOk: 'URL Inspection: indexed version of one URL',
  visualInspectStatusOk: 'URL is on Google',
  visualInspectCheck1: 'Page is indexed · Crawl allowed · Indexing allowed',
  visualInspectCheck2: 'User-declared canonical matches Google-selected canonical',
  visualInspectCheck3: 'Last crawl: May 27, 2026 · Referring sitemap detected',
  visualCaptionInspectBlock: 'URL Inspection: blocking issue example',
  visualInspectStatusBlock: 'URL is not on Google',
  visualInspectBlockCheck1: 'Crawl allowed by robots.txt',
  visualInspectBlockCheck2:
    'Indexing blocked by <code>noindex</code> tag · Page cannot appear in search results',
  visualInspectBlockCheck3: 'Last crawl: May 28, 2026',
  h2Publish: 'Inspect new and changed URLs after publish',
  pPublish:
    'New content can take days to appear in reports. Google suggests sitemaps, internal links, and requesting indexing of important URLs (often starting with the homepage) so crawlers discover pages faster. After launch, run URL Inspection on the live URL to confirm indexing is allowed, fetch succeeded, and the canonical matches your intent.',
  h2Spikes: 'Watch for spikes after migrations and template changes',
  pSpikes:
    'Redirects, HTTPS moves, trailing-slash rules, and CMS changes often produce clusters of duplicates or soft 404s. Verify 301 chains, consistent canonical tags, and that sitemaps list canonical URLs only. Spikes in <strong>Duplicate without user-selected canonical</strong> or <strong>Page with redirect</strong> after a deploy are common early warnings.',
  h2Sitemaps: 'Check sitemaps when indexed counts drift',
  pSitemaps:
    'The <strong>Sitemaps</strong> report shows submitted sitemaps and parsing errors. A stable section of your site should show indexed counts in line with submitted URLs over time. A widening gap after a release may mean Google rejects URLs because of robots rules, noindex tags, or non-canonical URLs in the sitemap file.',
  visualCaptionSitemap: 'Sitemaps report: submitted URLs vs indexed from sitemap',
  visualSitemapSubmitted: 'Submitted',
  visualSitemapIndexed: 'Indexed',
  visualSitemapGap:
    '<strong>28 URLs</strong> in sitemap not indexed — check Page indexing reasons after template or redirect changes.',
  h2Checklist: 'A practical post-deploy checklist',
  pChecklistIntro: 'Within 48 hours of a major release:',
  liCheck_1: 'URL Inspection on the homepage and one template URL per major section.',
  liCheck_2: 'Review new rows in <strong>Why pages aren\'t indexed</strong>.',
  liCheck_3: 'Compare Performance impressions on top URLs week over week.',
  liCheck_4: 'Validate fixes in Search Console when you resolve a labeled issue type.',
  pChecklistOutro: 'Fifteen focused minutes beats guessing from site-wide averages.',
  source1: 'Page indexing report - Search Console Help',
  source2: 'URL Inspection tool - Search Console Help',
  source3: 'Sitemaps report - Search Console Help',
  source4: 'Robots.txt introduction - Google Search Central',
  relatedTraffic: 'How to Find Pages Losing Traffic in Search Console',
  relatedCtr: 'How to Improve Search Click-Through Rate Using Query Data',
};

function countKeys(obj) {
  return Object.keys(obj).length;
}

function localeBlock(navBlog, blog, blogCommon, blogPostCtr, blogPostTraffic, blogPostCwv, blogPostIndexing) {
  return {
    nav: { blog: navBlog },
    blog,
    blogCommon,
    blogPostCtr,
    blogPostTraffic,
    blogPostCwv,
    blogPostIndexing,
  };
}

// Locale packs: only strings that differ from EN structure keys
const locales = {
  de: {
    navBlog: 'Blog',
    blog: {
      metaTitle: 'SEO-Blog | Praxis-Tipps aus Search Console-Daten',
      metaDescription:
        'Umsetzbare SEO-Leitfäden: CTR verbessern, Seiten mit Traffic-Verlust finden, Core Web Vitals priorisieren und Indexierungsprobleme früh erkennen - mit Google Search Console.',
      eyebrow: 'SEO & Search Console',
      title: 'Leitfäden zur Website-Optimierung',
      lead: 'Ausführliche Anleitungen auf Basis der offiziellen Google Search Console-Dokumentation: CTR steigern, Traffic-Verluste auf Seitenebene finden, Core Web Vitals aus Felddaten priorisieren und Indexierungsprobleme beheben, bevor sie sich ausbreiten. Jeder Artikel verlinkt offizielle Google-Hilfeseiten.',
      featuredLabel: 'Empfohlen',
      readPost: 'Artikel lesen',
      allPostsHeading: 'Neueste Artikel',
      resourcesHeading: 'Offizielle Ressourcen',
      resourceGsc: 'Google Search Console',
      resourceGscHelp: 'Search Console-Hilfe',
      post1Category: 'Performance',
      post1Date: '29. Mai 2026',
      post1Title: 'Klickrate in der Google-Suche mit Abfragedaten verbessern',
      post1Desc:
        'Performance-Abfragedaten wie von Google beschrieben nutzen: nach Impressionen sortieren, schwache CTR finden, Titel-Links und Snippets optimieren und nach stabiler Datenlage messen.',
      post2Category: 'Performance',
      post2Date: '29. Mai 2026',
      post2Title: 'Seiten mit Traffic-Verlust in Search Console finden',
      post2Desc:
        'Datumsbereiche im Seitenbericht vergleichen, Klick- und Impressionseinbrüche gemeinsam lesen und Indexierung ausschließen, bevor Inhalte umgeschrieben werden.',
      post3Category: 'Seitenerlebnis',
      post3Date: '29. Mai 2026',
      post3Title: 'Core Web Vitals-Fixes priorisieren, die wirklich zählen',
      post3Desc:
        'CrUX-Felddaten im Core Web Vitals-Bericht nutzen, URL-Gruppen mit viel Traffic zuerst beheben und Fixes im 28-Tage-Fenster von Google validieren.',
      post4Category: 'Indexierung',
      post4Date: '29. Mai 2026',
      post4Title: 'Indexierungsprobleme erkennen, bevor Klicks wegfallen',
      post4Desc:
        'Seitenindexierungsbericht und URL-Prüfung im Blick behalten, Canonical- und robots-Probleme früh beheben und Sitemaps als Plausibilitätscheck nutzen.',
      promoEyebrow: 'Search Console auf dem iPhone',
      promoTitle: 'Daten unterwegs prüfen',
      promoDesc:
        'Unabhängige iOS-App mit Anbindung an die Search Console API von Google. Gleiches Google-Konto und dieselben Properties - nativ auf dem iPhone.',
      promoCta: 'App holen',
      promoNote: 'Nicht von Google erstellt oder mit Google verbunden.',
      backToBlog: 'Zurück zum Blog',
      relatedHeading: 'Weitere Artikel',
    },
    blogCommon: {
      byline: 'Von <a href="../about.html">Tarik Zukic</a>',
      datePublished: '29. Mai 2026',
      sourcesTitle: 'Google-Dokumentation',
      categoryPerformance: 'Performance',
      categoryPageExperience: 'Seitenerlebnis',
      categoryIndexing: 'Indexierung',
      relatedCtrTitle: 'Klickrate in der Google-Suche mit Abfragedaten verbessern',
      relatedTrafficTitle: 'Seiten mit Traffic-Verlust in Search Console finden',
      relatedCwvTitle: 'Core Web Vitals-Fixes priorisieren, die wirklich zählen',
      relatedIndexingTitle: 'Indexierungsprobleme erkennen, bevor Klicks wegfallen',
      legendImpressions: 'Impressionen',
      legendClicks: 'Klicks',
      legendPreviousPeriod: 'Vorheriger Zeitraum',
      legendCurrentPeriod: 'Aktueller Zeitraum',
      statusGood: 'Gut',
      statusNeedImprovement: 'Verbesserung nötig',
      statusPoor: 'Schlecht',
      visualLabelBefore: 'Vorher',
      visualLabelAfter: 'Nachher',
      visualLabelFilteredQuery: 'Gefilterte Abfrage',
      visualPagesTabArrow: '↓ Tab Seiten',
      visualMetricClicks: 'Klicks',
      visualMetricCtr: 'CTR',
      visualMetricImpressions: 'Impressionen',
      visualMetricPosition: 'Position',
      visualPagesHeadPage: 'Seite',
      visualPagesHeadPrev: 'Vorh.',
      visualPagesHeadCurr: 'Akt.',
      visualPagesHeadDiff: 'Diff.',
    },
    blogPostCtr: {
      metaTitle: 'Klickrate mit Abfragedaten verbessern | Search Console Blog',
      metaDescription:
        'Search Console-Abfragedaten nutzen, um Keywords mit vielen Impressionen und schwacher CTR zu finden und Titel sowie Meta-Beschreibungen zu verbessern.',
      title: 'Klickrate in der Google-Suche mit Abfragedaten verbessern',
      pIntro:
        'Die Klickrate (CTR) in Search Console ist Klicks geteilt durch Impressionen für eine Abfrage, Seite oder andere Dimension. Google beschreibt CTR als nützliches Signal dafür, ob Nutzer meinen, Ihr Ergebnis passt zur Suche. Snippets bei Abfragen mit vielen Impressionen zu verbessern ist oft schneller als Ranking-Jagd - Sie sind bereits sichtbar.',
      h2Performance: 'Was der Performance-Bericht wirklich zeigt',
      pPerformance1:
        'Öffnen Sie <strong>Performance</strong> für <strong>Suchergebnisse</strong> in Search Console. Die Standardansicht deckt etwa die letzten drei Monate ab; Sie können den Zeitraum eingrenzen (z. B. Letzte 28 Tage) für ein aktuelles, stabiles Fenster. Das Diagramm summiert Klicks, Impressionen, durchschnittliche CTR und Position für Ihre Property. Die Tabelle schlüsselt dieselben Kennzahlen nach Dimension auf: Abfragen, Seiten, Länder, Geräte, Darstellung in der Suche und Daten.',
      pPerformance2:
        'Neuere Tage können im Diagramm als <strong>vorläufige Daten</strong> erscheinen (Google markiert das beim Hover). Warten Sie einige Tage nach einer Titel- oder Beschreibungsänderung, bevor Sie bewerten - die Meldung kann verzögert sein und frühe Zahlen können noch schwanken.',
      h2Step1: 'Schritt 1: Abfragen mit Impressionen, aber schwacher CTR finden',
      pStep1Intro: 'Googles eigener Workflow für Seiten mit niedriger CTR gilt auch auf Abfrageebene:',
      liStep1_1: 'Wählen Sie die Kennzahl <strong>CTR</strong> über dem Diagramm.',
      liStep1_2: 'Öffnen Sie den Tab <strong>Abfragen</strong>.',
      liStep1_3: 'Sortieren Sie nach <strong>Impressionen</strong>, um Begriffe zu sehen, bei denen Google Sie oft ausspielt.',
      liStep1_4: 'Suchen Sie Abfragen mit relevanten Impressionen und CTR unter dem Property-Durchschnitt.',
      pStep1Outro:
        'Markenabfragen haben meist höhere CTR als breite Informationsbegriffe. Priorisieren Sie kommerzielle oder Conversion-Seiten, aber ignorieren Sie nicht informative Abfragen mit großem Impressionsvolumen.',
      h2Step2: 'Schritt 2: Prüfen, welche URL den Klick erhält',
      pStep2:
        'Klicken Sie eine Abfragezeile an und öffnen Sie den Tab <strong>Seiten</strong>, solange der Abfragefilter aktiv ist. Sie brauchen die URL, die Google für den Begriff tatsächlich rankt. Steht die falsche URL da, korrigieren Sie interne Verlinkung, konsolidieren Sie Duplikate oder schärfen Sie den Seitenfokus, bevor Sie das Snippet umschreiben. Ein neuer Titel auf Seite A hilft nicht, wenn Google Seite B für die Abfrage bevorzugt.',
      h2Step3: 'Schritt 3: Titel-Link und Snippet verbessern, die Google nutzen kann',
      pStep3Intro:
        'Google erzeugt Titel-Links und Snippets automatisch - meist aus Ihrem <code>&lt;title&gt;</code>-Element und sichtbarem Seiteninhalt; die Meta-Beschreibung kann genutzt werden, wenn sie die Seite besser zusammenfasst. Exakte Formulierung in Live-Ergebnissen erzwingen Sie nicht, aber Sie können Googles veröffentlichte Best Practices befolgen:',
      liStep3_1:
        '<strong>Titel:</strong> Eindeutig, beschreibend, knapp. Kein Keyword-Stuffing und keine wiederholte Boilerplate auf vielen Seiten.',
      liStep3_2:
        '<strong>Meta-Beschreibung:</strong> Genaue Zusammenfassung dieser konkreten Seite. Generische oder doppelte Beschreibungen ignoriert Google oft.',
      liStep3_3:
        '<strong>Überschrift auf der Seite:</strong> Hauptthema klar machen, damit Google nicht anderen Text einsetzt.',
      pStep3Outro:
        'Sprache an Suchintention anpassen. Bei transaktionalen Abfragen sagen, was der Nutzer bekommt; bei informativen, was die Seite erklärt. Irreführende Titel, die nicht zur Seite passen, sind genau die Art, die Google umschreiben kann.',
      h2Step4: 'Schritt 4: Darstellung in der Suche und Gerätefilter nutzen',
      pStep4:
        'CTR unterscheidet sich nach Gerät und Ergebnistyp. Filtern Sie nach <strong>Gerät</strong>, ob mobile Snippets schlechter sind als Desktop. Nutzen Sie die Dimension <strong>Darstellung in der Suche</strong> bei Rich Results (FAQ, Produkt usw.). CTR-Einbrüche können SERP-Layout-Änderungen widerspiegeln, nicht nur einen schlechten Seitentitel.',
      h2Step5: 'Schritt 5: In einem sauberen Datumsfenster messen',
      pStep5:
        'Nach dem Rollout einen frischen Zeitraum mit der Zeit vor der Änderung vergleichen. Nutzen Sie im <strong>Datums</strong>-Filter den Tab <strong>Vergleichen</strong> für Klicks und CTR nebeneinander. Google erlaubt nur <strong>einen Vergleich gleichzeitig</strong>. Fokus auf Impressionen und Klicks über die Zeit, nicht auf tägliches Positionsrauschen.',
      h2WontFix: 'Was CTR-Arbeit nicht behebt',
      pWontFix:
        'Niedrige CTR bei fallenden Impressionen deutet meist auf Ranking- oder Indexierungsprobleme, nicht nur auf Snippet-Text. Sehr wenige Impressionen lassen CTR stark schwanken; ignorieren Sie Long-Tail-Abfragen ohne echtes Volumen. Perfekte Snippets helfen nicht, wenn die Seite nicht indexiert ist oder nicht ausspielbereit.',
      visualCaptionCtr: 'Abfragen mit vielen Impressionen und schwacher CTR',
      visualCaptionPerformance: 'Performance-Bericht: Abfragen nach Impressionen sortieren',
      visualMetricsNote:
        'Tab <strong>Abfragen</strong> · sortiert nach <strong>Impressionen</strong> · Abfragen unter dem Property-CTR-Durchschnitt filtern',
      visualCaptionQueryPage: 'Abfragefilter → Tab Seiten: welche URL erhält den Klick',
      visualPagesShare1: '78 % Klicks',
      visualPagesShare2: '14 % Klicks',
      visualPagesShare3: '8 % Klicks',
      visualCaptionSnippet: 'Titel und Meta-Beschreibung passend zur Suchintention',
      visualSnippetTitleBefore: 'Search Console App - Home',
      visualSnippetDescBefore: 'Erfahren Sie mehr über unsere App. Laden Sie sie heute für iOS herunter.',
      visualSnippetTitleAfter: 'Google Search Console auf dem iPhone: Mobile Optionen',
      visualSnippetDescAfter:
        'Offiziellen Mobilzugriff mit Drittanbieter-iOS-Apps vergleichen, die Googles Search Console API nutzen.',
      source1: 'Performance-Bericht (Suchergebnisse) - Search Console-Hilfe',
      source2: 'Wie performen Sie bei Google? - Search Console-Hilfe',
      source3: 'Snippets in Suchergebnissen steuern - Google Search Central',
      source4: 'Titel-Links in Suchergebnissen beeinflussen - Google Search Central',
      relatedTraffic: 'Seiten mit Traffic-Verlust in Search Console finden',
      relatedIndexing: 'Indexierungsprobleme erkennen, bevor Klicks wegfallen',
    },
    blogPostTraffic: {
      metaTitle: 'Seiten mit Traffic-Verlust finden | Search Console Blog',
      metaDescription:
        'Datumsbereiche in Search Console vergleichen, um URLs mit sinkenden Klicks und Impressionen zu erkennen, bevor der Einbruch sich ausbreitet.',
      title: 'Seiten mit Traffic-Verlust in Search Console finden',
      pIntro:
        'Property-weite Traffic-Diagramme verbergen, welche URLs sich wirklich geändert haben. Die Dimension <strong>Seiten</strong> im Performance-Bericht listet Suchklicks und Impressionen pro URL - so erkennen Sie Verlierer, Gewinner und Templates zum Prüfen.',
      h2Separate: 'Vor Panik: Property-Trend von Seitentrend trennen',
      pSeparate:
        'Gesamtklicks schwanken durch Saison, Algorithmus, Tracking und Markennachfrage. Google empfiehlt Dimensionen (Seite, Abfrage, Land, Gerät) statt nur auf das Property-Diagramm zu starren. Ein flaches Gesamtbild kann Seiten mit -40 % und andere mit +30 % enthalten. Finden Sie URLs, die für Umsatz oder Inhaltsziele zählen.',
      h2Compare: 'Zwei Datumsbereiche wie in der Google-Dokumentation vergleichen',
      pCompareIntro: 'So sehen Sie periodische Änderungen:',
      liCompare_1: '<strong>Performance</strong> &gt; <strong>Suchergebnisse</strong> öffnen.',
      liCompare_2: 'Den <strong>Datums</strong>-Filter oben anklicken.',
      liCompare_3: 'Tab <strong>Vergleichen</strong> wählen.',
      liCompare_4:
        'Zwei Bereiche wählen (z. B. letzte 28 Tage vs. Vorperiode oder letzte vs. vorletzte Woche).',
      liCompare_5: '<strong>Übernehmen</strong> klicken.',
      pCompareOutro:
        'Diagramm und Tabelle zeigen dann beide Perioden, oft mit Spalte <strong>Differenz</strong>. Wechseln Sie zum Tab <strong>Seiten</strong> und sortieren Sie nach Klickänderung für die größten Einbrüche. Search Console erlaubt nur <strong>einen Vergleich gleichzeitig</strong> - ein Ländervergleich ersetzt einen Datumsvergleich.',
      visualCaptionTraffic: 'Sinkende Seitenklicks: Datumsbereiche vergleichen',
      visualCaptionPages: 'Tab Seiten nach Klickdifferenz sortiert',
      h2ReadTogether: 'Klicks und Impressionen gemeinsam lesen',
      pReadTogetherIntro: 'Google ordnet Performance nach Nutzerinteraktion mit Ergebnissen:',
      liRead_1:
        '<strong>Klicks runter, Impressionen stabil:</strong> Oft Snippet, SERP-Feature oder CTR. Zuerst unseren CTR-Leitfaden, bevor Body-Text umgeschrieben wird.',
      liRead_2:
        '<strong>Impressionen runter:</strong> Ranking, Nachfrage oder Indexierung könnte sich geändert haben. Als Nächstes Indexierung und URL-Prüfung.',
      liRead_3: '<strong>Beides runter:</strong> Als breiteres Sichtbarkeitsproblem auf URL oder Template behandeln.',
      visualCaptionDiagnosis: 'Einbruch diagnostizieren, bevor Inhalte umgeschrieben werden',
      visualDiagTitle1: 'Snippet- oder SERP-Problem',
      visualDiagDesc1:
        'Ranking hielt, aber weniger Klicks. Zuerst Titel, Meta-Beschreibung und Rich-Result-Änderungen prüfen.',
      visualDiagTitle2: 'Sichtbarkeits- oder Indexierungsproblem',
      visualDiagDesc2:
        'Google zeigt die URL seltener. Indexierung und URL-Prüfung vor einem vollen Content-Rewrite.',
      visualDiagTitle3: 'Breiter Ranking- oder Nachfrage-Shift',
      visualDiagDesc3: 'Top-Abfragen der URL vergleichen und prüfen, ob ein Template-Muster in Seiten sichtbar ist.',
      visualDiagClicks: 'Klicks',
      visualDiagImpr: 'Impr.',
      h2Slice: 'Nach Gerät und Land aufschlüsseln',
      pSlice:
        'Nutzen Sie die Dimensionen <strong>Geräte</strong> und <strong>Länder</strong> (oder Filter), bevor Sie eine Seite umschreiben. Mobile Klicks können fallen, während Desktop stabil bleibt - Hinweis auf mobiles UX, Geschwindigkeit oder mobiles Ranking. Länderfilter helfen bei hreflang, Bestand oder lokaler Relevanz.',
      h2Connect: 'Einbrüche mit echten Site-Änderungen verknüpfen',
      pConnect:
        'Einbruchsfenster mit Deploy-Logs, Redirects, CMS-Templates, Canonicals und Content-Updates abgleichen. Mehrere URLs eines Templates gemeinsam gefallen? Template einmal fixen. Nur eine URL? URL-Prüfung und Top-Abfragen in Performance.',
      h2RuleOut: 'Indexierung ausschließen vor vollem Rewrite',
      pRuleOut:
        'Null Impressionen können bedeuten: nicht indexiert. Indexiert heißt nicht garantiert in jeder Suche sichtbar, aber nicht indexierte URLs bringen keine Suchklicks von Google. Bei Dauer-Verlierern: <strong>Indexierung</strong> &gt; <strong>Seiten</strong> und URL-Prüfung vor tausenden neuen Wörtern.',
      h2Weekly: 'Leichtes wöchentliches Review aufbauen',
      pWeekly:
        'Wöchentlich Vergleich im Tab Seiten für Ihren Hauptzeitraum. URLs mit großen Klickverlusten notieren, Indexierung der schlimmsten Fälle prüfen, dann Snippet-, Technik- oder Content-Maßnahmen wählen. Export aus dem Bericht für Spreadsheet-Tracking möglich.',
      source1: 'Performance-Bericht (Suchergebnisse) - Search Console-Hilfe',
      source2: 'Wie performen Sie bei Google? - Search Console-Hilfe',
      source3: 'Seitenindexierungsbericht - Search Console-Hilfe',
      relatedCtr: 'Klickrate in der Google-Suche mit Abfragedaten verbessern',
      relatedCwv: 'Core Web Vitals-Fixes priorisieren, die wirklich zählen',
    },
    blogPostCwv: {
      metaTitle: 'Core Web Vitals sinnvoll priorisieren | Search Console Blog',
      metaDescription:
        'Search Console-Felddaten nutzen: URL-Gruppen mit den meisten Impressionen zuerst beheben, nicht jede „Schlecht“-URL gleich behandeln.',
      title: 'Core Web Vitals-Fixes priorisieren, die wirklich zählen',
      pIntro:
        'Core Web Vitals (CWV) messen Ladezeit, Interaktivität und visuelle Stabilität echter Nutzer. Search Console zeigt CWV aus Felddaten des Chrome User Experience Report (CrUX), nicht aus einem einzelnen Labortest. Dort priorisieren Sie Fixes für Besucher, die Google bereits gemessen hat.',
      h2Where: 'Wo Sie den Bericht finden',
      pWhere1:
        'In Search Console: <strong>Seitenerlebnis</strong> &gt; <strong>Core Web Vitals</strong>. Die Übersicht trennt <strong>Mobil</strong> und <strong>Desktop</strong>. Google empfiehlt, mit der Plattform zu starten, die den meisten Suchtraffic bringt - oft Mobil.',
      pWhere2:
        'Bei <strong>Keine Daten verfügbar</strong> ist die Property neu oder CrUX hat noch zu wenig URL-Daten. Einzelne URLs können Sie mit PageSpeed Insights oder Lighthouse testen; die ersetzen den Felddaten-Bericht nicht.',
      h2Status: 'Wie Google Schlecht, Verbesserung nötig und Gut vergibt',
      pStatus1:
        'Der Bericht gruppiert ähnliche URLs und bewertet <strong>LCP</strong>, <strong>INP</strong> und <strong>CLS</strong>. Google veröffentlicht Schwellen: Gut im schnellsten Band, Verbesserung nötig in der Mitte, Schlecht über der langsamen Grenze.',
      pStatus2:
        'Der Status einer URL-Gruppe entspricht der <strong>schlechtesten</strong> Kennzahl auf dem Gerät. Beispiel: Gut LCP plus Schlecht CLS = Schlecht. Nur <strong>indexierte</strong> URLs erscheinen. Der Bericht zeigt Stichproben-Gruppen für das Gesamterlebnis, nicht jede indexierte URL.',
      visualCaptionStatus: 'Core Web Vitals-Status nach Kennzahl (mobile Felddaten)',
      visualCaptionThresholds: 'Google-Schwellen: Gut, Verbesserung nötig, Schlecht',
      visualThresholdLcp: 'LCP (Largest Contentful Paint)',
      visualThresholdInp: 'INP (Interaction to Next Paint)',
      visualThresholdCls: 'CLS (Cumulative Layout Shift)',
      visualThresholdSample: 'Beispiel 320 ms',
      h2Prioritize: 'Nach Traffic priorisieren, nicht nur nach Audit-Score',
      pPrioritize:
        'Search Console ist nicht für schnellen Status einer beliebigen URL gebaut - dafür externe Tests. Für Priorisierung: Gruppen Schlecht/Verbesserung nötig öffnen, URL-Muster notieren (Produkt-Template, Blog, Homepage), in Performance Impressionen und Klicks prüfen. Zuerst Templates mit CWV-Problemen und relevanter Sichtbarkeit.',
      visualCaptionPriority: 'URL-Gruppen mit schlechten CWV und vielen Suchimpressionen priorisieren',
      visualPriorityImprSuffix: 'Impr.',
      h2Templates: 'Gemeinsame Templates einmal beheben',
      pTemplatesIntro:
        'URL-Gruppen teilen oft HTML-Hülle, CSS, Fonts, Tag Manager und Hero-Bilder. Eine URL patchen bei kaputtem Template verschwendet Zeit. Typische mobile Verbesserungen nach Googles Metrik-Definitionen:',
      liTemplate_1:
        '<strong>LCP:</strong> Größtes Above-the-fold-Element optimieren, Serverantwort verbessern, render-blockierende Ressourcen sicher reduzieren.',
      liTemplate_2:
        '<strong>INP:</strong> Lange JavaScript-Tasks bei Menüs, Warenkorb, Filtern reduzieren.',
      liTemplate_3:
        '<strong>CLS:</strong> Breite und Höhe für Bilder/Embeds setzen; keinen Inhalt oberhalb bestehender Inhalte ohne reservierten Platz einfügen.',
      h2Lab: 'Lab-Tools zum Debuggen, nicht zur Priorisierung',
      pLab:
        'PageSpeed Insights und Lighthouse reproduzieren Probleme pro URL. Google dokumentiert Unterschiede: CrUX gruppiert URLs mit Parametern; PSI streicht Parameter oft. Lab gut, Felddaten schlecht ist möglich bei langsamen echten Nutzern. Lab-Tools nach Gruppenwahl aus Search Console.',
      h2Validate: 'Nach Deploy auf CrUX-Zeitachsen validieren',
      pValidate:
        'Felddaten laufen über 28 Tage. Nach Fixes ein bis zwei Wochen warten, dann prüfen, ob die Gruppe Richtung Gut wandert. Mit Performance abgleichen, ob Klicks während der Optimierung weiter fielen.',
      source1: 'Core Web Vitals-Bericht - Search Console-Hilfe',
      source2: 'Web Vitals - web.dev',
      source3: 'Performance-Bericht (Suchergebnisse) - Search Console-Hilfe',
      relatedTraffic: 'Seiten mit Traffic-Verlust in Search Console finden',
      relatedIndexing: 'Indexierungsprobleme erkennen, bevor Klicks wegfallen',
    },
    blogPostIndexing: {
      metaTitle: 'Indexierungsprobleme früh erkennen | Search Console Blog',
      metaDescription:
        'Indexierungsabdeckung überwachen, neue URLs prüfen und wichtige Seiten nach Änderungen weiterhin für die Suche freigeben.',
      title: 'Indexierungsprobleme erkennen, bevor Klicks wegfallen',
      pIntro:
        'Indexierung heißt: Google hat die Seite gecrawlt, verarbeitet und im Index gespeichert, wo sie für Suchergebnisse u. a. in Frage kommen kann. Eine URL kann Klicks verlieren, während die Homepage gesund wirkt, wenn einzelne URLs aus dem Index fallen oder nach Launch nie indexiert wurden.',
      h2PageReport: 'Seitenindexierungsbericht für den Gesamtstatus',
      pPageReport1:
        'Öffnen Sie <strong>Indexierung</strong> &gt; <strong>Seiten</strong>. Das Übersichtsdiagramm zeigt indexierte und nicht indexierte URLs Ihrer Property. Die Tabelle <strong>Warum Seiten nicht indexiert sind</strong> listet Gründe (z. B. durch robots.txt blockiert, Duplikat ohne vom Nutzer gewähltes Canonical, gecrawlt - derzeit nicht indexiert). Klicken Sie einen Grund für Beispiel-URLs und ob Google die Quelle auf Ihrer Site behebbar hält.',
      pPageReport2:
        'Google ist klar: 100 % Indexierung ist nicht zu erwarten. Alternate- oder Duplikat-URLs gehören oft nicht in den Index, während die Canonical-Version indexiert ist. Fokus auf Canonical-URLs, die für die Suche zählen.',
      h2Inspection: 'URL-Prüfung für eine URL',
      pInspectionIntro:
        'Die URL-Prüfung zeigt Googles indexierte Version einer URL (kein Live-Test, außer Sie starten Live-Test). Sie meldet:',
      liInspect_1: 'Ob die URL bei Google ist, nicht bei Google ist oder mit Problemen bei Google ist.',
      liInspect_2: 'Crawl erlaubt (robots.txt) und Indexierung erlaubt (noindex).',
      liInspect_3: 'Vom Nutzer deklariertes vs. von Google gewähltes Canonical.',
      liInspect_4: 'Letzter Crawl und verweisende Sitemap, wenn verfügbar.',
      pInspectionOutro:
        'Wichtige Nuance: <strong>URL ist bei Google</strong> heißt indexiert und berechtigt, garantiert aber kein Erscheinen in einem konkreten Suchergebnis. Ergebnisse personalisieren sich. Nach Behebung eines Blockers können Sie Indexierung anfordern; Google setzt ein tägliches Prüfkontingent pro Property.',
      visualCaptionIndex: 'Seitenindexierung: indexiert vs. nicht indexiert',
      visualIndexIndexed: 'Indexiert',
      visualIndexNotIndexed: 'Nicht indexiert',
      visualIndexKnown: 'Bekannte URLs',
      visualIndexReason1: 'Gecrawlt - derzeit nicht indexiert',
      visualIndexReason2: 'Duplikat ohne vom Nutzer gewähltes Canonical',
      visualCaptionInspectOk: 'URL-Prüfung: indexierte Version einer URL',
      visualInspectStatusOk: 'URL ist bei Google',
      visualInspectCheck1: 'Seite indexiert · Crawl erlaubt · Indexierung erlaubt',
      visualInspectCheck2: 'Nutzer-Canonical entspricht Google-Canonical',
      visualInspectCheck3: 'Letzter Crawl: 27. Mai 2026 · Verweisende Sitemap erkannt',
      visualCaptionInspectBlock: 'URL-Prüfung: Blockierungsbeispiel',
      visualInspectStatusBlock: 'URL ist nicht bei Google',
      visualInspectBlockCheck1: 'Crawl durch robots.txt erlaubt',
      visualInspectBlockCheck2:
        'Indexierung durch <code>noindex</code>-Tag blockiert · Seite kann nicht in Suchergebnissen erscheinen',
      visualInspectBlockCheck3: 'Letzter Crawl: 28. Mai 2026',
      h2Publish: 'Neue und geänderte URLs nach Veröffentlichung prüfen',
      pPublish:
        'Neue Inhalte brauchen Tage in Berichten. Google empfiehlt Sitemaps, interne Links und Indexierungsanfragen wichtiger URLs (oft Homepage), damit Crawler schneller finden. Nach Launch URL-Prüfung auf der Live-URL: Indexierung erlaubt, Abruf ok, Canonical passt.',
      h2Spikes: 'Spitzen nach Migrationen und Template-Änderungen',
      pSpikes:
        'Redirects, HTTPS, Slash-Regeln und CMS-Wechsel erzeugen oft Duplikat- oder Soft-404-Cluster. 301-Ketten, konsistente Canonicals und Sitemaps nur mit Canonical-URLs prüfen. Spitzen bei <strong>Duplikat ohne vom Nutzer gewähltes Canonical</strong> oder <strong>Seite mit Weiterleitung</strong> nach Deploy sind frühe Warnsignale.',
      h2Sitemaps: 'Sitemaps prüfen, wenn Index-Zahlen driften',
      pSitemaps:
        'Der Bericht <strong>Sitemaps</strong> zeigt eingereichte Sitemaps und Parse-Fehler. Stabile Bereiche sollten indexierte Zahlen im Einklang mit eingereichten URLs zeigen. Wachsende Lücke nach Release kann robots, noindex oder nicht-canonical URLs in der Sitemap bedeuten.',
      visualCaptionSitemap: 'Sitemaps: eingereichte vs. aus Sitemap indexierte URLs',
      visualSitemapSubmitted: 'Eingereicht',
      visualSitemapIndexed: 'Indexiert',
      visualSitemapGap:
        '<strong>28 URLs</strong> in Sitemap nicht indexiert — Seitenindexierungsgründe nach Template- oder Redirect-Änderungen prüfen.',
      h2Checklist: 'Praktische Checkliste nach Deploy',
      pChecklistIntro: 'Innerhalb von 48 Stunden nach großem Release:',
      liCheck_1: 'URL-Prüfung für Homepage und je ein Template-URL pro Hauptbereich.',
      liCheck_2: 'Neue Zeilen in <strong>Warum Seiten nicht indexiert sind</strong> prüfen.',
      liCheck_3: 'Performance-Impressionen Top-URLs Woche über Woche vergleichen.',
      liCheck_4: 'Fixes in Search Console validieren, wenn ein Problemtyp behoben ist.',
      pChecklistOutro: 'Fünfzehn fokussierte Minuten schlagen Raten aus Property-Durchschnitten.',
      source1: 'Seitenindexierungsbericht - Search Console-Hilfe',
      source2: 'URL-Prüfung - Search Console-Hilfe',
      source3: 'Sitemaps-Bericht - Search Console-Hilfe',
      source4: 'Einführung robots.txt - Google Search Central',
      relatedTraffic: 'Seiten mit Traffic-Verlust in Search Console finden',
      relatedCtr: 'Klickrate in der Google-Suche mit Abfragedaten verbessern',
    },
  },
};

export { blogEn, blogCommonEn, blogPostCtrEn, blogPostTrafficEn, blogPostCwvEn, blogPostIndexingEn, locales };
