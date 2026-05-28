import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import StadiumGallery from "./StadiumGallery";
import BracketSimulator from "./BracketSimulator";
import MatchCalendar from "./MatchCalendar";
import GameAlert from "./GameAlert";
import CupQuiz from "./CupQuiz";
import WeatherWidget from "./WeatherWidget";

// ─── THEME CONTEXT ────────────────────────────────────────────────────────────

export const ThemeContext = createContext();
function useTheme() { return useContext(ThemeContext); }

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────

const LANGS = {
  "pt-BR": { label: "Português", flag: "🇧🇷", ttsLang: "pt-BR" },
  "en-US": { label: "English",   flag: "🇺🇸", ttsLang: "en-US" },
  "es-MX": { label: "Español",   flag: "🇲🇽", ttsLang: "es-MX" },
  "fr-FR": { label: "Français",  flag: "🇫🇷", ttsLang: "fr-FR" },
  "de-DE": { label: "Deutsch",   flag: "🇩🇪", ttsLang: "de-DE" },
  "ja-JP": { label: "日本語",    flag: "🇯🇵", ttsLang: "ja-JP" },
  "ar-SA": { label: "العربية",   flag: "🇸🇦", ttsLang: "ar-SA" },
};

const T = {
  "pt-BR": {
    skipLink: "Pular para o conteúdo principal",
    listenBtn: "Ouvir",
    stopBtn: "Parar",
    readingLabel: "Lendo...",
    navCountdown: "Contagem", navGroups: "Grupos & Sedes", navAbout: "Sobre", navFeedback: "Feedback",
    navStadiums: "Estádios",
    navCalendar: "Calendário",
    navSimulator: "Simulador",
    navQuiz: "Quiz",
    navAlert: "Meu Time",
    navWeather: "Clima",
    heroBadge: "11 Jun – 19 Jul 2026",
    heroFlags: "Sedes: EUA, Canadá e México",
    heroSub: "A maior Copa da história.",
    heroTeams: "seleções", heroGroups: "grupos", heroCities: "cidades", heroGames: "jogos",
    heroBtn1: "Ver Grupos", heroBtn2: "Contagem Regressiva",
    cdLabel: "Abertura · 11 Jun 2026 · MetLife Stadium",
    cdTitle: "Contagem", cdHighlight: " Regressiva",
    cdDone: "🏆 A Copa do Mundo está acontecendo AGORA!",
    cdDays: "Dias", cdHours: "Horas", cdMins: "Min", cdSecs: "Seg",
    cdSrText: (d,h,m,s) => `${d} dias, ${h} horas, ${m} minutos e ${s} segundos para o início da Copa.`,
    filterLabel: "Explore a competição",
    filterTitle: "Grupos &", filterHighlight: " Sedes",
    tabGroup: "Por Grupo", tabHost: "Por País Sede",
    groupOf: "seleções", hostStadiums: "estádios",
    panelGroupLabel: (g) => `Seleções do Grupo ${g}`,
    panelHostLabel: (h) => `Estádios sede em ${h}`,
    position: (i) => `Posição ${i+1} no grupo`,
    aboutLabel: "A Copa do Mundo",
    aboutTitle: "Por que 2026 é", aboutHighlight: "histórica?",
    facts: [
      { icon:"🏆", title:"23ª Edição", desc:"A Copa do Mundo FIFA de 2026 será a 23ª edição do maior torneio de futebol do planeta." },
      { icon:"🌎", title:"3 Países Sede", desc:"EUA, Canadá e México formam a primeira sede tripla da história da Copa do Mundo." },
      { icon:"⚽", title:"Formato Inédito", desc:"Pela primeira vez, 48 seleções disputam a fase de grupos em 12 chaves de 4 times cada." },
      { icon:"🏟️", title:"16 Cidades", desc:"11 cidades nos EUA, 2 no Canadá e 3 no México receberão as partidas do torneio." },
      { icon:"📺", title:"5 Bilhões", desc:"Estimativa de audiência global ao longo do torneio." },
      { icon:"💰", title:"Recorde Financeiro", desc:"Premiação total estimada em mais de US$ 1 bilhão, o maior prêmio da história das Copas." },
    ],
    feedbackLabel: "Sua opinião importa",
    feedbackTitle: "Deixe seu", feedbackHighlight: " Feedback",
    feedbackDesc: "Tem alguma sugestão de melhoria para o site? Adoraríamos ouvir você!",
    fieldName: "Seu nome", fieldEmail: "Seu e-mail", fieldMsg: "Sua sugestão ou comentário...",
    fieldRating: "Avaliação",
    submitBtn: "Enviar Feedback",
    successTitle: "Obrigado pelo feedback!",
    successDesc: "Sua mensagem foi recebida. Vamos analisar sua sugestão com carinho!",
    footerText: "Site informativo não oficial · Copa do Mundo FIFA 2026 · EUA, Canadá & México",
    lightMode: "Modo claro", darkMode: "Modo escuro",
    langLabel: "Idioma",
    ttsContent: `Bem-vindo ao site da Copa do Mundo FIFA 2026. O torneio acontece entre 11 de junho e 19 de julho de 2026. São 48 seleções participantes divididas em 12 grupos, disputando 104 jogos em 16 cidades de 3 países: Estados Unidos, Canadá e México. É a maior Copa do Mundo da história!`,
    errName: "Por favor, informe seu nome.", errEmail: "Por favor, informe um e-mail válido.", errMsg: "Por favor, escreva sua mensagem.",
  },
  "en-US": {
    skipLink: "Skip to main content",
    listenBtn: "Listen to site",
    stopBtn: "Stop reading",
    readingLabel: "Reading...",
    navCountdown: "Countdown", navGroups: "Groups & Venues", navAbout: "About", navFeedback: "Feedback",
    navStadiums: "Stadiums",
    navCalendar: "Schedule",
    navSimulator: "Simulator",
    navQuiz: "Quiz",
    navAlert: "My Team",
    navWeather: "Weather",
    heroBadge: "Jun 11 – Jul 19, 2026",
    heroFlags: "Host nations: USA, Canada and Mexico",
    heroSub: "The biggest World Cup ever.",
    heroTeams: "teams", heroGroups: "groups", heroCities: "cities", heroGames: "matches",
    heroBtn1: "View Groups", heroBtn2: "Countdown",
    cdLabel: "Opening · Jun 11 2026 · MetLife Stadium",
    cdTitle: "Count", cdHighlight: "down",
    cdDone: "🏆 The World Cup is happening NOW!",
    cdDays: "Days", cdHours: "Hours", cdMins: "Min", cdSecs: "Sec",
    cdSrText: (d,h,m,s) => `${d} days, ${h} hours, ${m} minutes and ${s} seconds until kick-off.`,
    filterLabel: "Explore the competition",
    filterTitle: "Groups &", filterHighlight: " Venues",
    tabGroup: "By Group", tabHost: "By Host Country",
    groupOf: "teams", hostStadiums: "stadiums",
    panelGroupLabel: (g) => `Teams in Group ${g}`,
    panelHostLabel: (h) => `Host stadiums in ${h}`,
    position: (i) => `Position ${i+1} in group`,
    aboutLabel: "The World Cup",
    aboutTitle: "Why is 2026", aboutHighlight: "historic?",
    facts: [
      { icon:"🏆", title:"23rd Edition", desc:"The 2026 FIFA World Cup is the 23rd edition of the world's greatest football tournament." },
      { icon:"🌎", title:"3 Host Nations", desc:"USA, Canada and Mexico make up the first ever triple-host in World Cup history." },
      { icon:"⚽", title:"Unprecedented Format", desc:"For the first time ever, 48 teams compete in 12 groups of 4 each." },
      { icon:"🏟️", title:"16 Cities", desc:"11 US cities, 2 Canadian and 3 Mexican cities will host matches." },
      { icon:"📺", title:"5 Billion viewers", desc:"Estimated global audience — the biggest sporting event in history." },
      { icon:"💰", title:"Record Prize Money", desc:"Total prize money estimated at over US$1 billion, the highest ever for a World Cup." },
    ],
    feedbackLabel: "Your opinion matters",
    feedbackTitle: "Leave your", feedbackHighlight: " Feedback",
    feedbackDesc: "Have a suggestion to improve the site? We'd love to hear from you!",
    fieldName: "Your name", fieldEmail: "Your email", fieldMsg: "Your suggestion or comment...",
    fieldRating: "Rating",
    submitBtn: "Send Feedback",
    successTitle: "Thanks for your feedback!",
    successDesc: "Your message was received. We'll review your suggestion carefully!",
    footerText: "Unofficial informational site · FIFA World Cup 2026 · USA, Canada & Mexico",
    lightMode: "Light mode", darkMode: "Dark mode",
    langLabel: "Language",
    ttsContent: `Welcome to the FIFA World Cup 2026 website. The tournament takes place between June 11th and July 19th, 2026. There are 48 participating teams divided into 12 groups, playing 104 matches across 16 cities in 3 countries: United States, Canada and Mexico. It is the biggest World Cup in history!`,
    errName: "Please enter your name.", errEmail: "Please enter a valid email.", errMsg: "Please write your message.",
  },
  "es-MX": {
    skipLink: "Saltar al contenido principal",
    listenBtn: "Escuchar el sitio",
    stopBtn: "Detener lectura",
    readingLabel: "Leyendo...",
    navCountdown: "Cuenta regresiva", navGroups: "Grupos & Sedes", navAbout: "Sobre", navFeedback: "Comentarios",
    navStadiums: "Estadios",
    navCalendar: "Calendario",
    navSimulator: "Simulador",
    navQuiz: "Quiz",
    navAlert: "Mi Equipo",
    navWeather: "Clima",
    heroBadge: "11 Jun – 19 Jul 2026",
    heroFlags: "Sedes: EE.UU., Canadá y México",
    heroSub: "La Copa más grande de la historia.",
    heroTeams: "selecciones", heroGroups: "grupos", heroCities: "ciudades", heroGames: "partidos",
    heroBtn1: "Ver Grupos", heroBtn2: "Cuenta Regresiva",
    cdLabel: "Apertura · 11 Jun 2026 · MetLife Stadium",
    cdTitle: "Cuenta", cdHighlight: " Regresiva",
    cdDone: "🏆 ¡La Copa del Mundo está sucediendo AHORA!",
    cdDays: "Días", cdHours: "Horas", cdMins: "Min", cdSecs: "Seg",
    cdSrText: (d,h,m,s) => `${d} días, ${h} horas, ${m} minutos y ${s} segundos para el inicio del Mundial.`,
    filterLabel: "Explora la competición",
    filterTitle: "Grupos &", filterHighlight: " Sedes",
    tabGroup: "Por Grupo", tabHost: "Por País Sede",
    groupOf: "selecciones", hostStadiums: "estadios",
    panelGroupLabel: (g) => `Selecciones del Grupo ${g}`,
    panelHostLabel: (h) => `Estadios sede en ${h}`,
    position: (i) => `Posición ${i+1} en el grupo`,
    aboutLabel: "La Copa del Mundo",
    aboutTitle: "¿Por qué 2026 es", aboutHighlight: "histórica?",
    facts: [
      { icon:"🏆", title:"23ª Edición", desc:"La Copa Mundial FIFA 2026 será la 23ª edición del torneo de fútbol más grande del planeta." },
      { icon:"🌎", title:"3 Países Sede", desc:"EE.UU., Canadá y México forman la primera sede triple en la historia del Mundial." },
      { icon:"⚽", title:"Formato Inédito", desc:"Por primera vez, 48 selecciones disputan la fase de grupos en 12 llaves de 4 equipos." },
      { icon:"🏟️", title:"16 Ciudades", desc:"11 ciudades en EE.UU., 2 en Canadá y 3 en México recibirán los partidos." },
      { icon:"📺", title:"5 Mil Millones", desc:"Audiencia global estimada — el mayor evento deportivo de la historia." },
      { icon:"💰", title:"Récord Económico", desc:"Premio total estimado en más de US$1.000 millones, el mayor en la historia del Mundial." },
    ],
    feedbackLabel: "Tu opinión importa",
    feedbackTitle: "Deja tu", feedbackHighlight: " Comentario",
    feedbackDesc: "¿Tienes alguna sugerencia para mejorar el sitio? ¡Nos encantaría escucharte!",
    fieldName: "Tu nombre", fieldEmail: "Tu correo", fieldMsg: "Tu sugerencia o comentario...",
    fieldRating: "Calificación",
    submitBtn: "Enviar comentario",
    successTitle: "¡Gracias por tu comentario!",
    successDesc: "Tu mensaje fue recibido. ¡Revisaremos tu sugerencia con cuidado!",
    footerText: "Sitio informativo no oficial · Copa Mundial FIFA 2026 · EE.UU., Canadá & México",
    lightMode: "Modo claro", darkMode: "Modo oscuro",
    langLabel: "Idioma",
    ttsContent: `Bienvenido al sitio de la Copa Mundial FIFA 2026. El torneo se realiza entre el 11 de junio y el 19 de julio de 2026. Participan 48 selecciones divididas en 12 grupos, disputando 104 partidos en 16 ciudades de 3 países: Estados Unidos, Canadá y México. ¡Es la Copa del Mundo más grande de la historia!`,
    errName: "Por favor ingresa tu nombre.", errEmail: "Por favor ingresa un correo válido.", errMsg: "Por favor escribe tu mensaje.",
  },
  "fr-FR": {
    skipLink: "Aller au contenu principal",
    listenBtn: "Écouter le site",
    stopBtn: "Arrêter la lecture",
    readingLabel: "Lecture en cours...",
    navCountdown: "Compte à rebours", navGroups: "Groupes & Stades", navAbout: "À propos", navFeedback: "Avis",
    navStadiums: "Stades",
    navCalendar: "Calendrier",
    navSimulator: "Simulateur",
    navQuiz: "Quiz",
    navAlert: "Mon Équipe",
    navWeather: "Météo",
    heroBadge: "11 Juin – 19 Juil 2026",
    heroFlags: "Pays hôtes : États-Unis, Canada et Mexique",
    heroSub: "La plus grande Coupe du Monde de l'histoire.",
    heroTeams: "équipes", heroGroups: "groupes", heroCities: "villes", heroGames: "matchs",
    heroBtn1: "Voir les groupes", heroBtn2: "Compte à rebours",
    cdLabel: "Ouverture · 11 Juin 2026 · MetLife Stadium",
    cdTitle: "Compte à", cdHighlight: " Rebours",
    cdDone: "🏆 La Coupe du Monde se déroule MAINTENANT!",
    cdDays: "Jours", cdHours: "Heures", cdMins: "Min", cdSecs: "Sec",
    cdSrText: (d,h,m,s) => `${d} jours, ${h} heures, ${m} minutes et ${s} secondes avant le début de la Coupe.`,
    filterLabel: "Explorez la compétition",
    filterTitle: "Groupes &", filterHighlight: " Stades",
    tabGroup: "Par Groupe", tabHost: "Par Pays Hôte",
    groupOf: "équipes", hostStadiums: "stades",
    panelGroupLabel: (g) => `Équipes du Groupe ${g}`,
    panelHostLabel: (h) => `Stades hôtes en ${h}`,
    position: (i) => `Position ${i+1} dans le groupe`,
    aboutLabel: "La Coupe du Monde",
    aboutTitle: "Pourquoi 2026 est-elle", aboutHighlight: "historique ?",
    facts: [
      { icon:"🏆", title:"23e Édition", desc:"La Coupe du Monde FIFA 2026 sera la 23e édition du plus grand tournoi de football." },
      { icon:"🌎", title:"3 Pays Hôtes", desc:"États-Unis, Canada et Mexique forment la première triple organisation de l'histoire." },
      { icon:"⚽", title:"Format Inédit", desc:"Pour la première fois, 48 équipes s'affrontent en 12 groupes de 4." },
      { icon:"🏟️", title:"16 Villes", desc:"11 villes aux États-Unis, 2 au Canada et 3 au Mexique accueilleront les matchs." },
      { icon:"📺", title:"5 Milliards", desc:"Audience mondiale estimée — le plus grand événement sportif de l'histoire." },
      { icon:"💰", title:"Record Financier", desc:"Prix total estimé à plus d'1 milliard USD, le plus élevé de l'histoire de la Coupe." },
    ],
    feedbackLabel: "Votre avis compte",
    feedbackTitle: "Laissez votre", feedbackHighlight: " Avis",
    feedbackDesc: "Vous avez une suggestion pour améliorer le site ? Nous aimerions vous entendre !",
    fieldName: "Votre nom", fieldEmail: "Votre e-mail", fieldMsg: "Votre suggestion ou commentaire...",
    fieldRating: "Note",
    submitBtn: "Envoyer l'avis",
    successTitle: "Merci pour votre avis !",
    successDesc: "Votre message a été reçu. Nous examinerons votre suggestion avec soin !",
    footerText: "Site informatif non officiel · Coupe du Monde FIFA 2026 · États-Unis, Canada & Mexique",
    lightMode: "Mode clair", darkMode: "Mode sombre",
    langLabel: "Langue",
    ttsContent: `Bienvenue sur le site de la Coupe du Monde FIFA 2026. Le tournoi se déroule entre le 11 juin et le 19 juillet 2026. 48 équipes participantes sont réparties en 12 groupes, disputant 104 matchs dans 16 villes de 3 pays: États-Unis, Canada et Mexique. C'est la plus grande Coupe du Monde de l'histoire!`,
    errName: "Veuillez entrer votre nom.", errEmail: "Veuillez entrer un e-mail valide.", errMsg: "Veuillez écrire votre message.",
  },
  "de-DE": {
    skipLink: "Zum Hauptinhalt springen",
    listenBtn: "Website anhören",
    stopBtn: "Lesen stoppen",
    readingLabel: "Wird gelesen...",
    navCountdown: "Countdown", navGroups: "Gruppen & Stadien", navAbout: "Über", navFeedback: "Feedback",
    navStadiums: "Stadien",
    navCalendar: "Spielplan",
    navSimulator: "Simulator",
    navQuiz: "Quiz",
    navAlert: "Mein Team",
    navWeather: "Wetter",
    heroBadge: "11. Jun – 19. Jul 2026",
    heroFlags: "Gastgeberländer: USA, Kanada und Mexiko",
    heroSub: "Die größte WM aller Zeiten.",
    heroTeams: "Mannschaften", heroGroups: "Gruppen", heroCities: "Städte", heroGames: "Spiele",
    heroBtn1: "Gruppen ansehen", heroBtn2: "Countdown",
    cdLabel: "Eröffnung · 11. Jun 2026 · MetLife Stadium",
    cdTitle: "Count", cdHighlight: "down",
    cdDone: "🏆 Die WM findet JETZT statt!",
    cdDays: "Tage", cdHours: "Std", cdMins: "Min", cdSecs: "Sek",
    cdSrText: (d,h,m,s) => `Noch ${d} Tage, ${h} Stunden, ${m} Minuten und ${s} Sekunden bis zum WM-Start.`,
    filterLabel: "Die Konkurrenz erkunden",
    filterTitle: "Gruppen &", filterHighlight: " Stadien",
    tabGroup: "Nach Gruppe", tabHost: "Nach Gastgeberland",
    groupOf: "Mannschaften", hostStadiums: "Stadien",
    panelGroupLabel: (g) => `Mannschaften der Gruppe ${g}`,
    panelHostLabel: (h) => `Gastgeberstadien in ${h}`,
    position: (i) => `Position ${i+1} in der Gruppe`,
    aboutLabel: "Die Weltmeisterschaft",
    aboutTitle: "Warum ist 2026", aboutHighlight: "historisch?",
    facts: [
      { icon:"🏆", title:"23. Ausgabe", desc:"Die FIFA WM 2026 ist die 23. Ausgabe des größten Fußballturniers der Welt." },
      { icon:"🌎", title:"3 Gastgeberländer", desc:"USA, Kanada und Mexiko bilden die erste Dreifach-Ausrichtung in der WM-Geschichte." },
      { icon:"⚽", title:"Neues Format", desc:"Erstmals nehmen 48 Mannschaften in 12 Vierergruppen teil." },
      { icon:"🏟️", title:"16 Städte", desc:"11 US-Städte, 2 in Kanada und 3 in Mexiko werden Spiele ausrichten." },
      { icon:"📺", title:"5 Milliarden", desc:"Geschätzte globale Zuschauerzahl — das größte Sportereignis der Geschichte." },
      { icon:"💰", title:"Rekordbetrag", desc:"Gesamtpreisgeld von über 1 Milliarde USD — Rekord in der WM-Geschichte." },
    ],
    feedbackLabel: "Ihre Meinung zählt",
    feedbackTitle: "Hinterlassen Sie", feedbackHighlight: " Feedback",
    feedbackDesc: "Haben Sie Verbesserungsvorschläge für die Website? Wir würden uns freuen!",
    fieldName: "Ihr Name", fieldEmail: "Ihre E-Mail", fieldMsg: "Ihr Vorschlag oder Kommentar...",
    fieldRating: "Bewertung",
    submitBtn: "Feedback senden",
    successTitle: "Danke für Ihr Feedback!",
    successDesc: "Ihre Nachricht wurde empfangen. Wir werden Ihren Vorschlag sorgfältig prüfen!",
    footerText: "Inoffizielle Informationsseite · FIFA WM 2026 · USA, Kanada & Mexiko",
    lightMode: "Heller Modus", darkMode: "Dunkler Modus",
    langLabel: "Sprache",
    ttsContent: `Willkommen auf der FIFA Weltmeisterschaft 2026 Website. Das Turnier findet zwischen dem 11. Juni und dem 19. Juli 2026 statt. 48 Mannschaften sind in 12 Gruppen aufgeteilt und bestreiten 104 Spiele in 16 Städten in 3 Ländern: Vereinigte Staaten, Kanada und Mexiko. Es ist die größte Weltmeisterschaft der Geschichte!`,
    errName: "Bitte geben Sie Ihren Namen ein.", errEmail: "Bitte geben Sie eine gültige E-Mail ein.", errMsg: "Bitte schreiben Sie Ihre Nachricht.",
  },
  "ja-JP": {
    skipLink: "メインコンテンツへスキップ",
    listenBtn: "サイトを聴く",
    stopBtn: "読み上げ停止",
    readingLabel: "読み上げ中...",
    navCountdown: "カウントダウン", navGroups: "グループ＆会場", navAbout: "概要", navFeedback: "フィードバック",
    navStadiums: "スタジアム",
    navCalendar: "日程",
    navSimulator: "シミュレーター",
    navQuiz: "クイズ",
    navAlert: "マイチーム",
    navWeather: "天気",
    heroBadge: "2026年6月11日 – 7月19日",
    heroFlags: "開催国：アメリカ、カナダ、メキシコ",
    heroSub: "史上最大のワールドカップ。",
    heroTeams: "チーム", heroGroups: "グループ", heroCities: "都市", heroGames: "試合",
    heroBtn1: "グループを見る", heroBtn2: "カウントダウン",
    cdLabel: "開幕 · 2026年6月11日 · メットライフスタジアム",
    cdTitle: "カウント", cdHighlight: "ダウン",
    cdDone: "🏆 ワールドカップが今まさに開催中！",
    cdDays: "日", cdHours: "時", cdMins: "分", cdSecs: "秒",
    cdSrText: (d,h,m,s) => `開幕まで残り${d}日${h}時間${m}分${s}秒。`,
    filterLabel: "大会を探索",
    filterTitle: "グループ＆", filterHighlight: "会場",
    tabGroup: "グループ別", tabHost: "開催国別",
    groupOf: "チーム", hostStadiums: "スタジアム",
    panelGroupLabel: (g) => `グループ${g}のチーム`,
    panelHostLabel: (h) => `${h}の開催スタジアム`,
    position: (i) => `グループ内${i+1}位`,
    aboutLabel: "ワールドカップ",
    aboutTitle: "2026年が", aboutHighlight: "歴史的な理由",
    facts: [
      { icon:"🏆", title:"第23回大会", desc:"FIFA2026年ワールドカップは、世界最大のサッカートーナメントの第23回大会です。" },
      { icon:"🌎", title:"3カ国共催", desc:"アメリカ、カナダ、メキシコによる史上初の3カ国共催。" },
      { icon:"⚽", title:"新フォーマット", desc:"初めて48チームが12のグループに分かれて競います。" },
      { icon:"🏟️", title:"16都市", desc:"アメリカ11都市、カナダ2都市、メキシコ3都市で試合が開催。" },
      { icon:"📺", title:"50億人", desc:"世界中の推定視聴者数 — 史上最大のスポーツイベント。" },
      { icon:"💰", title:"賞金記録", desc:"総賞金は10億ドル以上と見込まれ、ワールドカップ史上最高額。" },
    ],
    feedbackLabel: "ご意見をお聞かせください",
    feedbackTitle: "フィードバックを", feedbackHighlight: "送る",
    feedbackDesc: "サイトへの改善提案がありましたら、ぜひお聞かせください！",
    fieldName: "お名前", fieldEmail: "メールアドレス", fieldMsg: "ご提案またはコメント...",
    fieldRating: "評価",
    submitBtn: "送信する",
    successTitle: "フィードバックありがとうございます！",
    successDesc: "メッセージを受け取りました。ご提案を丁寧に確認いたします！",
    footerText: "非公式情報サイト · FIFA ワールドカップ 2026 · アメリカ、カナダ＆メキシコ",
    lightMode: "ライトモード", darkMode: "ダークモード",
    langLabel: "言語",
    ttsContent: `FIFAワールドカップ2026のウェブサイトへようこそ。大会は2026年6月11日から7月19日まで開催されます。48チームが12のグループに分かれ、アメリカ、カナダ、メキシコの3カ国16都市で104試合が行われます。史上最大のワールドカップです！`,
    errName: "お名前を入力してください。", errEmail: "有効なメールアドレスを入力してください。", errMsg: "メッセージを入力してください。",
  },
  "ar-SA": {
    skipLink: "انتقل إلى المحتوى الرئيسي",
    listenBtn: "استمع إلى الموقع",
    stopBtn: "إيقاف القراءة",
    readingLabel: "جارٍ القراءة...",
    navCountdown: "العد التنازلي", navGroups: "المجموعات والملاعب", navAbout: "عن الكأس", navFeedback: "ملاحظات",
    navStadiums: "الملاعب",
    navCalendar: "الجدول",
    navSimulator: "المحاكاة",
    navQuiz: "اختبار",
    navAlert: "فريقي",
    navWeather: "الطقس",
    heroBadge: "11 يونيو – 19 يوليو 2026",
    heroFlags: "دول الاستضافة: الولايات المتحدة وكندا والمكسيك",
    heroSub: "أكبر كأس عالم في التاريخ.",
    heroTeams: "منتخبًا", heroGroups: "مجموعات", heroCities: "مدينة", heroGames: "مباراة",
    heroBtn1: "عرض المجموعات", heroBtn2: "العد التنازلي",
    cdLabel: "الافتتاح · 11 يونيو 2026 · ملعب ميتلايف",
    cdTitle: "العد", cdHighlight: " التنازلي",
    cdDone: "🏆 كأس العالم يجري الآن!",
    cdDays: "أيام", cdHours: "ساعات", cdMins: "دقائق", cdSecs: "ثواني",
    cdSrText: (d,h,m,s) => `${d} يومًا و${h} ساعة و${m} دقيقة و${s} ثانية حتى انطلاق الكأس.`,
    filterLabel: "استكشف البطولة",
    filterTitle: "المجموعات &", filterHighlight: " الملاعب",
    tabGroup: "حسب المجموعة", tabHost: "حسب البلد المضيف",
    groupOf: "منتخبات", hostStadiums: "ملاعب",
    panelGroupLabel: (g) => `منتخبات المجموعة ${g}`,
    panelHostLabel: (h) => `ملاعب الاستضافة في ${h}`,
    position: (i) => `المركز ${i+1} في المجموعة`,
    aboutLabel: "كأس العالم",
    aboutTitle: "لماذا 2026", aboutHighlight: "تاريخية؟",
    facts: [
      { icon:"🏆", title:"النسخة 23", desc:"كأس العالم FIFA 2026 هي النسخة الثالثة والعشرون من أكبر بطولة كرة قدم في العالم." },
      { icon:"🌎", title:"3 دول مضيفة", desc:"الولايات المتحدة وكندا والمكسيك تشكل أول استضافة مشتركة ثلاثية في التاريخ." },
      { icon:"⚽", title:"نظام غير مسبوق", desc:"لأول مرة، تتنافس 48 منتخبًا في 12 مجموعة من 4 فرق." },
      { icon:"🏟️", title:"16 مدينة", desc:"11 مدينة أمريكية و2 كندية و3 مكسيكية ستستضيف المباريات." },
      { icon:"📺", title:"5 مليارات مشاهد", desc:"الجمهور العالمي المتوقع — أكبر حدث رياضي في التاريخ." },
      { icon:"💰", title:"رقم قياسي مالي", desc:"جائزة إجمالية تُقدَّر بأكثر من مليار دولار، الأعلى في تاريخ كأس العالم." },
    ],
    feedbackLabel: "رأيك يهمنا",
    feedbackTitle: "أرسل", feedbackHighlight: " ملاحظاتك",
    feedbackDesc: "هل لديك اقتراح لتحسين الموقع؟ نحن نحب أن نسمع منك!",
    fieldName: "اسمك", fieldEmail: "بريدك الإلكتروني", fieldMsg: "اقتراحك أو تعليقك...",
    fieldRating: "التقييم",
    submitBtn: "إرسال الملاحظات",
    successTitle: "شكرًا على ملاحظاتك!",
    successDesc: "تم استلام رسالتك. سنراجع اقتراحك بعناية!",
    footerText: "موقع إعلامي غير رسمي · كأس العالم FIFA 2026 · الولايات المتحدة وكندا والمكسيك",
    lightMode: "الوضع الفاتح", darkMode: "الوضع الداكن",
    langLabel: "اللغة",
    ttsContent: `مرحبًا بك في موقع كأس العالم FIFA 2026. تُقام البطولة بين 11 يونيو و19 يوليو 2026. تشارك 48 منتخبًا مقسمة إلى 12 مجموعة، وتُلعب 104 مباريات في 16 مدينة من 3 دول: الولايات المتحدة الأمريكية وكندا والمكسيك. إنها أكبر كأس عالم في التاريخ!`,
    errName: "يرجى إدخال اسمك.", errEmail: "يرجى إدخال بريد إلكتروني صالح.", errMsg: "يرجى كتابة رسالتك.",
  },
};

// ─── DATA ─────────────────────────────────────────────────────────────────────

const GROUPS = {
  A: ["Qatar", "Ecuador", "Senegal", "Netherlands"],
  B: ["England", "Iran", "USA", "Wales"],
  C: ["Argentina", "Saudi Arabia", "Mexico", "Poland"],
  D: ["France", "Australia", "Denmark", "Tunisia"],
  E: ["Spain", "Costa Rica", "Germany", "Japan"],
  F: ["Belgium", "Canada", "Morocco", "Croatia"],
  G: ["Brazil", "Serbia", "Switzerland", "Cameroon"],
  H: ["Portugal", "Ghana", "Uruguay", "South Korea"],
  I: ["Netherlands", "Senegal", "Ecuador", "Qatar"],
  J: ["Italy", "Colombia", "Egypt", "Ivory Coast"],
  K: ["Nigeria", "South Africa", "Chile", "New Zealand"],
  L: ["Iran", "Algeria", "Indonesia", "Peru"],
};

const HOSTS = {
  USA: {
    flag: "🇺🇸",
    stadiums: ["MetLife Stadium (NY/NJ)", "AT&T Stadium (Dallas)", "SoFi Stadium (Los Angeles)", "Levi's Stadium (SF)", "Rose Bowl (Pasadena)", "Hard Rock Stadium (Miami)", "Gillette Stadium (Boston)", "Lincoln Financial Field (Philadelphia)", "Arrowhead Stadium (Kansas City)", "Lumen Field (Seattle)", "Mercedes-Benz Stadium (Atlanta)"],
  },
  Canada: { flag: "🇨🇦", stadiums: ["BC Place (Vancouver)", "BMO Field (Toronto)"] },
  Mexico: { flag: "🇲🇽", stadiums: ["Estadio Azteca (Cidade do México)", "Estadio Akron (Guadalajara)", "Estadio BBVA (Monterrey)"] },
};

const TEAMS_FLAGS = {
  "Qatar":"🇶🇦","Ecuador":"🇪🇨","Senegal":"🇸🇳","Netherlands":"🇳🇱","England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Iran":"🇮🇷","USA":"🇺🇸","Wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Argentina":"🇦🇷","Saudi Arabia":"🇸🇦","Mexico":"🇲🇽","Poland":"🇵🇱","France":"🇫🇷","Australia":"🇦🇺","Denmark":"🇩🇰","Tunisia":"🇹🇳","Spain":"🇪🇸","Costa Rica":"🇨🇷","Germany":"🇩🇪","Japan":"🇯🇵","Belgium":"🇧🇪","Canada":"🇨🇦","Morocco":"🇲🇦","Croatia":"🇭🇷","Brazil":"🇧🇷","Serbia":"🇷🇸","Switzerland":"🇨🇭","Cameroon":"🇨🇲","Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","South Korea":"🇰🇷","Italy":"🇮🇹","Colombia":"🇨🇴","Egypt":"🇪🇬","Ivory Coast":"🇨🇮","Nigeria":"🇳🇬","South Africa":"🇿🇦","Chile":"🇨🇱","New Zealand":"🇳🇿","Algeria":"🇩🇿","Indonesia":"🇮🇩","Peru":"🇵🇪",
};

const OPENING_DATE = new Date("2026-06-11T16:00:00-05:00");

// ─── COUNTDOWN HOOK ───────────────────────────────────────────────────────────

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const calc = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) return setTimeLeft({ days:0, hours:0, minutes:0, seconds:0, done:true });
      setTimeLeft({ days:Math.floor(diff/86400000), hours:Math.floor((diff%86400000)/3600000), minutes:Math.floor((diff%3600000)/60000), seconds:Math.floor((diff%60000)/1000), done:false });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

// ─── TTS BUTTON ──────────────────────────────────────────────────────────────

function TTSButton({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;
    stop();
    const utt = new SpeechSynthesisUtterance(t.ttsContent);
    utt.lang = LANGS[lang].ttsLang;
    utt.rate = 0.9;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [t, lang, stop]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  return (
    <button
      onClick={speaking ? stop : speak}
      aria-pressed={speaking}
      aria-label={speaking ? t.stopBtn : t.listenBtn}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm shadow-2xl transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2
        ${speaking
          ? "bg-red-500 hover:bg-red-400 text-white shadow-red-500/40"
          : dark
            ? "bg-yellow-400 hover:bg-yellow-300 text-slate-900 shadow-yellow-500/30"
            : "bg-yellow-500 hover:bg-yellow-400 text-slate-900 shadow-yellow-500/30"
        }`}
    >
      {speaking ? (
        <>
          <span className="relative flex h-3 w-3" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          {t.readingLabel}
        </>
      ) : (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
          {t.listenBtn}
        </>
      )}
    </button>
  );
}

// ─── LANGUAGE SELECTOR ────────────────────────────────────────────────────────

function LangSelector({ lang, setLang }) {
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={T[lang].langLabel}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
          ${dark
            ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
      >
        <span aria-hidden="true">{LANGS[lang].flag}</span>
        <span className="hidden sm:inline">{LANGS[lang].label}</span>
        <svg className={`w-3 h-3 transition-transform ${open?"rotate-180":""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Selecionar idioma"
          className={`absolute right-0 top-full mt-2 w-44 rounded-2xl shadow-2xl border overflow-hidden z-50
            ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
        >
          {Object.entries(LANGS).map(([code, info]) => (
            <li key={code} role="option" aria-selected={lang === code}>
              <button
                onClick={() => { setLang(code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-left transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-400
                  ${lang === code
                    ? "bg-yellow-400/20 text-yellow-600"
                    : dark
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <span aria-hidden="true">{info.flag}</span>
                {info.label}
                {lang === code && <span className="ml-auto text-yellow-500" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

function ThemeToggle({ lang }) {
  const { dark, toggleDark } = useTheme();
  const t = T[lang];
  return (
    <button
      onClick={toggleDark}
      aria-label={dark ? t.lightMode : t.darkMode}
      className={`p-2 rounded-xl border transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
        ${dark
          ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700"
          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
        }`}
    >
      {dark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────

function Nav({ lang, setLang }) {
  const { dark } = useTheme();
  const t = T[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#countdown", label: t.navCountdown },
    { href: "#grupos", label: t.navGroups },
    { href: "#estadios", label: t.navStadiums },
    { href: "#simulador",  label: t.navSimulator },
    { href: "#calendario", label: t.navCalendar  },
    { href: "#quiz", label: t.navQuiz },
    { href: "#alertas", label: t.navAlert },
    { href: "#clima", label: t.navWeather },
    { href: "#sobre", label: t.navAbout },
    { href: "#feedback", label: t.navFeedback },
  ];

  const navBg = scrolled
    ? dark
      ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-xl"
      : "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-md"
    : "bg-transparent";

  return (
    <nav aria-label="Navegação principal" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <a href="#" className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded" aria-label="FIFA World Cup 2026 — Início">
          <span aria-hidden="true">⚽</span>
          <span className={`font-black text-sm uppercase tracking-widest ${dark ? "text-white group-hover:text-yellow-400" : "text-slate-900 group-hover:text-yellow-600"} transition-colors`}>
            WC<span className="text-yellow-500">2026</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-4" role="list">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={`text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded
                ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle lang={lang} />
          <LangSelector lang={lang} setLang={setLang} />
          <button
            className={`md:hidden flex flex-col gap-1.5 p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
            aria-expanded={menuOpen} aria-controls="mobile-menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen(v => !v)}
          >
            {[0,1,2].map(i => (
              <span key={i} className={`block w-5 h-0.5 transition-transform duration-200 ${dark ? "bg-white" : "bg-slate-900"}
                ${i===0 && menuOpen ? "rotate-45 translate-y-2" : ""}
                ${i===1 && menuOpen ? "opacity-0" : ""}
                ${i===2 && menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            ))}
          </button>
        </div>
      </div>

      <div id="mobile-menu" aria-hidden={!menuOpen}
        className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          ${dark ? "bg-slate-950/95 border-b border-slate-800" : "bg-white/95 border-b border-slate-200"} backdrop-blur-md`}>
        <ul className="flex flex-col py-4 px-4 gap-1" role="list">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${dark ? "text-slate-300 hover:text-white hover:bg-slate-800" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];

  return (
    <header className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${dark ? "bg-slate-950" : "bg-gradient-to-b from-slate-100 to-white"}`} role="banner">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute inset-0 opacity-[0.04]`} style={{ backgroundImage:"linear-gradient(rgba(0,0,0,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.2) 1px,transparent 1px)", backgroundSize:"40px 40px" }} />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl ${dark ? "bg-emerald-900/40" : "bg-emerald-200/60"}`} />
        <div className={`absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl ${dark ? "bg-blue-900/20" : "bg-blue-200/40"}`} />
        <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl ${dark ? "bg-yellow-900/15" : "bg-yellow-200/30"}`} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-8
          ${dark ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-emerald-100 border border-emerald-300 text-emerald-700"}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          {t.heroBadge}
        </div>

        <p className="text-4xl mb-6 tracking-widest" aria-label={t.heroFlags} role="img">🇺🇸 🇨🇦 🇲🇽</p>

        <h1 className="font-black uppercase leading-none mb-4">
          <span className={`block text-5xl sm:text-7xl md:text-8xl tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>FIFA</span>
          <span className="block text-4xl sm:text-6xl md:text-7xl tracking-tighter bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent" style={{WebkitBackgroundClip:"text"}}>World Cup</span>
          <span className={`block text-5xl sm:text-7xl md:text-8xl tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>2026</span>
        </h1>

        <p className={`mt-8 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-light ${dark ? "text-slate-400" : "text-slate-600"}`}>
          {t.heroSub}{" "}
          <strong className={dark ? "text-white" : "text-slate-900"}>48 {t.heroTeams}</strong>,{" "}
          <strong className={dark ? "text-white" : "text-slate-900"}>12 {t.heroGroups}</strong>,{" "}
          <strong className={dark ? "text-white" : "text-slate-900"}>16 {t.heroCities}</strong>,{" "}
          <strong className={dark ? "text-white" : "text-slate-900"}>104 {t.heroGames}</strong>.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3" role="list" aria-label="Estatísticas">
          {[["48", t.heroTeams],["12", t.heroGroups],["16", t.heroCities],["104", t.heroGames]].map(([n,l]) => (
            <div key={l} role="listitem" className={`flex flex-col items-center px-5 py-3 rounded-2xl border backdrop-blur-sm
              ${dark ? "bg-slate-800/60 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"}`}>
              <span className="text-2xl font-black text-yellow-500">{n}</span>
              <span className={`text-xs uppercase tracking-widest font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{l}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <a href="#grupos" className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-wide text-sm transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2">
            {t.heroBtn1}
          </a>
          <a href="#countdown" className={`px-8 py-4 rounded-2xl font-bold uppercase tracking-wide text-sm transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2
            ${dark ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700" : "bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 shadow-sm"}`}>
            {t.heroBtn2}
          </a>
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${dark ? "text-slate-600" : "text-slate-400"}`} aria-hidden="true">
        <span className="text-[10px] uppercase tracking-widest">↓</span>
      </div>
    </header>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────

function CountdownUnit({ value, label }) {
  const { dark } = useTheme();
  return (
    <div className="flex flex-col items-center gap-1 min-w-[66px]">
      <div className={`w-14 h-14 md:w-18 md:h-18 flex items-center justify-center rounded-xl border shadow-lg
        ${dark ? "bg-yellow-400/10 border-yellow-500/30 shadow-yellow-500/10" : "bg-yellow-50 border-yellow-300 shadow-yellow-200"}`} aria-hidden="true">
        <span className={`text-2xl md:text-3xl font-black tabular-nums leading-none ${dark ? "text-yellow-300" : "text-yellow-600"}`}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className={`text-[10px] uppercase tracking-widest font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}

function Countdown({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  const ti = useCountdown(OPENING_DATE);
  const srText = ti.done ? t.cdDone : t.cdSrText(ti.days, ti.hours, ti.minutes, ti.seconds);

  return (
    <section aria-labelledby="countdown-heading" className={`relative py-16 md:py-24 overflow-hidden ${dark ? "" : "bg-slate-50"}`}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-3xl ${dark ? "bg-yellow-500/10" : "bg-yellow-100/80"}`} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 ${dark ? "text-yellow-500" : "text-yellow-600"}`}>{t.cdLabel}</p>
        <h2 id="countdown-heading" className={`text-3xl md:text-5xl font-black uppercase mb-10 leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {t.cdTitle}<span className="text-yellow-500">{t.cdHighlight}</span>
        </h2>
        <div aria-live="polite" aria-atomic="true" className="sr-only">{srText}</div>
        {ti.done ? (
          <p className="text-2xl font-bold text-yellow-500 animate-pulse" role="status">{t.cdDone}</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6" aria-hidden="true">
            <CountdownUnit value={ti.days} label={t.cdDays} />
            <div className={`flex items-center pb-6 font-black text-2xl ${dark ? "text-yellow-500" : "text-yellow-600"}`}>:</div>
            <CountdownUnit value={ti.hours} label={t.cdHours} />
            <div className={`flex items-center pb-6 font-black text-2xl ${dark ? "text-yellow-500" : "text-yellow-600"}`}>:</div>
            <CountdownUnit value={ti.minutes} label={t.cdMins} />
            <div className={`flex items-center pb-6 font-black text-2xl ${dark ? "text-yellow-500" : "text-yellow-600"}`}>:</div>
            <CountdownUnit value={ti.seconds} label={t.cdSecs} />
          </div>
        )}
      </div>
    </section>
  );
}

// ─── GROUP FILTER ─────────────────────────────────────────────────────────────

function GroupFilter({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  const [mode, setMode] = useState("group");
  const [selected, setSelected] = useState("A");
  const [selectedHost, setSelectedHost] = useState("USA");

  const sectionBg = dark ? "bg-slate-900/60 backdrop-blur-sm" : "bg-slate-100/80";
  const panelBg = dark ? "bg-slate-800/60 border-slate-700/50" : "bg-white border-slate-200 shadow-sm";
  const itemBg = dark ? "bg-slate-900/70 border-slate-700/50 hover:border-emerald-500/40" : "bg-slate-50 border-slate-200 hover:border-emerald-400";

  return (
    <section aria-labelledby="filter-heading" className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-5xl mx-auto px-4">
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-emerald-400" : "text-emerald-600"}`}>{t.filterLabel}</p>
        <h2 id="filter-heading" className={`text-3xl md:text-5xl font-black uppercase mb-10 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {t.filterTitle}<span className="text-emerald-500">{t.filterHighlight}</span>
        </h2>

        <div role="tablist" aria-label="Modo de visualização" className="flex justify-center gap-2 mb-8">
          {[["group", t.tabGroup], ["host", t.tabHost]].map(([val, lbl]) => (
            <button key={val} role="tab" aria-selected={mode === val} onClick={() => { setMode(val); setSelected("A"); setSelectedHost("USA"); }}
              className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                ${mode === val
                  ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-500/30"
                  : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}>{lbl}</button>
          ))}
        </div>

        {mode === "group" && (
          <div role="tablist" aria-label="Selecionar grupo" className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.keys(GROUPS).map(g => (
              <button key={g} role="tab" aria-selected={selected === g} onClick={() => setSelected(g)}
                className={`w-10 h-10 rounded-lg text-sm font-black uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${selected === g ? "bg-emerald-500 text-white shadow-md scale-110" : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>{g}</button>
            ))}
          </div>
        )}

        {mode === "host" && (
          <div role="tablist" aria-label="Selecionar país sede" className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.entries(HOSTS).map(([country, info]) => (
              <button key={country} role="tab" aria-selected={selectedHost === country} onClick={() => setSelectedHost(country)}
                className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${selectedHost === country ? "bg-emerald-500 text-white shadow-md scale-105" : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
                <span aria-hidden="true">{info.flag}</span>{country}
              </button>
            ))}
          </div>
        )}

        <div id="filter-panel" role="tabpanel" aria-live="polite" className={`rounded-2xl border p-6 md:p-8 ${panelBg}`}>
          {mode === "group" && (
            <>
              <h3 className={`text-lg font-black uppercase tracking-wide mb-5 ${dark ? "text-white" : "text-slate-900"}`}>
                <span className="text-emerald-500">Grupo {selected}</span>
                <span className={`text-sm font-medium ml-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>— {GROUPS[selected].length} {t.groupOf}</span>
              </h3>
              <ul aria-label={t.panelGroupLabel(selected)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GROUPS[selected].map((team, i) => (
                  <li key={team} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors duration-150 group ${itemBg}`}>
                    <span className="text-3xl leading-none flex-shrink-0" aria-hidden="true">{TEAMS_FLAGS[team] || "🏳️"}</span>
                    <div>
                      <p className={`font-bold group-hover:text-emerald-500 transition-colors ${dark ? "text-white" : "text-slate-900"}`}>{team}</p>
                      <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.position(i)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          {mode === "host" && (
            <>
              <h3 className={`text-lg font-black uppercase tracking-wide mb-5 flex items-center gap-3 ${dark ? "text-white" : "text-slate-900"}`}>
                <span aria-hidden="true" className="text-2xl">{HOSTS[selectedHost].flag}</span>
                <span><span className="text-emerald-500">{selectedHost}</span>
                  <span className={`text-sm font-medium ml-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>— {HOSTS[selectedHost].stadiums.length} {t.hostStadiums}</span>
                </span>
              </h3>
              <ul aria-label={t.panelHostLabel(selectedHost)} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HOSTS[selectedHost].stadiums.map(s => (
                  <li key={s} className={`flex items-center gap-3 p-4 rounded-xl border transition-colors duration-150 group ${itemBg}`}>
                    <span className="text-emerald-500 flex-shrink-0" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </span>
                    <p className={`font-semibold text-sm leading-snug group-hover:text-emerald-500 transition-colors ${dark ? "text-slate-200" : "text-slate-700"}`}>{s}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

function About({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  return (
    <section id="sobre" aria-labelledby="about-heading" className={`py-16 md:py-24 ${dark ? "" : "bg-white"}`}>
      <div className="max-w-5xl mx-auto px-4">
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-blue-400" : "text-blue-600"}`}>{t.aboutLabel}</p>
        <h2 id="about-heading" className={`text-3xl md:text-5xl font-black uppercase mb-12 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {t.aboutTitle}<br /><span className={dark ? "text-blue-400" : "text-blue-600"}>{t.aboutHighlight}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.facts.map(({ icon, title, desc }) => (
            <article key={title} className={`p-6 rounded-2xl border transition-all duration-200 group
              ${dark ? "bg-slate-800/40 border-slate-700/50 hover:border-blue-500/30 hover:bg-slate-800/70" : "bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"}`}>
              <span className="text-3xl block mb-4" aria-hidden="true">{icon}</span>
              <h3 className={`font-black text-base mb-2 transition-colors ${dark ? "text-white group-hover:text-blue-400" : "text-slate-900 group-hover:text-blue-600"}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────

function Feedback({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  const [form, setForm] = useState({ name: "", email: "", message: "", rating: 0 });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t.errName;
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) e.email = t.errEmail;
    if (!form.message.trim()) e.message = t.errMsg;
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(true);
  };

  const inputClass = (field) => `w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
    focus:ring-2 focus:ring-yellow-400 focus:border-transparent
    ${errors[field] ? "border-red-400 bg-red-50/10" : dark ? "border-slate-700 bg-slate-800/60 text-white placeholder-slate-500" : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"}`;

  const labelClass = `block text-xs font-bold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-400" : "text-slate-600"}`;

  const sectionBg = dark ? "bg-slate-900/60 backdrop-blur-sm" : "bg-slate-50";

  return (
    <section id="feedback" aria-labelledby="feedback-heading" className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-2xl mx-auto px-4">
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-emerald-400" : "text-emerald-600"}`}>{t.feedbackLabel}</p>
        <h2 id="feedback-heading" className={`text-3xl md:text-4xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {t.feedbackTitle}<span className="text-emerald-500">{t.feedbackHighlight}</span>
        </h2>
        <p className={`text-center text-sm mb-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>{t.feedbackDesc}</p>

        {submitted ? (
          <div role="status" aria-live="polite" className={`rounded-2xl border p-10 text-center ${dark ? "bg-slate-800/60 border-emerald-500/30" : "bg-white border-emerald-300 shadow-sm"}`}>
            <div className="text-5xl mb-4" aria-hidden="true">🎉</div>
            <h3 className={`text-xl font-black mb-2 ${dark ? "text-white" : "text-slate-900"}`}>{t.successTitle}</h3>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{t.successDesc}</p>
            <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", message:"", rating:0 }); }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
              ↩ Novo feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate aria-label="Formulário de feedback"
            className={`rounded-2xl border p-6 md:p-8 space-y-5 ${dark ? "bg-slate-800/60 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"}`}>

            {/* Rating Stars */}
            <div>
              <p className={labelClass} id="rating-label">{t.fieldRating}</p>
              <div role="radiogroup" aria-labelledby="rating-label" className="flex gap-2 mt-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" role="radio" aria-checked={form.rating === star}
                    aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setForm(f => ({ ...f, rating: star }))}
                    className="text-2xl transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded">
                    <span aria-hidden="true">{star <= (hoveredStar || form.rating) ? "⭐" : "☆"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="fb-name" className={labelClass}>{t.fieldName} *</label>
              <input id="fb-name" type="text" autoComplete="name" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined}
                placeholder={t.fieldName} className={inputClass("name")} />
              {errors.name && <p id="err-name" role="alert" className="mt-1 text-xs text-red-400 font-semibold">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="fb-email" className={labelClass}>{t.fieldEmail} *</label>
              <input id="fb-email" type="email" autoComplete="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined}
                placeholder={t.fieldEmail} className={inputClass("email")} />
              {errors.email && <p id="err-email" role="alert" className="mt-1 text-xs text-red-400 font-semibold">{errors.email}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="fb-message" className={labelClass}>{t.fieldMsg.replace("...", "")} *</label>
              <textarea id="fb-message" rows={4} value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? "err-message" : undefined}
                placeholder={t.fieldMsg} className={`${inputClass("message")} resize-none`} />
              {errors.message && <p id="err-message" role="alert" className="mt-1 text-xs text-red-400 font-semibold">{errors.message}</p>}
            </div>

            <button type="submit"
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white font-black uppercase tracking-wide text-sm transition-all duration-200 shadow-lg shadow-emerald-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2">
              {t.submitBtn} →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer({ lang }) {
  const { dark } = useTheme();
  const t = T[lang];
  return (
    <footer role="contentinfo" className={`border-t py-10 ${dark ? "border-slate-800" : "border-slate-200 bg-white"}`}>
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span aria-hidden="true">⚽</span>
          <span className={`font-black text-sm uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-600"}`}>
            WC<span className="text-yellow-500">2026</span>
          </span>
        </div>
        <p className={`text-xs text-center ${dark ? "text-slate-600" : "text-slate-400"}`}>{t.footerText} | <a href="https://github.com/jorgemuriloceub" target="_blank" rel="noopener noreferrer">Jorge Murilo</a> - <a href="https://github.com/filemoura" target="_blank" rel="noopener noreferrer">Miguel Moura</a> - <a  href="https://github.com/dudamarquesst" target="_blank" rel="noopener noreferrer">Maria Eduarda</a> - <a href="https://github.com/LucasGabrielPaes" target="_blank" rel="noopener noreferrer">Lucas Gabriel</a></p>
        <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-3 text-xs">
          <span>🇺🇸</span><span>🇨🇦</span><span>🇲🇽</span>
        </div>
      </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

function AppContent() {
  const { dark } = useTheme();
  const [lang, setLang] = useState(() =>
  localStorage.getItem("wc2026_lang") || "pt-BR"
);

const handleSetLang = (newLang) => {
  setLang(newLang);
  localStorage.setItem("wc2026_lang", newLang);
};
  const t = T[lang];
  const isRtl = lang === "ar-SA";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${dark ? "bg-slate-950 text-white" : "bg-white text-slate-900"}`}
      dir={isRtl ? "rtl" : "ltr"} lang={lang}>

      <a href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] px-4 py-2 font-bold rounded-lg text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900
          ${dark ? "bg-yellow-400 text-slate-900" : "bg-yellow-500 text-white"}`}>
        {t.skipLink}
      </a>

      <Nav lang={lang} setLang={handleSetLang} />
      <TTSButton lang={lang} />

      <main id="main-content" tabIndex={-1}>
        <Hero lang={lang} />
        <div id="countdown"><Countdown lang={lang} /></div>
        <div id="grupos"><GroupFilter lang={lang} /></div>
        <div id="estadios"><StadiumGallery lang={lang} /></div>
        <div id="clima"><WeatherWidget lang={lang} /></div>
        <div id="simulador"><BracketSimulator lang={lang} /></div>
        <div id="calendario"><MatchCalendar lang={lang} /></div>
        <div id="alertas"><GameAlert lang={lang} /></div>
        <div id="quiz"><CupQuiz lang={lang} /></div>
        <About lang={lang} />
        <Feedback lang={lang} />
      </main>

      <Footer lang={lang} />
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("wc2026_theme");
    return saved ? saved === "dark" : true;
  });

  const toggleDark = useCallback(() => {
    setDark(v => {
      const next = !v;
      localStorage.setItem("wc2026_theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <AppContent />
    </ThemeContext.Provider>
  );
}
