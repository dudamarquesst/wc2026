/**
 * CupQuiz.jsx
 * Quiz de trivia sobre a história da Copa do Mundo FIFA.
 */
import QuizRanking, { saveQuizScore } from "./QuizRanking";
import { useState, useEffect, useCallback, useContext } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── UI STRINGS ───────────────────────────────────────────────────────────────

const UI = {
  "pt-BR": {
    sectionLabel: "Teste seus conhecimentos",
    title: "Quiz da", highlight: " Copa",
    desc: "20 perguntas sobre a história da Copa do Mundo FIFA. Você consegue acertar todas?",
    startBtn: "Começar Quiz",
    nextBtn: "Próxima →",
    finishBtn: "Ver Resultado",
    restartBtn: "Jogar Novamente",
    question: "Pergunta",
    of: "de",
    correct: "Correto! 🎉",
    wrong: "Errado!",
    correctAnswer: "Resposta correta:",
    score: "Sua Pontuação",
    timeLeft: "Tempo",
    seconds: "s",
    results: {
      perfect: { emoji:"🏆", title:"Campeão Mundial!", desc:"Pontuação perfeita! Você é um expert em Copa do Mundo." },
      great:   { emoji:"🥇", title:"Excelente!", desc:"Resultado incrível! Você conhece muito bem a Copa." },
      good:    { emoji:"🥈", title:"Muito Bom!", desc:"Bom resultado. Estude mais um pouco para ser campeão!" },
      ok:      { emoji:"🥉", title:"Razoável", desc:"Você sabe o básico. Hora de revisar a história da Copa!" },
      bad:     { emoji:"⚽", title:"Continue Tentando!", desc:"Não desanime! Releia o site e tente novamente." },
    },
    difficulty: { easy:"Fácil", medium:"Médio", hard:"Difícil" },
    categoryLabel: "Categoria",
    difficultyLabel: "Dificuldade",
    timeBonus: "Bônus de tempo",
    shareScore: "Compartilhar",
    copied: "Copiado!",
    streak: "Sequência",
  },
  "en-US": {
    sectionLabel: "Test your knowledge",
    title: "World Cup", highlight: " Quiz",
    desc: "20 questions about FIFA World Cup history. Can you get them all right?",
    startBtn: "Start Quiz",
    nextBtn: "Next →",
    finishBtn: "See Results",
    restartBtn: "Play Again",
    question: "Question",
    of: "of",
    correct: "Correct! 🎉",
    wrong: "Wrong!",
    correctAnswer: "Correct answer:",
    score: "Your Score",
    timeLeft: "Time",
    seconds: "s",
    results: {
      perfect: { emoji:"🏆", title:"World Champion!", desc:"Perfect score! You're a true World Cup expert." },
      great:   { emoji:"🥇", title:"Excellent!", desc:"Amazing result! You know the World Cup very well." },
      good:    { emoji:"🥈", title:"Very Good!", desc:"Good result. Study a bit more to be a champion!" },
      ok:      { emoji:"🥉", title:"Not Bad", desc:"You know the basics. Time to brush up on World Cup history!" },
      bad:     { emoji:"⚽", title:"Keep Trying!", desc:"Don't give up! Read the site again and try once more." },
    },
    difficulty: { easy:"Easy", medium:"Medium", hard:"Hard" },
    categoryLabel: "Category",
    difficultyLabel: "Difficulty",
    timeBonus: "Time bonus",
    shareScore: "Share",
    copied: "Copied!",
    streak: "Streak",
  },
  "es-MX": {
    sectionLabel: "Pon a prueba tu conocimiento",
    title: "Quiz del", highlight: " Mundial",
    desc: "20 preguntas sobre la historia de la Copa del Mundo FIFA. ¿Puedes acertarlas todas?",
    startBtn: "Comenzar Quiz",
    nextBtn: "Siguiente →",
    finishBtn: "Ver Resultado",
    restartBtn: "Jugar de Nuevo",
    question: "Pregunta",
    of: "de",
    correct: "¡Correcto! 🎉",
    wrong: "¡Incorrecto!",
    correctAnswer: "Respuesta correcta:",
    score: "Tu Puntuación",
    timeLeft: "Tiempo",
    seconds: "s",
    results: {
      perfect: { emoji:"🏆", title:"¡Campeón Mundial!", desc:"¡Puntuación perfecta! Eres un experto en Copa del Mundo." },
      great:   { emoji:"🥇", title:"¡Excelente!", desc:"¡Resultado increíble! Conoces muy bien el Mundial." },
      good:    { emoji:"🥈", title:"¡Muy Bien!", desc:"Buen resultado. ¡Estudia un poco más para ser campeón!" },
      ok:      { emoji:"🥉", title:"Regular", desc:"Sabes lo básico. ¡Es hora de repasar la historia del Mundial!" },
      bad:     { emoji:"⚽", title:"¡Sigue Intentando!", desc:"¡No te desanimes! Revisa el sitio e inténtalo de nuevo." },
    },
    difficulty: { easy:"Fácil", medium:"Medio", hard:"Difícil" },
    categoryLabel: "Categoría",
    difficultyLabel: "Dificultad",
    timeBonus: "Bono de tiempo",
    shareScore: "Compartir",
    copied: "¡Copiado!",
    streak: "Racha",
  },
  "fr-FR": {
    sectionLabel: "Testez vos connaissances",
    title: "Quiz de la", highlight: " Coupe",
    desc: "20 questions sur l'histoire de la Coupe du Monde FIFA. Pouvez-vous toutes les réussir?",
    startBtn: "Commencer le Quiz",
    nextBtn: "Suivant →",
    finishBtn: "Voir les Résultats",
    restartBtn: "Rejouer",
    question: "Question",
    of: "sur",
    correct: "Correct ! 🎉",
    wrong: "Incorrect !",
    correctAnswer: "Bonne réponse :",
    score: "Votre Score",
    timeLeft: "Temps",
    seconds: "s",
    results: {
      perfect: { emoji:"🏆", title:"Champion du Monde!", desc:"Score parfait ! Vous êtes un expert de la Coupe du Monde." },
      great:   { emoji:"🥇", title:"Excellent!", desc:"Résultat incroyable ! Vous connaissez très bien la Coupe." },
      good:    { emoji:"🥈", title:"Très Bien!", desc:"Bon résultat. Étudiez encore un peu pour être champion !" },
      ok:      { emoji:"🥉", title:"Pas Mal", desc:"Vous connaissez les bases. Révisez l'histoire de la Coupe !" },
      bad:     { emoji:"⚽", title:"Continuez!", desc:"Ne vous découragez pas ! Relisez le site et réessayez." },
    },
    difficulty: { easy:"Facile", medium:"Moyen", hard:"Difficile" },
    categoryLabel: "Catégorie",
    difficultyLabel: "Difficulté",
    timeBonus: "Bonus de temps",
    shareScore: "Partager",
    copied: "Copié !",
    streak: "Série",
  },
  "de-DE": {
    sectionLabel: "Teste dein Wissen",
    title: "WM", highlight: "-Quiz",
    desc: "20 Fragen zur Geschichte der FIFA Weltmeisterschaft. Kannst du alle richtig beantworten?",
    startBtn: "Quiz starten",
    nextBtn: "Weiter →",
    finishBtn: "Ergebnis sehen",
    restartBtn: "Nochmal spielen",
    question: "Frage",
    of: "von",
    correct: "Richtig! 🎉",
    wrong: "Falsch!",
    correctAnswer: "Richtige Antwort:",
    score: "Dein Ergebnis",
    timeLeft: "Zeit",
    seconds: "s",
    results: {
      perfect: { emoji:"🏆", title:"Weltmeister!", desc:"Perfektes Ergebnis! Du bist ein echter WM-Experte." },
      great:   { emoji:"🥇", title:"Ausgezeichnet!", desc:"Fantastisches Ergebnis! Du kennst die WM sehr gut." },
      good:    { emoji:"🥈", title:"Sehr Gut!", desc:"Gutes Ergebnis. Lerne noch etwas mehr, um Meister zu werden!" },
      ok:      { emoji:"🥉", title:"Nicht Schlecht", desc:"Du kennst die Grundlagen. Zeit, die WM-Geschichte aufzufrischen!" },
      bad:     { emoji:"⚽", title:"Weiter Versuchen!", desc:"Nicht aufgeben! Lies die Seite nochmal und versuche es erneut." },
    },
    difficulty: { easy:"Leicht", medium:"Mittel", hard:"Schwer" },
    categoryLabel: "Kategorie",
    difficultyLabel: "Schwierigkeit",
    timeBonus: "Zeitbonus",
    shareScore: "Teilen",
    copied: "Kopiert!",
    streak: "Serie",
  },
  "ja-JP": {
    sectionLabel: "知識を試そう",
    title: "ワールドカップ", highlight: "クイズ",
    desc: "FIFAワールドカップの歴史に関する20問。全問正解できる？",
    startBtn: "クイズを開始",
    nextBtn: "次へ →",
    finishBtn: "結果を見る",
    restartBtn: "もう一度プレイ",
    question: "質問",
    of: "/",
    correct: "正解！🎉",
    wrong: "不正解！",
    correctAnswer: "正しい答え：",
    score: "あなたのスコア",
    timeLeft: "残り時間",
    seconds: "秒",
    results: {
      perfect: { emoji:"🏆", title:"世界チャンピオン！", desc:"完璧なスコア！あなたはワールドカップの真の専門家です。" },
      great:   { emoji:"🥇", title:"素晴らしい！", desc:"驚異的な結果！ワールドカップをよく知っていますね。" },
      good:    { emoji:"🥈", title:"とても良い！", desc:"良い結果です。チャンピオンになるためにもう少し勉強しましょう！" },
      ok:      { emoji:"🥉", title:"まあまあ", desc:"基本は知っています。ワールドカップの歴史を見直す時間です！" },
      bad:     { emoji:"⚽", title:"諦めないで！", desc:"諦めないで！サイトをもう一度読んでまた挑戦しましょう。" },
    },
    difficulty: { easy:"易しい", medium:"普通", hard:"難しい" },
    categoryLabel: "カテゴリー",
    difficultyLabel: "難易度",
    timeBonus: "タイムボーナス",
    shareScore: "シェア",
    copied: "コピーしました！",
    streak: "連続正解",
  },
  "ar-SA": {
    sectionLabel: "اختبر معلوماتك",
    title: "اختبار", highlight: " كأس العالم",
    desc: "20 سؤالاً عن تاريخ كأس العالم FIFA. هل يمكنك الإجابة على جميعها؟",
    startBtn: "ابدأ الاختبار",
    nextBtn: "التالي →",
    finishBtn: "عرض النتائج",
    restartBtn: "العب مرة أخرى",
    question: "سؤال",
    of: "من",
    correct: "صحيح! 🎉",
    wrong: "خطأ!",
    correctAnswer: "الإجابة الصحيحة:",
    score: "نتيجتك",
    timeLeft: "الوقت",
    seconds: "ث",
    results: {
      perfect: { emoji:"🏆", title:"بطل العالم!", desc:"نتيجة مثالية! أنت خبير حقيقي في كأس العالم." },
      great:   { emoji:"🥇", title:"ممتاز!", desc:"نتيجة رائعة! أنت تعرف كأس العالم جيداً." },
      good:    { emoji:"🥈", title:"جيد جداً!", desc:"نتيجة جيدة. ادرس أكثر قليلاً لتصبح بطلاً!" },
      ok:      { emoji:"🥉", title:"مقبول", desc:"تعرف الأساسيات. حان وقت مراجعة تاريخ كأس العالم!" },
      bad:     { emoji:"⚽", title:"استمر في المحاولة!", desc:"لا تستسلم! اقرأ الموقع مرة أخرى وحاول مجدداً." },
    },
    difficulty: { easy:"سهل", medium:"متوسط", hard:"صعب" },
    categoryLabel: "الفئة",
    difficultyLabel: "الصعوبة",
    timeBonus: "مكافأة الوقت",
    shareScore: "مشاركة",
    copied: "تم النسخ!",
    streak: "سلسلة",
  },
};

// ─── QUESTIONS ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  { id:1,  category:"História",    difficulty:"easy",   question:{ "pt-BR":"Em que ano aconteceu a primeira Copa do Mundo FIFA?", "en-US":"In what year was the first FIFA World Cup held?", "es-MX":"¿En qué año se celebró la primera Copa del Mundo FIFA?", "fr-FR":"En quelle année s'est tenue la première Coupe du Monde FIFA?", "de-DE":"In welchem Jahr fand die erste FIFA Weltmeisterschaft statt?", "ja-JP":"FIFAワールドカップが初めて開催されたのは何年？", "ar-SA":"في أي عام أُقيمت أول كأس عالم FIFA؟" }, options:["1926","1930","1934","1938"], correct:1 },
  { id:2,  category:"Campeões",    difficulty:"easy",   question:{ "pt-BR":"Qual seleção tem mais títulos mundiais?", "en-US":"Which national team has won the most World Cup titles?", "es-MX":"¿Qué selección tiene más títulos mundiales?", "fr-FR":"Quelle équipe nationale a remporté le plus de titres mondiaux?", "de-DE":"Welche Nationalmannschaft hat die meisten WM-Titel gewonnen?", "ja-JP":"最多のワールドカップ優勝回数を誇る国はどこ？", "ar-SA":"أي منتخب فاز بأكبر عدد من ألقاب كأس العالم؟" }, options:["Alemanha","Argentina","Brasil","Itália"], correct:2 },
  { id:3,  category:"Estádios",    difficulty:"medium", question:{ "pt-BR":"Qual estádio sediará a final da Copa 2026?", "en-US":"Which stadium will host the 2026 World Cup final?", "es-MX":"¿Qué estadio albergará la final del Mundial 2026?", "fr-FR":"Quel stade accueillera la finale de la Coupe 2026?", "de-DE":"Welches Stadion wird das Finale der WM 2026 ausrichten?", "ja-JP":"2026年ワールドカップ決勝を開催するスタジアムは？", "ar-SA":"أي ملعب سيستضيف نهائي كأس العالم 2026؟" }, options:["Rose Bowl","AT&T Stadium","MetLife Stadium","SoFi Stadium"], correct:2 },
  { id:4,  category:"Recordes",    difficulty:"medium", question:{ "pt-BR":"Quem é o maior artilheiro da história das Copas?", "en-US":"Who is the all-time top scorer in World Cup history?", "es-MX":"¿Quién es el máximo goleador de la historia de los Mundiales?", "fr-FR":"Qui est le meilleur buteur de l'histoire des Coupes du Monde?", "de-DE":"Wer ist der erfolgreichste Torschütze der WM-Geschichte?", "ja-JP":"ワールドカップ史上最多得点者は誰？", "ar-SA":"من هو الهداف التاريخي لكأس العالم؟" }, options:["Pelé","Ronaldo","Miroslav Klose","Gerd Müller"], correct:2 },
  { id:5,  category:"2026",        difficulty:"easy",   question:{ "pt-BR":"Quantas seleções participam da Copa 2026?", "en-US":"How many teams participate in the 2026 World Cup?", "es-MX":"¿Cuántas selecciones participan en el Mundial 2026?", "fr-FR":"Combien d'équipes participent à la Coupe 2026?", "de-DE":"Wie viele Mannschaften nehmen an der WM 2026 teil?", "ja-JP":"2026年ワールドカップには何チームが参加する？", "ar-SA":"كم منتخباً يشارك في كأس العالم 2026؟" }, options:["32","40","48","64"], correct:2 },
  { id:6,  category:"História",    difficulty:"medium", question:{ "pt-BR":"Qual país sediou a Copa de 1994?", "en-US":"Which country hosted the 1994 World Cup?", "es-MX":"¿Qué país fue sede del Mundial de 1994?", "fr-FR":"Quel pays a accueilli la Coupe du Monde 1994?", "de-DE":"Welches Land war Gastgeber der WM 1994?", "ja-JP":"1994年ワールドカップの開催国はどこ？", "ar-SA":"أي دولة استضافت كأس العالم 1994؟" }, options:["Brasil","Alemanha","França","EUA"], correct:3 },
  { id:7,  category:"Recordes",    difficulty:"hard",   question:{ "pt-BR":"Qual foi o placar mais goleada da história das Copas?", "en-US":"What was the biggest margin of victory in World Cup history?", "es-MX":"¿Cuál fue la mayor goleada en la historia de los Mundiales?", "fr-FR":"Quel fut le plus grand écart de buts dans l'histoire des Coupes?", "de-DE":"Was war der höchste Sieg in der WM-Geschichte?", "ja-JP":"ワールドカップ史上最大の大差勝利のスコアは？", "ar-SA":"ما هي أكبر نتيجة في تاريخ كأس العالم؟" }, options:["9-0","10-1","12-0","11-0"], correct:0 },
  { id:8,  category:"Campeões",    difficulty:"medium", question:{ "pt-BR":"Qual país ganhou a Copa de 2018 na Rússia?", "en-US":"Which country won the 2018 World Cup in Russia?", "es-MX":"¿Qué país ganó el Mundial de 2018 en Rusia?", "fr-FR":"Quel pays a gagné la Coupe du Monde 2018 en Russie?", "de-DE":"Welches Land gewann die WM 2018 in Russland?", "ja-JP":"2018年ロシアワールドカップで優勝した国は？", "ar-SA":"أي دولة فازت بكأس العالم 2018 في روسيا؟" }, options:["Croácia","Brasil","Argentina","França"], correct:3 },
  { id:9,  category:"2026",        difficulty:"easy",   question:{ "pt-BR":"Quantos países sediam a Copa 2026?", "en-US":"How many countries co-host the 2026 World Cup?", "es-MX":"¿Cuántos países co-organizan el Mundial 2026?", "fr-FR":"Combien de pays co-organisent la Coupe 2026?", "de-DE":"Wie viele Länder richten die WM 2026 gemeinsam aus?", "ja-JP":"2026年ワールドカップは何カ国の共催？", "ar-SA":"كم دولة تستضيف كأس العالم 2026 معاً؟" }, options:["1","2","3","4"], correct:2 },
  { id:10, category:"Recordes",    difficulty:"hard",   question:{ "pt-BR":"Qual jogador marcou mais gols em uma única Copa?", "en-US":"Which player scored the most goals in a single World Cup?", "es-MX":"¿Qué jugador marcó más goles en un solo Mundial?", "fr-FR":"Quel joueur a marqué le plus de buts dans une seule Coupe?", "de-DE":"Welcher Spieler erzielte die meisten Tore bei einer einzigen WM?", "ja-JP":"一大会で最多得点を記録した選手は？", "ar-SA":"أي لاعب سجل أكثر الأهداف في نسخة واحدة من كأس العالم؟" }, options:["Pelé","Just Fontaine","Gerd Müller","Ronaldo"], correct:1 },
  { id:11, category:"História",    difficulty:"medium", question:{ "pt-BR":"Em qual Copa o Brasil foi eliminado por 7x1?", "en-US":"In which World Cup was Brazil eliminated 7-1?", "es-MX":"¿En qué Mundial fue eliminado Brasil 7-1?", "fr-FR":"Dans quelle Coupe le Brésil a-t-il été éliminé 7-1?", "de-DE":"Bei welcher WM wurde Brasilien 7-1 eliminiert?", "ja-JP":"ブラジルが7-1で敗退したのはどのワールドカップ？", "ar-SA":"في أي كأس عالم خُسر أمام البرازيل بنتيجة 7-1؟" }, options:["2010","2014","2018","2006"], correct:1 },
  { id:12, category:"2026",        difficulty:"medium", question:{ "pt-BR":"Qual estádio mexicano já sediou duas finais de Copa?", "en-US":"Which Mexican stadium has already hosted two World Cup finals?", "es-MX":"¿Qué estadio mexicano ya fue sede de dos finales mundiales?", "fr-FR":"Quel stade mexicain a déjà accueilli deux finales mondiales?", "de-DE":"Welches mexikanische Stadion hat bereits zwei WM-Finals ausgerichtet?", "ja-JP":"過去2回のワールドカップ決勝を開催したメキシコのスタジアムは？", "ar-SA":"أي ملعب مكسيكي استضاف نهائيين لكأس العالم؟" }, options:["Estadio Akron","Estadio BBVA","Estadio Azteca","Estadio Chivas"], correct:2 },
  { id:13, category:"Recordes",    difficulty:"hard",   question:{ "pt-BR":"Qual goleiro tem mais jogos em Copas do Mundo?", "en-US":"Which goalkeeper has played the most World Cup matches?", "es-MX":"¿Qué portero tiene más partidos en Copas del Mundo?", "fr-FR":"Quel gardien a joué le plus de matchs en Coupes du Monde?", "de-DE":"Welcher Torwart hat die meisten WM-Spiele bestritten?", "ja-JP":"ワールドカップで最多試合に出場したゴールキーパーは？", "ar-SA":"أي حارس مرمى لعب أكثر المباريات في كؤوس العالم؟" }, options:["Buffon","Sepp Maier","Iker Casillas","Manuel Neuer"], correct:2 },
  { id:14, category:"Campeões",    difficulty:"easy",   question:{ "pt-BR":"Quantas vezes a Argentina ganhou a Copa do Mundo?", "en-US":"How many times has Argentina won the World Cup?", "es-MX":"¿Cuántas veces ganó Argentina la Copa del Mundo?", "fr-FR":"Combien de fois l'Argentine a-t-elle remporté la Coupe du Monde?", "de-DE":"Wie viele Male hat Argentinien die Weltmeisterschaft gewonnen?", "ja-JP":"アルゼンチンのワールドカップ優勝回数は？", "ar-SA":"كم مرة فازت الأرجنتين بكأس العالم؟" }, options:["1","2","3","4"], correct:2 },
  { id:15, category:"História",    difficulty:"hard",   question:{ "pt-BR":"Qual foi o primeiro país africano a chegar às semis de uma Copa?", "en-US":"Which was the first African country to reach the World Cup semifinals?", "es-MX":"¿Cuál fue el primer país africano en llegar a las semifinales de un Mundial?", "fr-FR":"Quel fut le premier pays africain à atteindre les demi-finales d'une Coupe?", "de-DE":"Welches war das erste afrikanische Land, das ein WM-Halbfinale erreichte?", "ja-JP":"ワールドカップ準決勝に初めて進出したアフリカの国は？", "ar-SA":"أول دولة أفريقية تصل إلى نصف نهائي كأس العالم؟" }, options:["Nigéria","Camarões","Senegal","Marrocos"], correct:3 },
  { id:16, category:"2026",        difficulty:"easy",   question:{ "pt-BR":"Quando começa a Copa do Mundo de 2026?", "en-US":"When does the 2026 World Cup begin?", "es-MX":"¿Cuándo comienza el Mundial de 2026?", "fr-FR":"Quand commence la Coupe du Monde 2026?", "de-DE":"Wann beginnt die WM 2026?", "ja-JP":"2026年ワールドカップはいつ始まる？", "ar-SA":"متى يبدأ كأس العالم 2026؟" }, options:["1 de junho","11 de junho","20 de junho","30 de junho"], correct:1 },
  { id:17, category:"Recordes",    difficulty:"medium", question:{ "pt-BR":"Qual jogador ganhou mais Copas do Mundo?", "en-US":"Which player has won the most World Cups?", "es-MX":"¿Qué jugador ganó más Copas del Mundo?", "fr-FR":"Quel joueur a remporté le plus de Coupes du Monde?", "de-DE":"Welcher Spieler hat die meisten Weltmeisterschaften gewonnen?", "ja-JP":"最多のワールドカップ優勝を経験した選手は？", "ar-SA":"أي لاعب فاز بأكبر عدد من كؤوس العالم؟" }, options:["Ronaldo","Zidane","Pelé","Messi"], correct:2 },
  { id:18, category:"História",    difficulty:"medium", question:{ "pt-BR":"Em qual país foi realizada a Copa de 2010?", "en-US":"In which country was the 2010 World Cup held?", "es-MX":"¿En qué país se realizó el Mundial de 2010?", "fr-FR":"Dans quel pays s'est tenue la Coupe du Monde 2010?", "de-DE":"In welchem Land fand die WM 2010 statt?", "ja-JP":"2010年ワールドカップはどの国で開催された？", "ar-SA":"في أي دولة أُقيم كأس العالم 2010؟" }, options:["Brasil","Marrocos","Japão","África do Sul"], correct:3 },
  { id:19, category:"Campeões",    difficulty:"hard",   question:{ "pt-BR":"Qual foi o único país a ganhar a Copa fora de seu continente?", "en-US":"Which is the only country to have won the World Cup outside their continent?", "es-MX":"¿Cuál es el único país en ganar el Mundial fuera de su continente?", "fr-FR":"Quel est le seul pays à avoir remporté la Coupe hors de son continent?", "de-DE":"Welches ist das einzige Land, das die WM außerhalb seines Kontinents gewann?", "ja-JP":"自国大陸以外でワールドカップを制した唯一の国は？", "ar-SA":"أي دولة هي الوحيدة التي فازت بكأس العالم خارج قارتها؟" }, options:["França","Alemanha","Brasil","Espanha"], correct:3 },
  { id:20, category:"2026",        difficulty:"medium", question:{ "pt-BR":"Quantos jogos terá a fase de grupos da Copa 2026?", "en-US":"How many matches will the 2026 World Cup group stage have?", "es-MX":"¿Cuántos partidos tendrá la fase de grupos del Mundial 2026?", "fr-FR":"Combien de matchs la phase de groupes de la Coupe 2026 aura-t-elle?", "de-DE":"Wie viele Spiele wird die Gruppenphase der WM 2026 haben?", "ja-JP":"2026年ワールドカップのグループステージは何試合？", "ar-SA":"كم مباراة ستُلعب في دور المجموعات لكأس العالم 2026؟" }, options:["32","48","64","72"], correct:3 },
];

const TIME_LIMIT = 20;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getResultTier(pct) {
  if (pct === 100) return "perfect";
  if (pct >= 80)  return "great";
  if (pct >= 60)  return "good";
  if (pct >= 40)  return "ok";
  return "bad";
}

// ─── TIMER BAR ───────────────────────────────────────────────────────────────

function TimerBar({ timeLeft, total, dark }) {
  const pct = (timeLeft / total) * 100;
  const color = pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className={`w-full h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`} role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={total}>
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── OPTION BUTTON ────────────────────────────────────────────────────────────

function OptionButton({ text, index, selected, correct, answered, onClick, dark }) {
  const letters = ["A","B","C","D"];
  let style = "";
  if (!answered) {
    style = dark
      ? "bg-slate-700/80 border-slate-600 text-slate-200 hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300"
      : "bg-white border-slate-200 text-slate-800 hover:border-yellow-400 hover:bg-yellow-50";
  } else if (index === correct) {
    style = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30";
  } else if (index === selected && index !== correct) {
    style = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/30";
  } else {
    style = dark ? "bg-slate-800/40 border-slate-700/30 text-slate-500" : "bg-slate-50 border-slate-200 text-slate-400";
  }

  return (
    <button
      onClick={() => !answered && onClick(index)}
      disabled={answered}
      aria-pressed={selected === index}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
        disabled:cursor-default ${style}`}
    >
      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0
        ${!answered ? dark ? "bg-slate-600 text-slate-300" : "bg-slate-100 text-slate-500"
        : index === correct ? "bg-white/20 text-white"
        : index === selected ? "bg-white/20 text-white"
        : dark ? "bg-slate-700 text-slate-600" : "bg-slate-200 text-slate-400"}`}>
        {letters[index]}
      </span>
      {text}
    </button>
  );
}

// ─── RESULTS SCREEN ───────────────────────────────────────────────────────────

function ResultsScreen({ score, total, answers, questions, onRestart, lang, dark }) {
  const [playerName, setPlayerName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSaveScore = async () => {
  if (!playerName.trim()) return;
  await saveQuizScore(playerName, score, total, lang);
  setSaved(true);
};

  const ui = UI[lang] || UI["pt-BR"];
  const pct = Math.round((score / total) * 100);
  const tier = getResultTier(pct);
  const result = ui.results[tier];
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `⚽ Quiz Copa 2026: ${score}/${total} (${pct}%) ${result.emoji}\n🌐 localhost:5173`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="text-center space-y-6 max-w-lg mx-auto">
      {/* Trophy */}
      <div className={`text-7xl mb-2 animate-bounce`} aria-hidden="true">{result.emoji}</div>
      <h3 className={`text-2xl md:text-3xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{result.title}</h3>
      <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{result.desc}</p>

      {/* Score circle */}
      <div className="flex justify-center">
        <div className={`relative w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center
          ${pct === 100 ? "border-yellow-400 shadow-xl shadow-yellow-400/30"
          : pct >= 60 ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
          : "border-red-400 shadow-lg shadow-red-400/20"}`}>
          <span className={`text-4xl font-black ${dark ? "text-white" : "text-slate-900"}`}>{score}</span>
          <span className={`text-xs font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>{ui.of} {total}</span>
          <span className={`text-xs font-black absolute -bottom-3 px-2 py-0.5 rounded-full
            ${pct === 100 ? "bg-yellow-400 text-slate-900" : pct >= 60 ? "bg-emerald-500 text-white" : "bg-red-400 text-white"}`}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Answer review */}
      <div className={`rounded-2xl border p-4 text-left space-y-2 mt-6 ${dark ? "bg-slate-800/40 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
        {questions.map((q, i) => {
          const ans = answers[i];
          const isCorrect = ans === q.correct;
          return (
            <div key={q.id} className={`flex items-start gap-3 text-xs py-2 border-b last:border-0 ${dark ? "border-slate-700" : "border-slate-200"}`}>
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px]
                ${isCorrect ? "bg-emerald-500 text-white" : "bg-red-400 text-white"}`}>
                {isCorrect ? "✓" : "✗"}
              </span>
              <div>
                <p className={`font-semibold leading-snug ${dark ? "text-slate-300" : "text-slate-700"}`}>{q.question[lang] || q.question["pt-BR"]}</p>
                {!isCorrect && (
                  <p className={`mt-0.5 ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                    {ui.correctAnswer} {q.options[q.correct]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

{/* Salvar no ranking */}
{!saved ? (
  <div className="flex gap-2 mt-4">
    <input
      type="text"
      value={playerName}
      onChange={e => setPlayerName(e.target.value)}
      placeholder="Seu nome para o ranking"
      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-purple-500
        ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900"}`}
    />
    <button
      onClick={handleSaveScore}
      disabled={!playerName.trim()}
      className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm disabled:opacity-40 transition-colors"
    >
      Salvar 🏆
    </button>
  </div>
) : (
  <p className="text-emerald-400 font-bold text-sm text-center mt-2">✅ Pontuação salva no ranking!</p>
)}

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button onClick={onRestart}
          className="px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-wide text-sm transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
          ↩ {ui.restartBtn}
        </button>
        <button onClick={handleShare}
          className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
            ${dark ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"}`}>
          {copied ? ui.copied : `${ui.shareScore} ↗`}
        </button>
      </div>

      {/* Ranking global */}
      <QuizRanking lang={lang} />

    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function CupQuiz({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];

  const [phase, setPhase] = useState("start");   // start | playing | finished
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const q = questions[current];

  // Timer
  useEffect(() => {
    if (phase !== "playing" || answered) return;
    if (timeLeft <= 0) {
      handleAnswer(-1);
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, answered, timeLeft]);

  const startQuiz = useCallback(() => {
    setQuestions(shuffle(QUESTIONS));
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(TIME_LIMIT);
    setStreak(0);
    setBestStreak(0);
    setPhase("playing");
  }, []);

  const handleAnswer = useCallback((idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === q.correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setBestStreak(b => Math.max(b, newStreak));
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, idx]);
  }, [answered, q, streak]);

  const handleNext = useCallback(() => {
    if (current + 1 >= questions.length) {
      setPhase("finished");
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(TIME_LIMIT);
    }
  }, [current, questions.length]);

  const sectionBg = dark ? "bg-slate-900/60" : "bg-slate-50";

  return (
    <section id="quiz" aria-labelledby="quiz-heading" className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-purple-400" : "text-purple-600"}`}>
          {ui.sectionLabel}
        </p>
        <h2 id="quiz-heading" className={`text-3xl md:text-5xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {ui.title}<span className="text-purple-500">{ui.highlight}</span>
        </h2>

        {/* START */}
        {phase === "start" && (
          <div className="text-center space-y-6 mt-8">
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{ui.desc}</p>
            <div className="flex flex-wrap justify-center gap-3 my-6">
              {[
                { label: "20", sub: ui.question + "s" },
                { label: TIME_LIMIT + ui.seconds, sub: ui.timeLeft },
                { label: "3", sub: ui.difficultyLabel },
              ].map(({ label, sub }) => (
                <div key={sub} className={`px-5 py-3 rounded-2xl border text-center ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                  <p className="text-2xl font-black text-purple-500">{label}</p>
                  <p className={`text-[10px] uppercase tracking-wide ${dark ? "text-slate-500" : "text-slate-400"}`}>{sub}</p>
                </div>
              ))}
            </div>
            <button onClick={startQuiz}
              className="px-12 py-4 rounded-2xl bg-purple-500 hover:bg-purple-400 text-white font-black uppercase tracking-wide text-lg transition-all shadow-lg shadow-purple-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400">
              {ui.startBtn} ⚽
            </button>
          </div>
        )}

        {/* PLAYING */}
        {phase === "playing" && q && (
          <div className="space-y-5">
            {/* Progress & stats */}
            <div className={`flex items-center justify-between text-xs font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>
              <span>{ui.question} {current + 1} {ui.of} {questions.length}</span>
              <div className="flex items-center gap-3">
                {streak > 1 && (
                  <span className="text-yellow-500 font-black">🔥 {streak} {ui.streak}</span>
                )}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase
                  ${q.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400"
                  : q.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"}`}>
                  {ui.difficulty[q.difficulty]}
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3">
              <TimerBar timeLeft={timeLeft} total={TIME_LIMIT} dark={dark} />
              <span className={`text-sm font-black w-8 text-right tabular-nums
                ${timeLeft <= 5 ? "text-red-400" : timeLeft <= 10 ? "text-yellow-400" : dark ? "text-slate-400" : "text-slate-500"}`}>
                {timeLeft}{ui.seconds}
              </span>
            </div>

            {/* Score */}
            <div className={`flex items-center justify-between px-4 py-2 rounded-xl ${dark ? "bg-slate-800/50" : "bg-slate-100"}`}>
              <span className={`text-xs font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>{ui.score}</span>
              <span className="text-sm font-black text-purple-500">{score} / {current}</span>
            </div>

            {/* Category */}
            <p className={`text-[10px] uppercase tracking-widest font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>
              {ui.categoryLabel}: {q.category}
            </p>

            {/* Question */}
            <div className={`p-5 rounded-2xl border ${dark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
              <p className={`text-base md:text-lg font-bold leading-snug ${dark ? "text-white" : "text-slate-900"}`}>
                {q.question[lang] || q.question["pt-BR"]}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-2" role="group" aria-label="Opções de resposta">
              {q.options.map((opt, i) => (
                <OptionButton
                  key={i}
                  text={opt}
                  index={i}
                  selected={selected}
                  correct={q.correct}
                  answered={answered}
                  onClick={handleAnswer}
                  dark={dark}
                />
              ))}
            </div>

            {/* Feedback + next */}
            {answered && (
              <div className="flex items-center justify-between gap-3" aria-live="polite" aria-atomic="true">
                <div className={`flex items-center gap-2 font-black text-sm
                  ${selected === q.correct ? "text-emerald-400" : "text-red-400"}`}>
                  {selected === q.correct ? ui.correct : (
                    <>
                      {ui.wrong}
                      <span className={`text-xs font-normal ml-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {ui.correctAnswer} {q.options[q.correct]}
                      </span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {current + 1 >= questions.length ? ui.finishBtn : ui.nextBtn}
                </button>
              </div>
            )}
          </div>
        )}

        {/* FINISHED */}
        {phase === "finished" && (
          <div className="mt-6">
            <ResultsScreen
              score={score}
              total={questions.length}
              answers={answers}
              questions={questions}
              onRestart={startQuiz}
              lang={lang}
              dark={dark}
            />
          </div>
        )}
      </div>
    </section>
  );
}
