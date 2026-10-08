#!/usr/bin/env python3
"""Metadata and first-screen copy from the October 2026 metadata and long-tail plan, in every locale.

One promise from search result to first screen: the title, description, H1 and subtext all say
"Google Search Console on your iPhone", then what you can do and what you need.
The paid plan is called Pro, as it is in the app.
Run from docs/:  python3 scripts/apply-2.5-metadata.py
Order of each list: en, de, fr, pt, hr, ja, ko, zh-Hans, zh-Hant.
"""
import json
import re
from pathlib import Path

LOCALES = ["en", "de", "fr", "pt", "hr", "ja", "ko", "zh-Hans", "zh-Hant"]

COPY = {
  "meta.title": [
    "Google Search Console App for iPhone | Independent App",
    "Google Search Console App für iPhone | Unabhängige App",
    "App Google Search Console pour iPhone | App indépendante",
    "App do Google Search Console para iPhone | App independente",
    "Google Search Console aplikacija za iPhone | Neovisna aplikacija",
    "iPhone 向け Google Search Console アプリ | 独立系アプリ",
    "iPhone용 Google Search Console 앱 | 독립 앱",
    "适用于 iPhone 的 Google Search Console 应用 | 独立应用",
    "適用於 iPhone 的 Google Search Console App | 獨立 App",
  ],
  "meta.description": [
    "Check clicks, impressions, queries, and top pages on your iPhone. Connect your existing Google Search Console account with an independent iOS app.",
    "Prüfe Klicks, Impressionen, Suchanfragen und Top-Seiten auf deinem iPhone. Verbinde dein bestehendes Google-Search-Console-Konto mit einer unabhängigen iOS-App.",
    "Consultez clics, impressions, requêtes et pages principales sur votre iPhone. Connectez votre compte Google Search Console existant à une app iOS indépendante.",
    "Veja cliques, impressões, consultas e principais páginas no seu iPhone. Conecte a sua conta atual do Google Search Console a um app independente para iOS.",
    "Provjerite klikove, pojavljivanja, upite i najbolje stranice na iPhoneu. Povežite postojeći Google Search Console račun s neovisnom iOS aplikacijom.",
    "クリック、表示回数、クエリ、上位ページを iPhone で確認。既存の Google Search Console アカウントを独立系 iOS アプリに接続できます。",
    "클릭, 노출, 검색어, 인기 페이지를 iPhone에서 확인하세요. 기존 Google Search Console 계정을 독립 iOS 앱에 연결합니다.",
    "在 iPhone 上查看点击、展示、查询和热门页面。用一款独立的 iOS 应用连接你现有的 Google Search Console 账户。",
    "在 iPhone 上查看點擊、曝光、查詢和熱門頁面。用一款獨立的 iOS App 連結你現有的 Google Search Console 帳戶。",
  ],
  "hero.h1Lead": ["Google Search Console app", "Google Search Console App", "L'app Google Search Console", "App do Google Search Console", "Google Search Console aplikacija", "Google Search Console アプリ", "Google Search Console 앱", "Google Search Console 应用", "Google Search Console App"],
  "hero.h1Rest": ["for your iPhone and iPad", "für dein iPhone und iPad", "pour votre iPhone et iPad", "para o seu iPhone e iPad", "za vaš iPhone i iPad", "iPhone と iPad で", "iPhone과 iPad에서", "适用于你的 iPhone 和 iPad", "適用於你的 iPhone 和 iPad"],
  "hero.rating": ["4.0 on the App Store", "4,0 im App Store", "4,0 sur l'App Store", "4,0 na App Store", "4,0 u App Storeu", "App Store で 4.0", "App Store 평점 4.0", "App Store 评分 4.0", "App Store 評分 4.0"],
  "hero.ratingAria": ["Rated 4.0 out of 5 on the App Store", "Mit 4,0 von 5 im App Store bewertet", "Noté 4,0 sur 5 sur l'App Store", "Avaliado em 4,0 de 5 na App Store", "Ocjena 4,0 od 5 u App Storeu", "App Store で 5 点中 4.0 の評価", "App Store에서 5점 만점에 4.0점", "App Store 评分 4.0（满分 5）", "App Store 評分 4.0（滿分 5）"],
  "hero.titleA": [
    "Google Search Console on your iPhone", "Google Search Console auf deinem iPhone", "Google Search Console sur votre iPhone", "Google Search Console no seu iPhone",
    "Google Search Console na vašem iPhoneu", "Google Search Console を iPhone で", "iPhone에서 만나는 Google Search Console", "iPhone 上的 Google Search Console", "iPhone 上的 Google Search Console",
  ],
  "hero.titleB": [
    "Now with Blink, an assistant for your own numbers.",
    "Jetzt mit Blink, einem Assistenten für deine eigenen Zahlen.",
    "Désormais avec Blink, un assistant pour vos propres chiffres.",
    "Agora com o Blink, um assistente para os seus próprios números.",
    "Sada s Blinkom, asistentom za vaše vlastite brojke.",
    "自分の数値のためのアシスタント Blink が新登場。",
    "내 수치를 위한 어시스턴트 Blink가 새로 추가되었습니다.",
    "现已加入 Blink：为你自己的数据而生的助手。",
    "現已加入 Blink：為你自己的數據而生的助理。",
  ],
  "hero.role": ["Check clicks, impressions, search queries and top pages from your existing Google Search Console account, without opening a laptop. Sign in with Google, pick a property and see what changed. Then ask Blink, the built-in assistant, to explain your numbers.", "Prüfe Klicks, Impressionen, Suchanfragen und Top-Seiten aus deinem bestehenden Google-Search-Console-Konto, ohne den Laptop aufzuklappen. Melde dich mit Google an, wähle eine Property und sieh, was sich geändert hat. Frag dann Blink, den eingebauten Assistenten, nach deinen Zahlen.", "Consultez clics, impressions, requêtes et pages principales depuis votre compte Google Search Console existant, sans ouvrir d'ordinateur. Connectez-vous avec Google, choisissez une propriété et voyez ce qui a changé. Puis demandez à Blink, l'assistant intégré, d'expliquer vos chiffres.", "Veja cliques, impressões, consultas e principais páginas da sua conta atual do Google Search Console, sem abrir o notebook. Entre com o Google, escolha uma propriedade e veja o que mudou. Depois peça ao Blink, o assistente integrado, para explicar os seus números.", "Provjerite klikove, pojavljivanja, upite i najbolje stranice iz postojećeg Google Search Console računa, bez otvaranja laptopa. Prijavite se Googleom, odaberite posjed i pogledajte što se promijenilo. Zatim pitajte Blinka, ugrađenog asistenta, da objasni vaše brojke.", "既存の Google Search Console アカウントのクリック、表示回数、検索クエリ、上位ページを、パソコンを開かずに確認。Google でサインインしてプロパティを選べば、変化がすぐにわかります。数値の意味は、内蔵アシスタントの Blink に聞けます。", "노트북을 열지 않고도 기존 Google Search Console 계정의 클릭, 노출, 검색어, 인기 페이지를 확인하세요. Google로 로그인하고 속성을 선택하면 무엇이 바뀌었는지 볼 수 있습니다. 수치에 대한 설명은 내장 어시스턴트 Blink에게 물어보세요.", "无需打开电脑，即可从现有的 Google Search Console 账户查看点击、展示、搜索查询和热门页面。使用 Google 登录，选择一个资源，看看有什么变化。然后让内置助手 Blink 为你解读数据。", "無需打開電腦，即可從現有的 Google Search Console 帳戶查看點擊、曝光、搜尋查詢和熱門頁面。使用 Google 登入，選擇一個資源，看看有什麼變化。然後讓內建助理 Blink 為你解讀數據。"],
  "hero.watch": [
    "See the app in action", "Die App in Aktion sehen", "Voir l'app en action", "Veja o app em ação", "Pogledajte aplikaciju u akciji",
    "アプリの動きを見る", "앱 실제 화면 보기", "看看应用实际效果", "看看 App 實際效果",
  ],
  "hero.offer": ["Free for one website. Pro from $5.99 a month.", "Kostenlos für eine Website. Pro ab 5,99 $ pro Monat.", "Gratuit pour un site. Pro à partir de 5,99 $ par mois.", "Grátis para um site. Pro a partir de US$ 5,99 por mês.", "Besplatno za jednu web-stranicu. Pro od 5,99 $ mjesečno.", "1サイトまで無料。Pro は月額 $5.99 から。", "웹사이트 1개 무료. Pro는 월 $5.99부터.", "一个网站免费。Pro 每月 $5.99 起。", "一個網站免費。Pro 每月 $5.99 起。"],
  "hero.trust": ["Free for one website. Independent app, not affiliated with Google.", "Kostenlos für eine Website. Unabhängige App, nicht mit Google verbunden.", "Gratuit pour un site. App indépendante, non affiliée à Google.", "Grátis para um site. App independente, sem vínculo com o Google.", "Besplatno za jednu web-stranicu. Neovisna aplikacija, nije povezana s Googleom.", "1サイトまで無料。Google とは提携していない独立系アプリです。", "웹사이트 1개 무료. Google과 제휴하지 않은 독립 앱입니다.", "一个网站免费。独立应用，与 Google 无关联。", "一個網站免費。獨立 App，與 Google 無關聯。"],
  "hero.shotAlt": [
    "The Overview screen of the Search Console app showing clicks, impressions, CTR and average position for a sample site",
    "Die Übersicht der Search-Console-App mit Klicks, Impressionen, CTR und durchschnittlicher Position einer Beispiel-Website",
    "L'écran Vue d'ensemble de l'app Search Console avec clics, impressions, CTR et position moyenne d'un site d'exemple",
    "A tela Visão geral do app Search Console com cliques, impressões, CTR e posição média de um site de exemplo",
    "Zaslon Pregled u aplikaciji Search Console s klikovima, pojavljivanjima, CTR-om i prosječnom pozicijom za primjer stranice",
    "サンプルサイトのクリック、表示回数、CTR、平均掲載順位を表示する Search Console アプリの概要画面",
    "샘플 사이트의 클릭, 노출, CTR, 평균 게재순위를 보여주는 Search Console 앱의 개요 화면",
    "Search Console 应用的概览界面，显示示例网站的点击、展示、点击率和平均排名",
    "Search Console App 的總覽畫面，顯示範例網站的點擊、曝光、點閱率和平均排名",
  ],
  "plans.priceNote": [
    "Prices are in US dollars. The App Store shows the price for your country.",
    "Preise in US-Dollar. Der App Store zeigt den Preis für dein Land.",
    "Prix en dollars américains. L'App Store affiche le prix pour votre pays.",
    "Preços em dólares americanos. A App Store mostra o preço do seu país.",
    "Cijene su u američkim dolarima. App Store prikazuje cijenu za vašu zemlju.",
    "価格は米ドル表記です。App Store にはお住まいの国の価格が表示されます。",
    "가격은 미국 달러 기준입니다. App Store에 해당 국가의 가격이 표시됩니다.",
    "价格以美元计。App Store 会显示你所在国家或地区的价格。",
    "價格以美元計。App Store 會顯示你所在國家或地區的價格。",
  ],
}

# Keys written earlier with "Premium"; the app calls the paid plan Pro.
RENAME_KEYS = ["plans.title", "plans.desc", "plans.premium", "footer.downloadDesc", "faq.a9"]
RENAME = [("Premium", "Pro"), ("プレミアム", "Pro"), ("프리미엄", "Pro"), ("高级版", "Pro 版"), ("進階版", "Pro 版")]

root = Path(__file__).resolve().parent.parent / "locales"
for index, locale in enumerate(LOCALES):
  path = root / f"{locale}.json"
  data = json.loads(path.read_text(encoding="utf-8"))
  for dotted, values in COPY.items():
    assert len(values) == len(LOCALES), dotted
    section, key = dotted.split(".")
    data.setdefault(section, {})[key] = values[index]
  for dotted in RENAME_KEYS:
    section, key = dotted.split(".")
    value = data[section][key]
    for old, new in RENAME:
      value = value.replace(old, new)
    data[section][key] = re.sub(r"\bO Pro\b", "O Pro", value)
  path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  print("updated", locale)
