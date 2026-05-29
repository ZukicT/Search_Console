import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'overlay-packs', 'maps');

const PATCHES = {
  pt: {
    'SEO Blog | Practical tips from Search Console data':
      'Blog de SEO | Dicas práticas com dados do Search Console',
    'How to Improve Search Click-Through Rate Using Query Data | Search Console blog':
      'Como melhorar a taxa de cliques na pesquisa com dados de consulta | Blog Search Console',
    'How to Find Pages Losing Traffic in Search Console | Search Console blog':
      'Como encontrar páginas perdendo tráfego no Search Console | Blog Search Console',
    'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog':
      'Como priorizar correções de Core Web Vitals que realmente importam | Blog Search Console',
    'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog':
      'Como detectar problemas de indexação antes de perder cliques | Blog Search Console',
  },
  ja: {
    'SEO Blog | Practical tips from Search Console data':
      'SEOブログ | Search Consoleデータに基づく実践的なヒント',
    'How to Improve Search Click-Through Rate Using Query Data | Search Console blog':
      'クエリデータで検索のクリック率を改善する方法 | Search Consoleブログ',
    'How to Find Pages Losing Traffic in Search Console | Search Console blog':
      'Search Consoleでトラフィックが減っているページを見つける方法 | Search Consoleブログ',
    'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog':
      '本当に重要なCore Web Vitalsの修正を優先する方法 | Search Consoleブログ',
    'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog':
      'クリックを失う前にインデックス登録の問題を早期に発見する方法 | Search Consoleブログ',
  },
  ko: {
    'SEO Blog | Practical tips from Search Console data':
      'SEO 블로그 | Search Console 데이터 기반 실전 팁',
    'How to Improve Search Click-Through Rate Using Query Data | Search Console blog':
      '쿼리 데이터로 검색 클릭률을 개선하는 방법 | Search Console 블로그',
    'How to Find Pages Losing Traffic in Search Console | Search Console blog':
      'Search Console에서 트래픽이 줄어드는 페이지를 찾는 방법 | Search Console 블로그',
    'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog':
      '정말 중요한 Core Web Vitals 수정을 우선순위화하는 방법 | Search Console 블로그',
    'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog':
      '클릭 손실 전에 색인 문제를 조기에 잡는 방법 | Search Console 블로그',
  },
  'zh-Hans': {
    'SEO Blog | Practical tips from Search Console data':
      'SEO 博客 | 来自 Search Console 数据的实用技巧',
    'How to Improve Search Click-Through Rate Using Query Data | Search Console blog':
      '如何使用查询数据提高搜索点击率 | Search Console 博客',
    'How to Find Pages Losing Traffic in Search Console | Search Console blog':
      '如何在 Search Console 中找出流量下降的页面 | Search Console 博客',
    'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog':
      '如何优先处理真正重要的 Core Web Vitals 修复 | Search Console 博客',
    'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog':
      '如何在损失点击之前及早发现索引问题 | Search Console 博客',
  },
  'zh-Hant': {
    'SEO Blog | Practical tips from Search Console data':
      'SEO 部落格 | 來自 Search Console 資料的實用技巧',
    'How to Improve Search Click-Through Rate Using Query Data | Search Console blog':
      '如何使用查詢資料提高搜尋點擊率 | Search Console 部落格',
    'How to Find Pages Losing Traffic in Search Console | Search Console blog':
      '如何在 Search Console 中找出流量下降的頁面 | Search Console 部落格',
    'How to Prioritize Core Web Vitals Fixes That Actually Matter | Search Console blog':
      '如何優先處理真正重要的 Core Web Vitals 修復 | Search Console 部落格',
    'How to Catch Indexing Issues Before They Cost Clicks | Search Console blog':
      '如何在損失點擊之前及早發現索引問題 | Search Console 部落格',
  },
};

for (const [code, patches] of Object.entries(PATCHES)) {
  const path = join(dir, `${code}.json`);
  const map = JSON.parse(readFileSync(path, 'utf8'));
  Object.assign(map, patches);
  writeFileSync(path, JSON.stringify(map, null, 2) + '\n', 'utf8');
  console.log('patched', code);
}
