#!/usr/bin/env python3
"""Copy for the rebuilt 2.5 home page (hero, film, plans, section labels) in every locale.

Run from docs/:  python3 scripts/apply-2.5-home.py
Order of each list: en, de, fr, pt, hr, ja, ko, zh-Hans, zh-Hant.
"""
import json
from pathlib import Path

LOCALES = ["en", "de", "fr", "pt", "hr", "ja", "ko", "zh-Hans", "zh-Hant"]

COPY = {
  "hero.titleA": ["Your Search Console data.", "Deine Search-Console-Daten.", "Vos données Search Console.", "Seus dados do Search Console.", "Vaši Search Console podaci.", "あなたの Search Console データ。", "내 Search Console 데이터.", "你的 Search Console 数据。", "你的 Search Console 資料。"],
  "hero.titleB": ["With someone to ask.", "Mit jemandem, den du fragen kannst.", "Avec quelqu'un à qui demander.", "Com alguém para perguntar.", "Uz nekoga koga možete pitati.", "聞ける相手と一緒に。", "물어볼 상대와 함께.", "还有人可以问。", "還有人可以問。"],
  "hero.watch": ["Watch the film", "Film ansehen", "Voir le film", "Ver o filme", "Pogledajte film", "ムービーを見る", "영상 보기", "观看影片", "觀看影片"],
  "hero.bubble": ["Ask me anything.", "Frag mich was.", "Demandez-moi.", "Pergunte o que quiser.", "Pitajte me bilo što.", "なんでも聞いて。", "무엇이든 물어보세요.", "尽管问我。", "儘管問我。"],
  "hero.blinkAlt": ["Blink, the app's assistant", "Blink, der Assistent der App", "Blink, l'assistant de l'app", "Blink, o assistente do app", "Blink, asistent aplikacije", "アプリのアシスタント Blink", "앱의 어시스턴트 Blink", "应用助手 Blink", "App 助理 Blink"],
  "film.eyebrow": ["The film", "Der Film", "Le film", "O filme", "Film", "ムービー", "영상", "影片", "影片"],
  "film.title": ["Blink in 32 seconds", "Blink in 32 Sekunden", "Blink en 32 secondes", "Blink em 32 segundos", "Blink u 32 sekunde", "32秒でわかる Blink", "32초로 보는 Blink", "32 秒认识 Blink", "32 秒認識 Blink"],
  "film.desc": [
    "Everything new in 2.5, from the first question to the report.",
    "Alles Neue in 2.5, von der ersten Frage bis zum Bericht.",
    "Toutes les nouveautés de la 2.5, de la première question au rapport.",
    "Tudo o que há de novo na 2.5, da primeira pergunta ao relatório.",
    "Sve novo u 2.5, od prvog pitanja do izvještaja.",
    "最初の質問からレポートまで、2.5 の新機能をまとめて。",
    "첫 질문부터 보고서까지, 2.5의 새로운 기능을 한 번에.",
    "从第一个问题到报告，2.5 的全部新功能。",
    "從第一個問題到報告，2.5 的全部新功能。",
  ],
  "film.play": ["Play the film", "Film abspielen", "Lire le film", "Reproduzir o filme", "Pokreni film", "ムービーを再生", "영상 재생", "播放影片", "播放影片"],
  "film.note": ["Plays from YouTube · sample data", "Wiedergabe über YouTube · Beispieldaten", "Lecture via YouTube · données d'exemple", "Reproduzido pelo YouTube · dados de exemplo", "Reprodukcija s YouTubea · primjeri podataka", "YouTube で再生 · サンプルデータ", "YouTube에서 재생 · 샘플 데이터", "通过 YouTube 播放 · 示例数据", "透過 YouTube 播放 · 範例資料"],
  "plans.eyebrow": ["Plans", "Tarife", "Offres", "Planos", "Planovi", "プラン", "요금제", "方案", "方案"],
  "plans.title": ["Free to start. Premium when you need more.", "Kostenlos starten. Premium, wenn du mehr brauchst.", "Gratuit pour commencer. Premium quand il vous en faut plus.", "Grátis para começar. Premium quando precisar de mais.", "Besplatno za početak. Premium kada trebate više.", "まずは無料で。必要になったらプレミアム。", "무료로 시작하고, 더 필요할 때 프리미엄으로.", "免费开始，需要更多时再升级。", "免費開始，需要更多時再升級。"],
  "plans.desc": [
    "Premium is $5.99 a month after a 3-day free trial, or $1.99 a week. Cancel anytime in the App Store.",
    "Premium kostet 5,99 $ pro Monat nach 3 Tagen kostenlosem Test oder 1,99 $ pro Woche. Jederzeit im App Store kündbar.",
    "Premium coûte 5,99 $ par mois après 3 jours d'essai gratuit, ou 1,99 $ par semaine. Annulez à tout moment dans l'App Store.",
    "O Premium custa US$ 5,99 por mês após 3 dias de teste grátis, ou US$ 1,99 por semana. Cancele quando quiser na App Store.",
    "Premium je 5,99 $ mjesečno nakon 3 dana besplatne probe ili 1,99 $ tjedno. Otkažite bilo kada u App Storeu.",
    "プレミアムは3日間の無料トライアル後に月額 $5.99、または週額 $1.99。App Store でいつでも解約できます。",
    "프리미엄은 3일 무료 체험 후 월 $5.99 또는 주 $1.99입니다. App Store에서 언제든지 해지할 수 있습니다.",
    "高级版在 3 天免费试用后每月 $5.99，或每周 $1.99。可随时在 App Store 取消。",
    "進階版在 3 天免費試用後每月 $5.99，或每週 $1.99。可隨時在 App Store 取消。",
  ],
  "plans.free": ["Free", "Kostenlos", "Gratuit", "Grátis", "Besplatno", "無料", "무료", "免费", "免費"],
  "plans.premium": ["Premium", "Premium", "Premium", "Premium", "Premium", "プレミアム", "프리미엄", "高级版", "進階版"],
  "plans.feature": ["Feature", "Funktion", "Fonction", "Recurso", "Značajka", "機能", "기능", "功能", "功能"],
  "plans.rowSearch": ["Search performance", "Suchleistung", "Performances de recherche", "Desempenho de busca", "Učinak pretraživanja", "検索パフォーマンス", "검색 실적", "搜索表现", "搜尋成效"],
  "plans.rowProperties": ["Properties", "Properties", "Propriétés", "Propriedades", "Posjedi", "プロパティ", "속성", "资源", "資源"],
  "plans.rowBlink": ["Blink assistant and reports", "Blink-Assistent und Berichte", "Assistant Blink et rapports", "Assistente Blink e relatórios", "Asistent Blink i izvještaji", "Blink アシスタントとレポート", "Blink 어시스턴트와 보고서", "Blink 助手和报告", "Blink 助理與報告"],
  "plans.rowVitals": ["Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals", "Core Web Vitals"],
  "plans.rowInspect": ["URL inspection", "URL-Prüfung", "Inspection d'URL", "Inspeção de URL", "Provjera URL-a", "URL 検査", "URL 검사", "网址检查", "網址檢查"],
  "plans.rowAds": ["Ads", "Werbung", "Publicités", "Anúncios", "Oglasi", "広告", "광고", "广告", "廣告"],
  "plans.one": ["1", "1", "1", "1", "1", "1", "1", "1", "1"],
  "plans.all": ["All", "Alle", "Toutes", "Todas", "Svi", "すべて", "전체", "全部", "全部"],
  "plans.yes": ["Yes", "Ja", "Oui", "Sim", "Da", "あり", "있음", "有", "有"],
  "plans.no": ["None", "Keine", "Aucune", "Nenhum", "Nema", "なし", "없음", "无", "無"],
  "plans.included": ["Included", "Enthalten", "Inclus", "Incluído", "Uključeno", "含まれます", "포함", "包含", "包含"],
  "plans.notIncluded": ["Not included", "Nicht enthalten", "Non inclus", "Não incluído", "Nije uključeno", "含まれません", "미포함", "不包含", "不包含"],
  "demo.hint": ["Tap a figure. Drag along the chart.", "Tippe auf eine Zahl. Ziehe über das Diagramm.", "Touchez un chiffre. Faites glisser sur le graphique.", "Toque em um número. Arraste pelo gráfico.", "Dodirnite brojku. Povucite po grafikonu.", "数値をタップ。グラフをなぞる。", "수치를 탭하고 차트를 따라 드래그하세요.", "点一个数字。沿图表拖动。", "點一個數字。沿圖表拖曳。"],
  "demo.range": ["Last 28 days", "Letzte 28 Tage", "28 derniers jours", "Últimos 28 dias", "Zadnjih 28 dana", "過去28日間", "지난 28일", "最近 28 天", "最近 28 天"],
  "sound.on": ["Sound on", "Ton an", "Son activé", "Som ligado", "Zvuk uključen", "サウンド オン", "소리 켬", "声音开", "聲音開"],
  "sound.off": ["Sound off", "Ton aus", "Son coupé", "Som desligado", "Zvuk isključen", "サウンド オフ", "소리 끔", "声音关", "聲音關"],
  "story.proofTitle": ["See what moved, in seconds", "Sieh in Sekunden, was sich bewegt hat", "Voyez ce qui a bougé, en quelques secondes", "Veja o que mudou, em segundos", "Vidite što se promijenilo, u nekoliko sekundi", "何が動いたか、数秒で", "무엇이 움직였는지, 몇 초 만에", "几秒钟看清哪里变了", "幾秒鐘看清哪裡變了"],
  "story.proofDesc": ["This is the app's Overview. Pick a figure to change the chart, then drag along it to read a single day.", "Das ist die Übersicht der App. Wähle eine Zahl, um das Diagramm zu wechseln, und ziehe darüber, um einen einzelnen Tag abzulesen.", "Voici la vue d'ensemble de l'app. Choisissez un chiffre pour changer le graphique, puis faites glisser pour lire une journée.", "Esta é a Visão geral do app. Escolha um número para trocar o gráfico e arraste para ler um único dia.", "Ovo je Pregled iz aplikacije. Odaberite brojku da promijenite grafikon, zatim povucite po njemu da očitate jedan dan.", "これがアプリの概要画面です。数値を選ぶとグラフが切り替わり、なぞると1日ごとの値を読めます。", "앱의 개요 화면입니다. 수치를 선택하면 차트가 바뀌고, 드래그하면 하루 단위 값을 읽을 수 있습니다.", "这就是应用的概览。选一个数字切换图表，再沿图表拖动查看某一天。", "這就是 App 的總覽。選一個數字切換圖表，再沿圖表拖曳查看某一天。"],
  "valueProps.eyebrow": ["Why an app", "Warum eine App", "Pourquoi une app", "Por que um app", "Zašto aplikacija", "アプリである理由", "앱인 이유", "为什么用应用", "為什麼用 App"],
  "story.proofEyebrow": ["The numbers", "Die Zahlen", "Les chiffres", "Os números", "Brojke", "数値", "수치", "数据", "數據"],
  "howTo.eyebrow": ["Getting started", "Erste Schritte", "Pour commencer", "Primeiros passos", "Prvi koraci", "はじめに", "시작하기", "开始使用", "開始使用"],
  "features.eyebrow": ["What is inside", "Was drin ist", "Ce qu'il y a dedans", "O que tem dentro", "Što je unutra", "アプリの中身", "앱 구성", "应用内容", "App 內容"],
  "screenshots.eyebrow": ["The app", "Die App", "L'app", "O app", "Aplikacija", "アプリ", "앱", "应用", "App"],
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
