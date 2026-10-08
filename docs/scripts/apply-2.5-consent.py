#!/usr/bin/env python3
"""Privacy card copy in every locale. Run from docs/: python3 scripts/apply-2.5-consent.py
Order: en, de, fr, pt, hr, ja, ko, zh-Hans, zh-Hant."""
import json
from pathlib import Path

LOCALES = ["en", "de", "fr", "pt", "hr", "ja", "ko", "zh-Hans", "zh-Hant"]
COPY = {
  "button": [
    "Privacy",
    "Datenschutz",
    "Confidentialité",
    "Privacidade",
    "Privatnost",
    "プライバシー",
    "개인정보",
    "隐私",
    "隱私"
  ],
  "title": [
    "Privacy settings",
    "Datenschutz-Einstellungen",
    "Paramètres de confidentialité",
    "Configurações de privacidade",
    "Postavke privatnosti",
    "プライバシー設定",
    "개인정보 설정",
    "隐私设置",
    "隱私設定"
  ],
  "body": [
    "This site can use Google Analytics to count visits and App Store clicks. It is your choice, and you can change it here at any time.",
    "Diese Website kann Google Analytics nutzen, um Besuche und App-Store-Klicks zu zählen. Du entscheidest und kannst es hier jederzeit ändern.",
    "Ce site peut utiliser Google Analytics pour compter les visites et les clics vers l'App Store. C'est votre choix, modifiable ici à tout moment.",
    "Este site pode usar o Google Analytics para contar visitas e cliques na App Store. A escolha é sua e pode ser alterada aqui a qualquer momento.",
    "Ova stranica može koristiti Google Analytics za brojanje posjeta i klikova na App Store. Izbor je vaš i možete ga ovdje promijeniti u bilo kojem trenutku.",
    "このサイトは、訪問数と App Store へのクリック数を数えるために Google アナリティクスを使うことがあります。選ぶのはあなたです。ここでいつでも変更できます。",
    "이 사이트는 방문 수와 App Store 클릭 수를 세기 위해 Google 애널리틱스를 사용할 수 있습니다. 선택은 여러분의 몫이며 언제든지 여기에서 변경할 수 있습니다.",
    "本网站可使用 Google Analytics 统计访问量和 App Store 点击量。由你决定，并可随时在此更改。",
    "本網站可使用 Google Analytics 統計造訪量和 App Store 點擊量。由你決定，並可隨時在此變更。"
  ],
  "analytics": [
    "Analytics",
    "Analyse",
    "Mesure d'audience",
    "Análise",
    "Analitika",
    "アナリティクス",
    "분석",
    "分析",
    "分析"
  ],
  "necessary": [
    "Your language and sound choices are saved in this browser only. They are not sent anywhere.",
    "Deine Sprach- und Ton-Einstellungen werden nur in diesem Browser gespeichert. Sie werden nirgendwohin gesendet.",
    "Vos choix de langue et de son sont enregistrés uniquement dans ce navigateur. Ils ne sont envoyés nulle part.",
    "As suas escolhas de idioma e som ficam salvas apenas neste navegador. Não são enviadas a lugar nenhum.",
    "Vaš odabir jezika i zvuka sprema se samo u ovom pregledniku. Ne šalje se nikamo.",
    "言語とサウンドの設定は、このブラウザーにのみ保存されます。どこにも送信されません。",
    "언어와 소리 설정은 이 브라우저에만 저장됩니다. 어디에도 전송되지 않습니다.",
    "你的语言和声音选择仅保存在此浏览器中，不会发送到任何地方。",
    "你的語言和聲音選擇僅儲存在此瀏覽器中，不會傳送到任何地方。"
  ],
  "allow": [
    "Allow analytics",
    "Analyse erlauben",
    "Autoriser",
    "Permitir análise",
    "Dopusti analitiku",
    "アナリティクスを許可",
    "분석 허용",
    "允许分析",
    "允許分析"
  ],
  "decline": [
    "Turn off",
    "Ausschalten",
    "Désactiver",
    "Desativar",
    "Isključi",
    "オフにする",
    "끄기",
    "关闭",
    "關閉"
  ],
  "on": [
    "On",
    "An",
    "Activé",
    "Ligado",
    "Uključeno",
    "オン",
    "켬",
    "开",
    "開"
  ],
  "off": [
    "Off",
    "Aus",
    "Désactivé",
    "Desligado",
    "Isključeno",
    "オフ",
    "끔",
    "关",
    "關"
  ],
  "policy": [
    "Privacy policy",
    "Datenschutzerklärung",
    "Politique de confidentialité",
    "Política de privacidade",
    "Pravila o privatnosti",
    "プライバシーポリシー",
    "개인정보처리방침",
    "隐私政策",
    "隱私權政策"
  ],
  "close": [
    "Close",
    "Schließen",
    "Fermer",
    "Fechar",
    "Zatvori",
    "閉じる",
    "닫기",
    "关闭",
    "關閉"
  ]
}

root = Path(__file__).resolve().parent.parent / "locales"
for index, locale in enumerate(LOCALES):
  path = root / f"{locale}.json"
  data = json.loads(path.read_text(encoding="utf-8"))
  data["consent"] = {key: values[index] for key, values in COPY.items()}
  path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
