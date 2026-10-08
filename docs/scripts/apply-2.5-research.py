#!/usr/bin/env python3
"""Copy changes from the October 2026 audience and keyword research, in every locale.

Leads with the phrase people search for, states the prerequisite and independence next to the
download button, and says plainly that one website is free.
Run from docs/:  python3 scripts/apply-2.5-research.py
Order of each list: en, de, fr, pt, hr, ja, ko, zh-Hans, zh-Hant.
"""
import json
from pathlib import Path

LOCALES = ["en", "de", "fr", "pt", "hr", "ja", "ko", "zh-Hans", "zh-Hant"]

COPY = {
  "meta.title": [
    "Google Search Console App for iPhone | Search Console",
    "Google Search Console App für iPhone | Search Console",
    "App Google Search Console pour iPhone | Search Console",
    "App do Google Search Console para iPhone | Search Console",
    "Google Search Console aplikacija za iPhone | Search Console",
    "iPhone 向け Google Search Console アプリ | Search Console",
    "iPhone용 Google Search Console 앱 | Search Console",
    "适用于 iPhone 的 Google Search Console 应用 | Search Console",
    "適用於 iPhone 的 Google Search Console App | Search Console",
  ],
  "meta.description": [
    "Check Google Search Console clicks, impressions, queries and top pages on your iPhone. Connect your existing account with this independent iOS app. Free for one website.",
    "Prüfe Klicks, Impressionen, Suchanfragen und Top-Seiten der Google Search Console auf dem iPhone. Verbinde dein bestehendes Konto mit dieser unabhängigen iOS-App. Kostenlos für eine Website.",
    "Consultez les clics, impressions, requêtes et pages principales de Google Search Console sur iPhone. Connectez votre compte existant à cette app iOS indépendante. Gratuit pour un site.",
    "Veja cliques, impressões, consultas e principais páginas do Google Search Console no iPhone. Conecte a sua conta atual a este app independente para iOS. Grátis para um site.",
    "Provjerite klikove, pojavljivanja, upite i najbolje stranice iz Google Search Consolea na iPhoneu. Povežite postojeći račun s ovom neovisnom iOS aplikacijom. Besplatno za jednu web-stranicu.",
    "Google Search Console のクリック、表示回数、クエリ、上位ページを iPhone で確認。既存のアカウントをこの独立した iOS アプリに接続できます。1サイトまで無料。",
    "Google Search Console의 클릭, 노출, 검색어, 인기 페이지를 iPhone에서 확인하세요. 기존 계정을 이 독립 iOS 앱에 연결합니다. 웹사이트 1개는 무료.",
    "在 iPhone 上查看 Google Search Console 的点击、展示、查询和热门页面。用这款独立的 iOS 应用连接你现有的账户。一个网站免费。",
    "在 iPhone 上查看 Google Search Console 的點擊、曝光、查詢和熱門頁面。用這款獨立的 iOS App 連結你現有的帳戶。一個網站免費。",
  ],
  "hero.eyebrow": [
    "Independent app for iPhone and iPad", "Unabhängige App für iPhone und iPad", "App indépendante pour iPhone et iPad", "App independente para iPhone e iPad",
    "Neovisna aplikacija za iPhone i iPad", "iPhone と iPad 向けの独立系アプリ", "iPhone 및 iPad용 독립 앱", "适用于 iPhone 和 iPad 的独立应用", "適用於 iPhone 和 iPad 的獨立 App",
  ],
  "hero.titleA": [
    "Google Search Console on your iPhone.", "Google Search Console auf deinem iPhone.", "Google Search Console sur votre iPhone.", "Google Search Console no seu iPhone.",
    "Google Search Console na vašem iPhoneu.", "Google Search Console を iPhone で。", "iPhone에서 만나는 Google Search Console.", "iPhone 上的 Google Search Console。", "iPhone 上的 Google Search Console。",
  ],
  "hero.role": [
    "Check clicks, impressions, search queries and top pages from your existing Google Search Console account. Then ask Blink, the on-device assistant, what changed.",
    "Prüfe Klicks, Impressionen, Suchanfragen und Top-Seiten aus deinem bestehenden Google-Search-Console-Konto. Frag dann Blink, den Assistenten auf dem Gerät, was sich geändert hat.",
    "Consultez clics, impressions, requêtes et pages principales depuis votre compte Google Search Console existant. Puis demandez à Blink, l'assistant sur l'appareil, ce qui a changé.",
    "Veja cliques, impressões, consultas e principais páginas da sua conta atual do Google Search Console. Depois pergunte ao Blink, o assistente no aparelho, o que mudou.",
    "Provjerite klikove, pojavljivanja, upite i najbolje stranice iz postojećeg Google Search Console računa. Zatim pitajte Blinka, asistenta na uređaju, što se promijenilo.",
    "既存の Google Search Console アカウントから、クリック、表示回数、検索クエリ、上位ページを確認。そのあと、端末上のアシスタント Blink に何が変わったかを聞けます。",
    "기존 Google Search Console 계정의 클릭, 노출, 검색어, 인기 페이지를 확인하세요. 그런 다음 기기 내 어시스턴트 Blink에게 무엇이 바뀌었는지 물어보세요.",
    "从你现有的 Google Search Console 账户查看点击、展示、搜索查询和热门页面。然后问问设备端助手 Blink 发生了什么变化。",
    "從你現有的 Google Search Console 帳戶查看點擊、曝光、搜尋查詢和熱門頁面。然後問問裝置端助理 Blink 發生了什麼變化。",
  ],
  "hero.offer": [
    "Free for one website · Premium $5.99/mo after a 3-day trial",
    "Kostenlos für eine Website · Premium 5,99 $/Monat nach 3 Tagen Test",
    "Gratuit pour un site · Premium 5,99 $/mois après 3 jours d'essai",
    "Grátis para um site · Premium US$ 5,99/mês após 3 dias de teste",
    "Besplatno za jednu web-stranicu · Premium 5,99 $/mj. nakon 3 dana probe",
    "1サイトまで無料 · プレミアムは3日間の無料トライアル後 月額 $5.99",
    "웹사이트 1개 무료 · 프리미엄은 3일 체험 후 월 $5.99",
    "一个网站免费 · 高级版 3 天试用后每月 $5.99",
    "一個網站免費 · 進階版 3 天試用後每月 $5.99",
  ],
  "hero.trust": [
    "Independent app. Not affiliated with Google. Requires access to a Search Console property.",
    "Unabhängige App. Nicht mit Google verbunden. Erfordert Zugriff auf eine Search-Console-Property.",
    "App indépendante. Non affiliée à Google. Nécessite l'accès à une propriété Search Console.",
    "App independente. Sem vínculo com o Google. Requer acesso a uma propriedade do Search Console.",
    "Neovisna aplikacija. Nije povezana s Googleom. Potreban je pristup Search Console posjedu.",
    "独立系アプリです。Google とは提携していません。Search Console プロパティへのアクセス権が必要です。",
    "독립 앱입니다. Google과 제휴하지 않았습니다. Search Console 속성에 대한 액세스 권한이 필요합니다.",
    "独立应用，与 Google 无关联。需要拥有 Search Console 资源的访问权限。",
    "獨立 App，與 Google 無關聯。需要擁有 Search Console 資源的存取權限。",
  ],
  "hero.qr": [
    "Scan to get the app", "Scannen und App laden", "Scannez pour obtenir l'app", "Escaneie para baixar o app", "Skenirajte za preuzimanje",
    "スキャンしてアプリを入手", "스캔하여 앱 받기", "扫码获取应用", "掃碼取得 App",
  ],
  "footer.downloadDesc": [
    "Free for one website. Premium unlocks every property and Blink.",
    "Kostenlos für eine Website. Premium schaltet alle Properties und Blink frei.",
    "Gratuit pour un site. Premium débloque toutes les propriétés et Blink.",
    "Grátis para um site. O Premium libera todas as propriedades e o Blink.",
    "Besplatno za jednu web-stranicu. Premium otključava sve posjede i Blinka.",
    "1サイトまで無料。プレミアムですべてのプロパティと Blink が使えます。",
    "웹사이트 1개는 무료. 프리미엄으로 모든 속성과 Blink를 이용하세요.",
    "一个网站免费。高级版解锁所有资源和 Blink。",
    "一個網站免費。進階版解鎖所有資源和 Blink。",
  ],
  "guideOfficial.shortAnswer": [
    "Short answer: no. Google does not publish a Search Console app for iPhone. Independent apps such as this one connect to your existing account through Google's official API.",
    "Kurz gesagt: nein. Google bietet keine Search-Console-App für das iPhone an. Unabhängige Apps wie diese verbinden sich über Googles offizielle API mit deinem bestehenden Konto.",
    "En bref : non. Google ne publie pas d'app Search Console pour iPhone. Des apps indépendantes comme celle-ci se connectent à votre compte existant via l'API officielle de Google.",
    "Resposta curta: não. O Google não publica um app do Search Console para iPhone. Apps independentes como este se conectam à sua conta atual pela API oficial do Google.",
    "Kratak odgovor: ne. Google ne objavljuje Search Console aplikaciju za iPhone. Neovisne aplikacije poput ove povezuju se s vašim postojećim računom putem službenog Googleovog API-ja.",
    "結論: ありません。Google は iPhone 向けの Search Console アプリを公開していません。このアプリのような独立系アプリが、Google の公式 API を通じて既存のアカウントに接続します。",
    "짧은 답: 없습니다. Google은 iPhone용 Search Console 앱을 제공하지 않습니다. 이 앱과 같은 독립 앱이 Google 공식 API를 통해 기존 계정에 연결합니다.",
    "简短回答：没有。Google 没有发布适用于 iPhone 的 Search Console 应用。像本应用这样的独立应用通过 Google 官方 API 连接你现有的账户。",
    "簡短回答：沒有。Google 沒有推出適用於 iPhone 的 Search Console App。像本 App 這樣的獨立 App 透過 Google 官方 API 連結你現有的帳戶。",
  ],
  "guidesCommon.lastUpdated": [
    "Last updated: October 7, 2026", "Zuletzt aktualisiert: 7. Oktober 2026", "Dernière mise à jour : 7 octobre 2026", "Última atualização: 7 de outubro de 2026",
    "Zadnje ažuriranje: 7. listopada 2026.", "最終更新日: 2026年10月7日", "최종 업데이트: 2026년 10월 7일", "最后更新：2026 年 10 月 7 日", "最後更新：2026 年 10 月 7 日",
  ],
}

root = Path(__file__).resolve().parent.parent / "locales"
for index, locale in enumerate(LOCALES):
  path = root / f"{locale}.json"
  data = json.loads(path.read_text(encoding="utf-8"))
  for dotted, values in COPY.items():
    assert len(values) == len(LOCALES), dotted
    section, key = dotted.split(".")
    data.setdefault(section, {})[key] = values[index]
  path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  print("updated", locale)
