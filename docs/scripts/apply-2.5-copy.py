#!/usr/bin/env python3
"""Applies the 2.5 copy (Blink, 3-day trial, new screenshots, release notes) to every locale file.

Run once from docs/:  python3 scripts/apply-2.5-copy.py
Order of each list: en, de, fr, pt, hr, ja, ko, zh-Hans, zh-Hant.
"""
import json
from pathlib import Path

LOCALES = ["en", "de", "fr", "pt", "hr", "ja", "ko", "zh-Hans", "zh-Hant"]

COPY = {
  "meta.description": [
    "Native iOS app for Google Search Console, with Blink, an on-device assistant for your search data. Clicks, queries, Core Web Vitals and reports on iPhone. 3-day free trial.",
    "Native iOS-App für die Google Search Console, mit Blink, einem Assistenten direkt auf dem Gerät. Klicks, Suchanfragen, Core Web Vitals und Berichte auf dem iPhone. 3 Tage kostenlos testen.",
    "App iOS native pour Google Search Console, avec Blink, un assistant qui tourne sur l'appareil. Clics, requêtes, Core Web Vitals et rapports sur iPhone. Essai gratuit de 3 jours.",
    "App nativo para iOS do Google Search Console, com o Blink, um assistente que roda no aparelho. Cliques, consultas, Core Web Vitals e relatórios no iPhone. Teste grátis de 3 dias.",
    "Izvorna iOS aplikacija za Google Search Console, uz Blinka, asistenta koji radi na uređaju. Klikovi, upiti, Core Web Vitals i izvještaji na iPhoneu. Besplatna proba 3 dana.",
    "Google Search Console のための iOS ネイティブアプリ。端末上で動くアシスタント Blink を搭載。クリック、クエリ、Core Web Vitals、レポートを iPhone で。3日間無料。",
    "Google Search Console용 네이티브 iOS 앱. 기기에서 동작하는 어시스턴트 Blink 탑재. 클릭, 검색어, Core Web Vitals, 보고서를 iPhone에서. 3일 무료 체험.",
    "适用于 Google Search Console 的原生 iOS 应用，内置在设备端运行的助手 Blink。在 iPhone 上查看点击、查询、Core Web Vitals 和报告。3 天免费试用。",
    "適用於 Google Search Console 的原生 iOS App，內建在裝置端運作的助理 Blink。在 iPhone 上查看點擊、查詢、Core Web Vitals 與報告。3 天免費試用。",
  ],
  "banner.releaseNotice": [
    "Version 2.5 is live. Meet Blink.", "Version 2.5 ist da. Das ist Blink.", "La version 2.5 est là. Voici Blink.", "A versão 2.5 chegou. Conheça o Blink.",
    "Verzija 2.5 je stigla. Upoznajte Blinka.", "バージョン 2.5 を公開。Blink が登場。", "버전 2.5 출시. Blink를 만나보세요.", "2.5 版已发布。认识一下 Blink。", "2.5 版已推出。認識一下 Blink。",
  ],
  "hero.pill": ["Version 2.5", "Version 2.5", "Version 2.5", "Versão 2.5", "Verzija 2.5", "バージョン 2.5", "버전 2.5", "版本 2.5", "版本 2.5"],
  "hero.role": [
    "The same Search Console account and data, shaped for iOS. New in 2.5: Blink, an on-device assistant that answers questions about your own numbers.",
    "Dasselbe Search-Console-Konto und dieselben Daten, gemacht für iOS. Neu in 2.5: Blink, ein Assistent auf dem Gerät, der Fragen zu deinen eigenen Zahlen beantwortet.",
    "Le même compte Search Console et les mêmes données, pensés pour iOS. Nouveau dans la 2.5 : Blink, un assistant sur l'appareil qui répond à vos questions sur vos propres chiffres.",
    "A mesma conta e os mesmos dados do Search Console, pensados para iOS. Novo na 2.5: Blink, um assistente no aparelho que responde perguntas sobre os seus próprios números.",
    "Isti Search Console račun i isti podaci, oblikovani za iOS. Novo u 2.5: Blink, asistent na uređaju koji odgovara na pitanja o vašim vlastitim brojkama.",
    "同じ Search Console アカウントとデータを iOS 向けに。2.5 の新機能: 自分の数値について質問に答える、端末上のアシスタント Blink。",
    "같은 Search Console 계정과 데이터를 iOS에 맞게. 2.5의 새로운 기능: 내 수치에 대한 질문에 답하는 기기 내 어시스턴트 Blink.",
    "同一个 Search Console 账户和数据，为 iOS 而设计。2.5 新增：Blink，一个在设备端运行、回答你自己数据问题的助手。",
    "同一個 Search Console 帳戶與資料，為 iOS 而設計。2.5 新增：Blink，一個在裝置端運作、回答你自己數據問題的助理。",
  ],
  "hero.statWidgetsValue": ["Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink"],
  "hero.statWidgetsLabel": [
    "Ask in your own words", "Frag in deinen eigenen Worten", "Demandez avec vos mots", "Pergunte com as suas palavras", "Pitajte svojim riječima",
    "自分の言葉で質問", "내 말로 물어보기", "用你自己的话提问", "用你自己的話提問",
  ],
  "hero.offer": [
    "3-day free trial · $5.99/mo", "3 Tage kostenlos testen · 5,99 $/Monat", "Essai gratuit de 3 jours · 5,99 $/mois", "Teste grátis de 3 dias · US$ 5,99/mês",
    "Besplatna proba 3 dana · 5,99 $/mj.", "3日間無料トライアル · 月額 $5.99", "3일 무료 체험 · 월 $5.99", "3 天免费试用 · 每月 $5.99", "3 天免費試用 · 每月 $5.99",
  ],
  "stats.trial": ["3-day trial", "3 Tage Test", "Essai de 3 jours", "Teste de 3 dias", "Proba 3 dana", "3日間トライアル", "3일 체험", "3 天试用", "3 天試用"],
  "pricing.desc": [
    "3-day free trial, then $5.99 per month on iOS. Cancel anytime in the App Store.",
    "3 Tage kostenlos testen, danach 5,99 $ pro Monat auf iOS. Jederzeit im App Store kündbar.",
    "Essai gratuit de 3 jours, puis 5,99 $ par mois sur iOS. Annulez à tout moment dans l'App Store.",
    "Teste grátis de 3 dias, depois US$ 5,99 por mês no iOS. Cancele quando quiser na App Store.",
    "Besplatna proba 3 dana, zatim 5,99 $ mjesečno na iOS-u. Otkažite bilo kada u App Storeu.",
    "3日間無料、その後 iOS で月額 $5.99。App Store でいつでも解約できます。",
    "3일 무료 체험 후 iOS에서 월 $5.99. App Store에서 언제든지 해지할 수 있습니다.",
    "3 天免费试用，之后在 iOS 上每月 $5.99。可随时在 App Store 取消。",
    "3 天免費試用，之後在 iOS 上每月 $5.99。可隨時在 App Store 取消。",
  ],
  "faq.a9": [
    "The subscription supports ongoing development and API costs. A free plan with ads covers one property. Premium removes ads and unlocks every property, Core Web Vitals and URL inspection. Try it free for 3 days before subscribing.",
    "Das Abo finanziert die Weiterentwicklung und die API-Kosten. Der kostenlose Tarif mit Werbung umfasst eine Property. Premium entfernt die Werbung und schaltet alle Properties, Core Web Vitals und die URL-Prüfung frei. Teste es 3 Tage kostenlos.",
    "L'abonnement finance le développement et les coûts d'API. L'offre gratuite avec publicités couvre une propriété. Premium supprime les publicités et débloque toutes les propriétés, les Core Web Vitals et l'inspection d'URL. Essayez gratuitement pendant 3 jours.",
    "A assinatura financia o desenvolvimento e os custos de API. O plano gratuito com anúncios cobre uma propriedade. O Premium remove os anúncios e libera todas as propriedades, Core Web Vitals e inspeção de URL. Teste grátis por 3 dias.",
    "Pretplata podržava daljnji razvoj i troškove API-ja. Besplatni plan s oglasima pokriva jedan posjed. Premium uklanja oglase i otključava sve posjede, Core Web Vitals i provjeru URL-a. Isprobajte besplatno 3 dana.",
    "サブスクリプションは開発と API の費用を支えています。広告付きの無料プランではプロパティを1つ利用できます。プレミアムは広告を外し、すべてのプロパティ、Core Web Vitals、URL 検査を利用できます。3日間無料でお試しください。",
    "구독은 지속적인 개발과 API 비용을 지원합니다. 광고가 있는 무료 플랜은 속성 하나를 지원합니다. 프리미엄은 광고를 없애고 모든 속성, Core Web Vitals, URL 검사를 제공합니다. 3일간 무료로 체험해 보세요.",
    "订阅用于支持持续开发和 API 成本。带广告的免费方案支持一个资源。高级版去除广告，并解锁所有资源、Core Web Vitals 和网址检查。订阅前可免费试用 3 天。",
    "訂閱用於支持持續開發與 API 成本。含廣告的免費方案支援一個資源。進階版移除廣告，並解鎖所有資源、Core Web Vitals 與網址檢查。訂閱前可免費試用 3 天。",
  ],
  "screenshots.blink": ["Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink", "Blink"],
  "screenshots.report": ["Report", "Bericht", "Rapport", "Relatório", "Izvještaj", "レポート", "보고서", "报告", "報告"],
  "screenshots.integrations": ["Integrations", "Integrationen", "Intégrations", "Integrações", "Integracije", "連携", "연동", "集成", "整合"],
  "screenshots.alerts": ["Alerts", "Mitteilungen", "Alertes", "Alertas", "Upozorenja", "アラート", "알림", "提醒", "提醒"],
  "screenshots.plans": ["Plans", "Tarife", "Offres", "Planos", "Planovi", "プラン", "요금제", "方案", "方案"],
  "blink.eyebrow": ["New in 2.5", "Neu in 2.5", "Nouveau dans la 2.5", "Novo na 2.5", "Novo u 2.5", "2.5 の新機能", "2.5의 새로운 기능", "2.5 新增", "2.5 新增"],
  "blink.title": [
    "Meet Blink. Ask him about your traffic.", "Das ist Blink. Frag ihn nach deinem Traffic.", "Voici Blink. Interrogez-le sur votre trafic.", "Conheça o Blink. Pergunte sobre o seu tráfego.",
    "Upoznajte Blinka. Pitajte ga o svom prometu.", "Blink です。トラフィックのことを聞いてください。", "Blink를 만나보세요. 트래픽에 대해 물어보세요.", "认识一下 Blink。问问他你的流量。", "認識一下 Blink。問問他你的流量。",
  ],
  "blink.desc": [
    "Type a question the way you would say it. Blink reads your Search Console data and answers with the figures, a chart, and what to look at next.",
    "Stell eine Frage so, wie du sie sagen würdest. Blink liest deine Search-Console-Daten und antwortet mit Zahlen, einem Diagramm und dem nächsten Schritt.",
    "Posez une question comme vous la diriez. Blink lit vos données Search Console et répond avec les chiffres, un graphique et la suite à regarder.",
    "Faça uma pergunta do jeito que você falaria. O Blink lê os seus dados do Search Console e responde com os números, um gráfico e o que olhar em seguida.",
    "Postavite pitanje onako kako biste ga izgovorili. Blink čita vaše Search Console podatke i odgovara brojkama, grafikonom i sljedećim korakom.",
    "話すように質問を入力してください。Blink が Search Console のデータを読み、数値とグラフ、次に見るべき点を答えます。",
    "말하듯이 질문을 입력하세요. Blink가 Search Console 데이터를 읽고 수치, 차트, 다음에 볼 내용으로 답합니다.",
    "像说话一样输入问题。Blink 读取你的 Search Console 数据，用数字、图表和下一步建议来回答。",
    "像說話一樣輸入問題。Blink 讀取你的 Search Console 資料，用數字、圖表和下一步建議來回答。",
  ],
  "blink.p1Title": ["Answers from your own numbers", "Antworten aus deinen eigenen Zahlen", "Des réponses tirées de vos chiffres", "Respostas a partir dos seus números", "Odgovori iz vaših vlastitih brojki", "自分の数値からの回答", "내 수치에서 나온 답", "答案来自你自己的数据", "答案來自你自己的數據"],
  "blink.p1Desc": [
    "Every figure he shows comes from your data. He tells you what changed and says so when the data cannot explain why.",
    "Jede Zahl stammt aus deinen Daten. Er sagt dir, was sich geändert hat, und sagt es offen, wenn die Daten das Warum nicht erklären.",
    "Chaque chiffre vient de vos données. Il vous dit ce qui a changé et le signale quand les données n'expliquent pas pourquoi.",
    "Cada número vem dos seus dados. Ele diz o que mudou e avisa quando os dados não explicam o porquê.",
    "Svaka brojka dolazi iz vaših podataka. Kaže vam što se promijenilo i otvoreno kaže kada podaci ne mogu objasniti zašto.",
    "表示する数値はすべてあなたのデータからのものです。何が変わったかを伝え、理由がデータからわからないときはそう言います。",
    "보여주는 모든 수치는 내 데이터에서 나옵니다. 무엇이 바뀌었는지 알려주고, 데이터로 이유를 알 수 없으면 그렇게 말합니다.",
    "他给出的每个数字都来自你的数据。他会告诉你发生了什么变化，数据无法解释原因时也会直说。",
    "他給出的每個數字都來自你的資料。他會告訴你發生了什麼變化，資料無法解釋原因時也會直說。",
  ],
  "blink.p2Title": ["Runs on your device", "Läuft auf deinem Gerät", "Fonctionne sur votre appareil", "Roda no seu aparelho", "Radi na vašem uređaju", "端末上で動作", "기기에서 동작", "在你的设备上运行", "在你的裝置上運作"],
  "blink.p2Desc": [
    "Your questions do not leave your iPhone. Blink needs a device with Apple Intelligence.",
    "Deine Fragen verlassen dein iPhone nicht. Blink benötigt ein Gerät mit Apple Intelligence.",
    "Vos questions ne quittent pas votre iPhone. Blink nécessite un appareil avec Apple Intelligence.",
    "As suas perguntas não saem do seu iPhone. O Blink precisa de um aparelho com Apple Intelligence.",
    "Vaša pitanja ne napuštaju vaš iPhone. Blink zahtijeva uređaj s Apple Intelligenceom.",
    "質問が iPhone の外に出ることはありません。Blink には Apple Intelligence 対応の端末が必要です。",
    "질문은 iPhone 밖으로 나가지 않습니다. Blink는 Apple Intelligence를 지원하는 기기가 필요합니다.",
    "你的问题不会离开你的 iPhone。Blink 需要支持 Apple Intelligence 的设备。",
    "你的問題不會離開你的 iPhone。Blink 需要支援 Apple Intelligence 的裝置。",
  ],
  "blink.p3Title": ["A report worth sending", "Ein Bericht, den man gern verschickt", "Un rapport qui mérite d'être envoyé", "Um relatório que vale a pena enviar", "Izvještaj vrijedan slanja", "送りたくなるレポート", "보낼 만한 보고서", "值得发送的报告", "值得傳送的報告"],
  "blink.p3Desc": [
    "Ask for a report, preview the PDF, and share it in one tap.",
    "Bitte um einen Bericht, sieh dir das PDF an und teile es mit einem Tipp.",
    "Demandez un rapport, prévisualisez le PDF et partagez-le en un geste.",
    "Peça um relatório, veja a prévia do PDF e compartilhe com um toque.",
    "Zatražite izvještaj, pregledajte PDF i podijelite ga jednim dodirom.",
    "レポートを頼み、PDF をプレビューして、ワンタップで共有。",
    "보고서를 요청하고, PDF를 미리 본 뒤, 한 번의 탭으로 공유하세요.",
    "让他生成报告，预览 PDF，一键分享。",
    "請他產生報告，預覽 PDF，一鍵分享。",
  ],
  "blink.p4Title": ["He keeps watch", "Er passt auf", "Il veille", "Ele fica de olho", "On drži stražu", "見守り続けます", "계속 지켜봅니다", "他会替你盯着", "他會替你盯著"],
  "blink.p4Desc": [
    "Alerts arrive only when clicks really move, with the figures. Tap one and he shows you what changed.",
    "Mitteilungen kommen nur, wenn sich die Klicks wirklich bewegen, mit den Zahlen. Tipp darauf und er zeigt dir, was sich geändert hat.",
    "Les alertes n'arrivent que lorsque les clics bougent vraiment, chiffres à l'appui. Touchez-en une et il vous montre ce qui a changé.",
    "Os alertas só chegam quando os cliques realmente mudam, com os números. Toque em um e ele mostra o que mudou.",
    "Upozorenja stižu samo kada se klikovi stvarno promijene, s brojkama. Dodirnite jedno i pokazat će vam što se promijenilo.",
    "アラートはクリックが本当に動いたときだけ、数値つきで届きます。タップすると何が変わったかを見せてくれます。",
    "알림은 클릭이 실제로 움직였을 때만 수치와 함께 도착합니다. 탭하면 무엇이 바뀌었는지 보여줍니다.",
    "只有点击量真的变化时才会收到提醒，并附上数字。点一下，他会告诉你哪里变了。",
    "只有點擊量真的變化時才會收到提醒，並附上數字。點一下，他會告訴你哪裡變了。",
  ],
  "blink.note": [
    "Sample data shown.", "Beispieldaten.", "Données d'exemple.", "Dados de exemplo.", "Prikazani su primjeri podataka.", "サンプルデータです。", "샘플 데이터입니다.", "所示为示例数据。", "所示為範例資料。",
  ],
  "releases.metaDescription": [
    "Search Console for iPhone release notes: Version 2.5 with Blink, the white redesign, reports and real alerts, plus the full iOS changelog.",
    "Versionshinweise zu Search Console für iPhone: Version 2.5 mit Blink, neuem hellen Design, Berichten und echten Mitteilungen sowie dem gesamten iOS-Änderungsprotokoll.",
    "Notes de version de Search Console pour iPhone : version 2.5 avec Blink, le nouveau design clair, les rapports et de vraies alertes, plus tout l'historique iOS.",
    "Notas de versão do Search Console para iPhone: versão 2.5 com o Blink, o novo design claro, relatórios e alertas reais, além de todo o histórico no iOS.",
    "Bilješke o izdanjima za Search Console za iPhone: verzija 2.5 s Blinkom, novim svijetlim dizajnom, izvještajima i stvarnim upozorenjima te cijelim popisom izmjena.",
    "Search Console for iPhone のリリースノート: Blink、白基調の新デザイン、レポート、実データのアラートを備えたバージョン 2.5 と、これまでの変更履歴。",
    "Search Console for iPhone 릴리스 노트: Blink, 새로운 밝은 디자인, 보고서, 실제 데이터 알림을 담은 버전 2.5와 전체 iOS 변경 내역.",
    "Search Console for iPhone 更新说明：2.5 版带来 Blink、全新浅色设计、报告和基于真实数据的提醒，以及完整的 iOS 更新记录。",
    "Search Console for iPhone 更新說明：2.5 版帶來 Blink、全新淺色設計、報告和以真實資料為準的提醒，以及完整的 iOS 更新記錄。",
  ],
  "releases.v250Date": ["October 2026", "Oktober 2026", "Octobre 2026", "Outubro de 2026", "Listopad 2026.", "2026年10月", "2026년 10월", "2026 年 10 月", "2026 年 10 月"],
  "releases.v250New1": [
    "Blink, an on-device assistant that answers questions about your search data with figures, charts and next steps",
    "Blink, ein Assistent auf dem Gerät, der Fragen zu deinen Suchdaten mit Zahlen, Diagrammen und nächsten Schritten beantwortet",
    "Blink, un assistant sur l'appareil qui répond à vos questions sur vos données de recherche avec chiffres, graphiques et étapes suivantes",
    "Blink, um assistente no aparelho que responde perguntas sobre os seus dados de busca com números, gráficos e próximos passos",
    "Blink, asistent na uređaju koji odgovara na pitanja o vašim podacima pretraživanja brojkama, grafikonima i sljedećim koracima",
    "Blink: 検索データについての質問に、数値・グラフ・次の一手で答える端末上のアシスタント",
    "Blink: 검색 데이터에 대한 질문에 수치, 차트, 다음 단계로 답하는 기기 내 어시스턴트",
    "Blink：在设备端运行的助手，用数字、图表和下一步建议回答关于搜索数据的问题",
    "Blink：在裝置端運作的助理，用數字、圖表和下一步建議回答關於搜尋資料的問題",
  ],
  "releases.v250New2": [
    "A new white design across every screen, sheet and widget",
    "Ein neues helles Design auf jedem Bildschirm, in jedem Sheet und Widget",
    "Un nouveau design clair sur chaque écran, feuille et widget",
    "Um novo design claro em todas as telas, folhas e widgets",
    "Novi svijetli dizajn na svakom zaslonu, listu i widgetu",
    "すべての画面、シート、ウィジェットに白基調の新デザイン",
    "모든 화면, 시트, 위젯에 적용된 새로운 밝은 디자인",
    "所有界面、弹层和小组件采用全新浅色设计",
    "所有畫面、彈出視窗和小工具採用全新淺色設計",
  ],
  "releases.v250New3": [
    "Reports from Blink with a PDF preview you can share",
    "Berichte von Blink mit PDF-Vorschau zum Teilen",
    "Des rapports de Blink avec un aperçu PDF à partager",
    "Relatórios do Blink com prévia em PDF para compartilhar",
    "Blinkovi izvještaji s pregledom PDF-a koji možete podijeliti",
    "共有できる PDF プレビュー付きの Blink レポート",
    "공유할 수 있는 PDF 미리보기가 포함된 Blink 보고서",
    "Blink 生成的报告，可预览并分享 PDF",
    "Blink 產生的報告，可預覽並分享 PDF",
  ],
  "releases.v250New4": [
    "Alerts based on real changes in your clicks, with the figures, in Blink's voice",
    "Mitteilungen auf Basis echter Änderungen deiner Klicks, mit Zahlen, in Blinks Stimme",
    "Des alertes fondées sur de vrais changements de vos clics, chiffres à l'appui, avec la voix de Blink",
    "Alertas baseados em mudanças reais nos seus cliques, com os números, na voz do Blink",
    "Upozorenja temeljena na stvarnim promjenama klikova, s brojkama, Blinkovim glasom",
    "クリックの実際の変化に基づくアラート。数値つきで、Blink の声で届きます",
    "클릭의 실제 변화를 바탕으로 한 알림. 수치와 함께 Blink의 목소리로 도착합니다",
    "基于点击量真实变化的提醒，附带数字，由 Blink 的声音送达",
    "以點擊量真實變化為準的提醒，附帶數字，由 Blink 的聲音送達",
  ],
  "releases.v250New5": [
    "Integrations shown one site at a time, with Google Analytics and AdMob linked per site",
    "Integrationen pro Website, mit Google Analytics und AdMob je Website verknüpft",
    "Intégrations affichées site par site, avec Google Analytics et AdMob liés à chaque site",
    "Integrações mostradas um site por vez, com Google Analytics e AdMob vinculados por site",
    "Integracije prikazane za jednu stranicu odjednom, s Google Analyticsom i AdMobom povezanima po stranici",
    "サイトごとに表示される連携。Google アナリティクスと AdMob をサイト単位でリンク",
    "사이트별로 표시되는 연동. Google 애널리틱스와 AdMob을 사이트 단위로 연결",
    "集成按站点逐一显示，可为每个站点关联 Google Analytics 和 AdMob",
    "整合依網站逐一顯示，可為每個網站連結 Google Analytics 和 AdMob",
  ],
  "releases.v250New6": [
    "New sounds, smoother motion, and a 3-day free trial",
    "Neue Töne, flüssigere Animationen und 3 Tage kostenlos testen",
    "Nouveaux sons, animations plus fluides et essai gratuit de 3 jours",
    "Novos sons, animações mais suaves e teste grátis de 3 dias",
    "Novi zvukovi, glađe animacije i besplatna proba od 3 dana",
    "新しいサウンド、なめらかな動き、3日間の無料トライアル",
    "새로운 사운드, 더 부드러운 모션, 3일 무료 체험",
    "全新音效、更流畅的动效，以及 3 天免费试用",
    "全新音效、更流暢的動態效果，以及 3 天免費試用",
  ],
  "releases.sectionNew": ["New", "Neu", "Nouveautés", "Novidades", "Novo", "新機能", "새로운 기능", "新增", "新增"],
}

root = Path(__file__).resolve().parent.parent / "locales"
for index, locale in enumerate(LOCALES):
  path = root / f"{locale}.json"
  data = json.loads(path.read_text(encoding="utf-8"))
  for dotted, values in COPY.items():
    assert len(values) == len(LOCALES), dotted
    section, key = dotted.split(".")
    data.setdefault(section, {})
    if dotted == "releases.sectionNew" and key in data[section]:
      continue
    data[section][key] = values[index]
  path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
  print("updated", locale)
