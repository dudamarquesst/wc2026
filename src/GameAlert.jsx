/**
 * GameAlert.jsx
 * Alerta de Jogo — acompanhe seu time favorito na Copa 2026.
 */

import { useState, useEffect, useContext, useMemo } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── UI STRINGS ───────────────────────────────────────────────────────────────

const UI = {
  "pt-BR": {
    sectionLabel: "Acompanhe seu time",
    title: "Alerta de", highlight: " Jogo",
    desc: "Escolha sua seleção favorita e veja todos os seus jogos na fase de grupos.",
    searchPlaceholder: "Buscar seleção...",
    noTeam: "Selecione um time para ver os alertas",
    nextMatch: "Próximo Jogo",
    noNextMatch: "Nenhum jogo futuro encontrado",
    allMatches: "Todos os Jogos",
    group: "Grupo", round: "Rodada", stadium: "Estádio", city: "Cidade",
    vs: "vs", at: "às",
    daysLeft: (d) => d === 0 ? "HOJE!" : d === 1 ? "Amanhã" : `em ${d} dias`,
    countdown: "Contagem",
    notifyBtn: "🔔 Notificar-me",
    notifyGranted: "✅ Notificações ativadas!",
    notifyDenied: "❌ Permissão negada",
    notifyUnsupported: "⚠️ Não suportado",
    clearBtn: "Limpar",
    favoriteLabel: "Time Favorito",
    scheduleLabel: "Programação completa",
    matchStatus: { upcoming: "Em breve", today: "HOJE", past: "Encerrado" },
    timezone: "Horário de Brasília",
    groupStage: "Fase de Grupos",
    change: "Trocar time",
  },
  "en-US": {
    sectionLabel: "Follow your team",
    title: "Game", highlight: " Alert",
    desc: "Choose your favorite national team and track all their group stage matches.",
    searchPlaceholder: "Search team...",
    noTeam: "Select a team to see alerts",
    nextMatch: "Next Match",
    noNextMatch: "No upcoming matches found",
    allMatches: "All Matches",
    group: "Group", round: "Round", stadium: "Stadium", city: "City",
    vs: "vs", at: "at",
    daysLeft: (d) => d === 0 ? "TODAY!" : d === 1 ? "Tomorrow" : `in ${d} days`,
    countdown: "Countdown",
    notifyBtn: "🔔 Notify me",
    notifyGranted: "✅ Notifications enabled!",
    notifyDenied: "❌ Permission denied",
    notifyUnsupported: "⚠️ Not supported",
    clearBtn: "Clear",
    favoriteLabel: "Favorite Team",
    scheduleLabel: "Full schedule",
    matchStatus: { upcoming: "Upcoming", today: "TODAY", past: "Finished" },
    timezone: "Eastern Time",
    groupStage: "Group Stage",
    change: "Change team",
  },
  "es-MX": {
    sectionLabel: "Sigue a tu selección",
    title: "Alerta de", highlight: " Partido",
    desc: "Elige tu selección favorita y sigue todos sus partidos en la fase de grupos.",
    searchPlaceholder: "Buscar selección...",
    noTeam: "Selecciona un equipo para ver alertas",
    nextMatch: "Próximo Partido",
    noNextMatch: "No se encontraron partidos futuros",
    allMatches: "Todos los Partidos",
    group: "Grupo", round: "Jornada", stadium: "Estadio", city: "Ciudad",
    vs: "vs", at: "a las",
    daysLeft: (d) => d === 0 ? "¡HOY!" : d === 1 ? "Mañana" : `en ${d} días`,
    countdown: "Cuenta",
    notifyBtn: "🔔 Notificarme",
    notifyGranted: "✅ ¡Notificaciones activadas!",
    notifyDenied: "❌ Permiso denegado",
    notifyUnsupported: "⚠️ No compatible",
    clearBtn: "Limpiar",
    favoriteLabel: "Selección Favorita",
    scheduleLabel: "Programa completo",
    matchStatus: { upcoming: "Próximo", today: "HOY", past: "Finalizado" },
    timezone: "Hora Ciudad de México",
    groupStage: "Fase de Grupos",
    change: "Cambiar equipo",
  },
  "fr-FR": {
    sectionLabel: "Suivez votre équipe",
    title: "Alerte", highlight: " Match",
    desc: "Choisissez votre équipe nationale favorite et suivez tous ses matchs de groupe.",
    searchPlaceholder: "Rechercher une équipe...",
    noTeam: "Sélectionnez une équipe pour voir les alertes",
    nextMatch: "Prochain Match",
    noNextMatch: "Aucun match à venir trouvé",
    allMatches: "Tous les Matchs",
    group: "Groupe", round: "Journée", stadium: "Stade", city: "Ville",
    vs: "vs", at: "à",
    daysLeft: (d) => d === 0 ? "AUJOURD'HUI!" : d === 1 ? "Demain" : `dans ${d} jours`,
    countdown: "Compte",
    notifyBtn: "🔔 Me notifier",
    notifyGranted: "✅ Notifications activées!",
    notifyDenied: "❌ Permission refusée",
    notifyUnsupported: "⚠️ Non supporté",
    clearBtn: "Effacer",
    favoriteLabel: "Équipe Favorite",
    scheduleLabel: "Programme complet",
    matchStatus: { upcoming: "À venir", today: "AUJOURD'HUI", past: "Terminé" },
    timezone: "Heure de Paris",
    groupStage: "Phase de groupes",
    change: "Changer d'équipe",
  },
  "de-DE": {
    sectionLabel: "Verfolge dein Team",
    title: "Spiel", highlight: "-Alarm",
    desc: "Wähle deine Lieblingsmannschaft und verfolge alle Gruppenspiele.",
    searchPlaceholder: "Team suchen...",
    noTeam: "Wähle ein Team, um Alerts zu sehen",
    nextMatch: "Nächstes Spiel",
    noNextMatch: "Keine bevorstehenden Spiele gefunden",
    allMatches: "Alle Spiele",
    group: "Gruppe", round: "Spieltag", stadium: "Stadion", city: "Stadt",
    vs: "vs", at: "um",
    daysLeft: (d) => d === 0 ? "HEUTE!" : d === 1 ? "Morgen" : `in ${d} Tagen`,
    countdown: "Countdown",
    notifyBtn: "🔔 Benachrichtigen",
    notifyGranted: "✅ Benachrichtigungen aktiviert!",
    notifyDenied: "❌ Berechtigung verweigert",
    notifyUnsupported: "⚠️ Nicht unterstützt",
    clearBtn: "Löschen",
    favoriteLabel: "Lieblingsmannschaft",
    scheduleLabel: "Vollständiger Spielplan",
    matchStatus: { upcoming: "Bevorstehend", today: "HEUTE", past: "Beendet" },
    timezone: "Berliner Zeit",
    groupStage: "Gruppenphase",
    change: "Team wechseln",
  },
  "ja-JP": {
    sectionLabel: "チームを応援しよう",
    title: "試合", highlight: "アラート",
    desc: "お気に入りのチームを選んで、グループステージの全試合を追いかけよう。",
    searchPlaceholder: "チームを検索...",
    noTeam: "チームを選択してアラートを表示",
    nextMatch: "次の試合",
    noNextMatch: "今後の試合は見つかりません",
    allMatches: "全試合",
    group: "グループ", round: "第", stadium: "スタジアム", city: "都市",
    vs: "vs", at: "",
    daysLeft: (d) => d === 0 ? "今日！" : d === 1 ? "明日" : `${d}日後`,
    countdown: "カウント",
    notifyBtn: "🔔 通知する",
    notifyGranted: "✅ 通知が有効になりました！",
    notifyDenied: "❌ 許可が拒否されました",
    notifyUnsupported: "⚠️ 未対応",
    clearBtn: "クリア",
    favoriteLabel: "お気に入りチーム",
    scheduleLabel: "全試合スケジュール",
    matchStatus: { upcoming: "予定", today: "今日", past: "終了" },
    timezone: "日本時間",
    groupStage: "グループステージ",
    change: "チームを変更",
  },
  "ar-SA": {
    sectionLabel: "تابع منتخبك",
    title: "تنبيه", highlight: " المباراة",
    desc: "اختر منتخبك المفضل وتابع جميع مبارياته في دور المجموعات.",
    searchPlaceholder: "ابحث عن منتخب...",
    noTeam: "اختر فريقاً لرؤية التنبيهات",
    nextMatch: "المباراة القادمة",
    noNextMatch: "لا توجد مباريات قادمة",
    allMatches: "جميع المباريات",
    group: "المجموعة", round: "الجولة", stadium: "الملعب", city: "المدينة",
    vs: "ضد", at: "في",
    daysLeft: (d) => d === 0 ? "اليوم!" : d === 1 ? "غداً" : `بعد ${d} أيام`,
    countdown: "العد",
    notifyBtn: "🔔 أشعرني",
    notifyGranted: "✅ تم تفعيل الإشعارات!",
    notifyDenied: "❌ تم رفض الإذن",
    notifyUnsupported: "⚠️ غير مدعوم",
    clearBtn: "مسح",
    favoriteLabel: "المنتخب المفضل",
    scheduleLabel: "الجدول الكامل",
    matchStatus: { upcoming: "قادمة", today: "اليوم", past: "انتهت" },
    timezone: "توقيت الرياض",
    groupStage: "دور المجموعات",
    change: "تغيير الفريق",
  },
};

// ─── TEAM & MATCH DATA ────────────────────────────────────────────────────────

const FLAGS = {
  "Qatar":"🇶🇦","Ecuador":"🇪🇨","Senegal":"🇸🇳","Netherlands":"🇳🇱","England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Iran":"🇮🇷","USA":"🇺🇸","Wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Argentina":"🇦🇷","Saudi Arabia":"🇸🇦","Mexico":"🇲🇽","Poland":"🇵🇱","France":"🇫🇷","Australia":"🇦🇺","Denmark":"🇩🇰","Tunisia":"🇹🇳","Spain":"🇪🇸","Costa Rica":"🇨🇷","Germany":"🇩🇪","Japan":"🇯🇵","Belgium":"🇧🇪","Canada":"🇨🇦","Morocco":"🇲🇦","Croatia":"🇭🇷","Brazil":"🇧🇷","Serbia":"🇷🇸","Switzerland":"🇨🇭","Cameroon":"🇨🇲","Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","South Korea":"🇰🇷","Italy":"🇮🇹","Colombia":"🇨🇴","Egypt":"🇪🇬","Ivory Coast":"🇨🇮","Nigeria":"🇳🇬","South Africa":"🇿🇦","Chile":"🇨🇱","New Zealand":"🇳🇿","Algeria":"🇩🇿","Indonesia":"🇮🇩","Peru":"🇵🇪",
};

const TEAM_GROUPS = {
  "Qatar":"A","Ecuador":"A","Senegal":"A","Netherlands":"A","England":"B","Iran":"B","USA":"B","Wales":"B","Argentina":"C","Saudi Arabia":"C","Mexico":"C","Poland":"C","France":"D","Australia":"D","Denmark":"D","Tunisia":"D","Spain":"E","Costa Rica":"E","Germany":"E","Japan":"E","Belgium":"F","Canada":"F","Morocco":"F","Croatia":"F","Brazil":"G","Serbia":"G","Switzerland":"G","Cameroon":"G","Portugal":"H","Ghana":"H","Uruguay":"H","South Korea":"H","Italy":"I","Colombia":"I","Egypt":"I","Ivory Coast":"I","Nigeria":"J","South Africa":"J","Chile":"J","New Zealand":"J","Netherlands":"K","Senegal":"K","Ecuador":"K","Qatar":"K","Iran":"L","Algeria":"L","Indonesia":"L","Peru":"L",
};

const ALL_TEAMS = Object.keys(FLAGS).sort();

const STADIUMS = {
  MetLife:{name:"MetLife Stadium",city:"New York/NJ"},ATT:{name:"AT&T Stadium",city:"Dallas"},SoFi:{name:"SoFi Stadium",city:"Los Angeles"},Rose:{name:"Rose Bowl",city:"Pasadena"},Levis:{name:"Levi's Stadium",city:"San Francisco"},Hard:{name:"Hard Rock Stadium",city:"Miami"},Gillette:{name:"Gillette Stadium",city:"Boston"},Lincoln:{name:"Lincoln Financial Field",city:"Philadelphia"},Arrowhead:{name:"Arrowhead Stadium",city:"Kansas City"},Lumen:{name:"Lumen Field",city:"Seattle"},Mercedes:{name:"Mercedes-Benz Stadium",city:"Atlanta"},BC:{name:"BC Place",city:"Vancouver"},BMO:{name:"BMO Field",city:"Toronto"},Azteca:{name:"Estadio Azteca",city:"Mexico City"},Akron:{name:"Estadio Akron",city:"Guadalajara"},BBVA:{name:"Estadio BBVA",city:"Monterrey"},
};

const MATCHES = [
  {id:1,group:"A",round:1,date:"2026-06-11",time:"17:00",home:"Qatar",away:"Ecuador",stadium:"MetLife"},{id:2,group:"A",round:1,date:"2026-06-12",time:"14:00",home:"Senegal",away:"Netherlands",stadium:"ATT"},{id:3,group:"A",round:2,date:"2026-06-16",time:"14:00",home:"Qatar",away:"Senegal",stadium:"SoFi"},{id:4,group:"A",round:2,date:"2026-06-16",time:"17:00",home:"Netherlands",away:"Ecuador",stadium:"Rose"},{id:5,group:"A",round:3,date:"2026-06-20",time:"12:00",home:"Ecuador",away:"Senegal",stadium:"Levis"},{id:6,group:"A",round:3,date:"2026-06-20",time:"12:00",home:"Netherlands",away:"Qatar",stadium:"Hard"},
  {id:7,group:"B",round:1,date:"2026-06-12",time:"17:00",home:"England",away:"Iran",stadium:"MetLife"},{id:8,group:"B",round:1,date:"2026-06-13",time:"14:00",home:"USA",away:"Wales",stadium:"Gillette"},{id:9,group:"B",round:2,date:"2026-06-17",time:"14:00",home:"England",away:"USA",stadium:"Lincoln"},{id:10,group:"B",round:2,date:"2026-06-17",time:"17:00",home:"Iran",away:"Wales",stadium:"Arrowhead"},{id:11,group:"B",round:3,date:"2026-06-21",time:"12:00",home:"Wales",away:"England",stadium:"Lumen"},{id:12,group:"B",round:3,date:"2026-06-21",time:"12:00",home:"Iran",away:"USA",stadium:"Mercedes"},
  {id:13,group:"C",round:1,date:"2026-06-13",time:"17:00",home:"Argentina",away:"Saudi Arabia",stadium:"Azteca"},{id:14,group:"C",round:1,date:"2026-06-14",time:"14:00",home:"Mexico",away:"Poland",stadium:"Akron"},{id:15,group:"C",round:2,date:"2026-06-18",time:"14:00",home:"Argentina",away:"Mexico",stadium:"BBVA"},{id:16,group:"C",round:2,date:"2026-06-18",time:"17:00",home:"Saudi Arabia",away:"Poland",stadium:"BC"},{id:17,group:"C",round:3,date:"2026-06-22",time:"12:00",home:"Poland",away:"Argentina",stadium:"BMO"},{id:18,group:"C",round:3,date:"2026-06-22",time:"12:00",home:"Saudi Arabia",away:"Mexico",stadium:"ATT"},
  {id:19,group:"D",round:1,date:"2026-06-14",time:"17:00",home:"France",away:"Australia",stadium:"SoFi"},{id:20,group:"D",round:1,date:"2026-06-15",time:"14:00",home:"Denmark",away:"Tunisia",stadium:"Rose"},{id:21,group:"D",round:2,date:"2026-06-19",time:"14:00",home:"France",away:"Denmark",stadium:"Levis"},{id:22,group:"D",round:2,date:"2026-06-19",time:"17:00",home:"Australia",away:"Tunisia",stadium:"Hard"},{id:23,group:"D",round:3,date:"2026-06-23",time:"12:00",home:"Tunisia",away:"France",stadium:"Gillette"},{id:24,group:"D",round:3,date:"2026-06-23",time:"12:00",home:"Australia",away:"Denmark",stadium:"Lincoln"},
  {id:25,group:"E",round:1,date:"2026-06-15",time:"17:00",home:"Spain",away:"Costa Rica",stadium:"Arrowhead"},{id:26,group:"E",round:1,date:"2026-06-16",time:"14:00",home:"Germany",away:"Japan",stadium:"Lumen"},{id:27,group:"E",round:2,date:"2026-06-20",time:"14:00",home:"Spain",away:"Germany",stadium:"Mercedes"},{id:28,group:"E",round:2,date:"2026-06-20",time:"17:00",home:"Costa Rica",away:"Japan",stadium:"Azteca"},{id:29,group:"E",round:3,date:"2026-06-24",time:"12:00",home:"Japan",away:"Spain",stadium:"Akron"},{id:30,group:"E",round:3,date:"2026-06-24",time:"12:00",home:"Costa Rica",away:"Germany",stadium:"BBVA"},
  {id:31,group:"F",round:1,date:"2026-06-16",time:"17:00",home:"Belgium",away:"Canada",stadium:"BC"},{id:32,group:"F",round:1,date:"2026-06-17",time:"14:00",home:"Morocco",away:"Croatia",stadium:"BMO"},{id:33,group:"F",round:2,date:"2026-06-21",time:"14:00",home:"Belgium",away:"Morocco",stadium:"ATT"},{id:34,group:"F",round:2,date:"2026-06-21",time:"17:00",home:"Canada",away:"Croatia",stadium:"SoFi"},{id:35,group:"F",round:3,date:"2026-06-25",time:"12:00",home:"Croatia",away:"Belgium",stadium:"MetLife"},{id:36,group:"F",round:3,date:"2026-06-25",time:"12:00",home:"Canada",away:"Morocco",stadium:"Rose"},
  {id:37,group:"G",round:1,date:"2026-06-17",time:"17:00",home:"Brazil",away:"Serbia",stadium:"Levis"},{id:38,group:"G",round:1,date:"2026-06-18",time:"14:00",home:"Switzerland",away:"Cameroon",stadium:"Hard"},{id:39,group:"G",round:2,date:"2026-06-22",time:"14:00",home:"Brazil",away:"Switzerland",stadium:"Gillette"},{id:40,group:"G",round:2,date:"2026-06-22",time:"17:00",home:"Serbia",away:"Cameroon",stadium:"Lincoln"},{id:41,group:"G",round:3,date:"2026-06-26",time:"12:00",home:"Cameroon",away:"Brazil",stadium:"Arrowhead"},{id:42,group:"G",round:3,date:"2026-06-26",time:"12:00",home:"Serbia",away:"Switzerland",stadium:"Lumen"},
  {id:43,group:"H",round:1,date:"2026-06-18",time:"17:00",home:"Portugal",away:"Ghana",stadium:"Mercedes"},{id:44,group:"H",round:1,date:"2026-06-19",time:"14:00",home:"Uruguay",away:"South Korea",stadium:"Azteca"},{id:45,group:"H",round:2,date:"2026-06-23",time:"14:00",home:"Portugal",away:"Uruguay",stadium:"Akron"},{id:46,group:"H",round:2,date:"2026-06-23",time:"17:00",home:"Ghana",away:"South Korea",stadium:"BBVA"},{id:47,group:"H",round:3,date:"2026-06-27",time:"12:00",home:"South Korea",away:"Portugal",stadium:"BC"},{id:48,group:"H",round:3,date:"2026-06-27",time:"12:00",home:"Ghana",away:"Uruguay",stadium:"BMO"},
  {id:49,group:"I",round:1,date:"2026-06-19",time:"17:00",home:"Italy",away:"Colombia",stadium:"ATT"},{id:50,group:"I",round:1,date:"2026-06-20",time:"14:00",home:"Egypt",away:"Ivory Coast",stadium:"SoFi"},{id:51,group:"I",round:2,date:"2026-06-24",time:"14:00",home:"Italy",away:"Egypt",stadium:"Rose"},{id:52,group:"I",round:2,date:"2026-06-24",time:"17:00",home:"Colombia",away:"Ivory Coast",stadium:"Levis"},{id:53,group:"I",round:3,date:"2026-06-28",time:"12:00",home:"Ivory Coast",away:"Italy",stadium:"Hard"},{id:54,group:"I",round:3,date:"2026-06-28",time:"12:00",home:"Colombia",away:"Egypt",stadium:"Gillette"},
  {id:55,group:"J",round:1,date:"2026-06-20",time:"17:00",home:"Nigeria",away:"South Africa",stadium:"Lincoln"},{id:56,group:"J",round:1,date:"2026-06-21",time:"14:00",home:"Chile",away:"New Zealand",stadium:"Arrowhead"},{id:57,group:"J",round:2,date:"2026-06-25",time:"14:00",home:"Nigeria",away:"Chile",stadium:"Lumen"},{id:58,group:"J",round:2,date:"2026-06-25",time:"17:00",home:"South Africa",away:"New Zealand",stadium:"Mercedes"},{id:59,group:"J",round:3,date:"2026-06-29",time:"12:00",home:"New Zealand",away:"Nigeria",stadium:"Azteca"},{id:60,group:"J",round:3,date:"2026-06-29",time:"12:00",home:"South Africa",away:"Chile",stadium:"Akron"},
  {id:61,group:"K",round:1,date:"2026-06-21",time:"17:00",home:"Netherlands",away:"Senegal",stadium:"BBVA"},{id:62,group:"K",round:1,date:"2026-06-22",time:"14:00",home:"Ecuador",away:"Qatar",stadium:"BC"},{id:63,group:"K",round:2,date:"2026-06-26",time:"14:00",home:"Netherlands",away:"Ecuador",stadium:"BMO"},{id:64,group:"K",round:2,date:"2026-06-26",time:"17:00",home:"Senegal",away:"Qatar",stadium:"ATT"},{id:65,group:"K",round:3,date:"2026-06-30",time:"12:00",home:"Qatar",away:"Netherlands",stadium:"SoFi"},{id:66,group:"K",round:3,date:"2026-06-30",time:"12:00",home:"Senegal",away:"Ecuador",stadium:"Rose"},
  {id:67,group:"L",round:1,date:"2026-06-22",time:"17:00",home:"Iran",away:"Algeria",stadium:"Levis"},{id:68,group:"L",round:1,date:"2026-06-23",time:"14:00",home:"Indonesia",away:"Peru",stadium:"Hard"},{id:69,group:"L",round:2,date:"2026-06-27",time:"14:00",home:"Iran",away:"Indonesia",stadium:"Gillette"},{id:70,group:"L",round:2,date:"2026-06-27",time:"17:00",home:"Algeria",away:"Peru",stadium:"Lincoln"},{id:71,group:"L",round:3,date:"2026-07-01",time:"12:00",home:"Peru",away:"Iran",stadium:"Arrowhead"},{id:72,group:"L",round:3,date:"2026-07-01",time:"12:00",home:"Algeria",away:"Indonesia",stadium:"Lumen"},
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getDaysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.round((target - today) / 86400000);
}

function formatDate(dateStr, lang) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString(lang, { weekday:"long", day:"2-digit", month:"long" });
}

function getMatchStatus(dateStr) {
  const d = getDaysUntil(dateStr);
  if (d < 0) return "past";
  if (d === 0) return "today";
  return "upcoming";
}

// ─── COUNTDOWN MINI ──────────────────────────────────────────────────────────

function MiniCountdown({ dateStr, timeStr, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const [t, setT] = useState({});

  useEffect(() => {
    const target = new Date(`${dateStr}T${timeStr}:00-05:00`).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ done: true }); return; }
      setT({ d: Math.floor(diff/86400000), h: Math.floor((diff%86400000)/3600000), m: Math.floor((diff%3600000)/60000), s: Math.floor((diff%60000)/1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [dateStr, timeStr]);

  if (t.done) return <span className="text-emerald-400 font-black text-sm">🟢 AO VIVO</span>;
  if (!t.d && t.d !== 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap" aria-live="polite" aria-atomic="true">
      <span className={`text-[10px] font-bold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{ui.countdown}:</span>
      {[
        [t.d, "d"], [t.h, "h"], [t.m, "m"], [t.s, "s"]
      ].map(([val, unit]) => (
        <span key={unit} className={`text-sm font-black tabular-nums ${dark ? "text-yellow-400" : "text-yellow-600"}`}>
          {String(val).padStart(2,"0")}<span className={`text-[10px] font-normal ml-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{unit}</span>
        </span>
      ))}
    </div>
  );
}

// ─── MATCH CARD ──────────────────────────────────────────────────────────────

function AlertMatchCard({ match, favoriteTeam, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const status = getMatchStatus(match.date);
  const daysLeft = getDaysUntil(match.date);
  const stad = STADIUMS[match.stadium];
  const isFav = (t) => t === favoriteTeam;

  const statusColors = {
    today:    dark ? "border-yellow-500/60 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50",
    upcoming: dark ? "border-slate-700/50 bg-slate-800/40" : "border-slate-200 bg-white shadow-sm",
    past:     dark ? "border-slate-800/30 bg-slate-900/20 opacity-50" : "border-slate-200 bg-slate-50 opacity-60",
  };

  return (
    <article className={`rounded-2xl border p-4 transition-all ${statusColors[status]}`}>
      {/* Status badge + days */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
          ${status === "today" ? "bg-yellow-400 text-slate-900"
          : status === "past"  ? dark ? "bg-slate-700 text-slate-500" : "bg-slate-200 text-slate-400"
          : dark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
          {ui.matchStatus[status]}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {status === "upcoming" ? ui.daysLeft(daysLeft) : ""}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${dark ? "bg-slate-700 text-emerald-400" : "bg-slate-100 text-emerald-600"}`}>
            {ui.group} {match.group} · R{match.round}
          </span>
        </div>
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl ${isFav(match.home) ? dark ? "bg-yellow-400/10 border border-yellow-500/30" : "bg-yellow-50 border border-yellow-300" : ""}`}>
          <span className="text-2xl" aria-hidden="true">{FLAGS[match.home]}</span>
          <span className={`text-xs font-bold text-center leading-tight ${isFav(match.home) ? "text-yellow-500" : dark ? "text-white" : "text-slate-900"}`}>{match.home}</span>
        </div>
        <span className={`font-black text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>{ui.vs}</span>
        <div className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl ${isFav(match.away) ? dark ? "bg-yellow-400/10 border border-yellow-500/30" : "bg-yellow-50 border border-yellow-300" : ""}`}>
          <span className="text-2xl" aria-hidden="true">{FLAGS[match.away]}</span>
          <span className={`text-xs font-bold text-center leading-tight ${isFav(match.away) ? "text-yellow-500" : dark ? "text-white" : "text-slate-900"}`}>{match.away}</span>
        </div>
      </div>

      {/* Date/time */}
      <div className={`text-xs mb-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>
        📅 {formatDate(match.date, lang)} {ui.at} {match.time} · 🏟 {stad?.name}, {stad?.city}
      </div>

      {/* Countdown for upcoming */}
      {status !== "past" && <MiniCountdown dateStr={match.date} timeStr={match.time} lang={lang} />}
    </article>
  );
}

// ─── TEAM SELECTOR ────────────────────────────────────────────────────────────

function TeamSelector({ selected, onSelect, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const [search, setSearch] = useState("");

  const filtered = useMemo(() =>
    ALL_TEAMS.filter(t => t.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-800/50 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="relative mb-4">
        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-slate-500" : "text-slate-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input
          type="search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={ui.searchPlaceholder}
          aria-label={ui.searchPlaceholder}
          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-medium outline-none focus:ring-2 focus:ring-yellow-400
            ${dark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"}`}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-56 overflow-y-auto pr-1" role="listbox" aria-label={ui.searchPlaceholder}>
        {filtered.map(team => (
          <button
            key={team}
            role="option"
            aria-selected={selected === team}
            onClick={() => onSelect(team)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${selected === team
                ? "bg-yellow-400 text-slate-900 shadow-md"
                : dark ? "bg-slate-700/60 text-slate-300 hover:bg-slate-600" : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-yellow-50"
              }`}
          >
            <span aria-hidden="true">{FLAGS[team]}</span>
            <span className="truncate">{team}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function GameAlert({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];

  const [favoriteTeam, setFavoriteTeam] = useState(null);
  const [showSelector, setShowSelector] = useState(true);
  const [notifyStatus, setNotifyStatus] = useState(null); // null | "granted" | "denied" | "unsupported"

  const teamMatches = useMemo(() => {
    if (!favoriteTeam) return [];
    return MATCHES
      .filter(m => m.home === favoriteTeam || m.away === favoriteTeam)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [favoriteTeam]);

  const nextMatch = useMemo(() =>
    teamMatches.find(m => getDaysUntil(m.date) >= 0),
    [teamMatches]
  );

  const handleSelectTeam = (team) => {
    setFavoriteTeam(team);
    setShowSelector(false);
    setNotifyStatus(null);
  };

  const handleNotify = async () => {
    if (!("Notification" in window)) { setNotifyStatus("unsupported"); return; }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifyStatus("granted");
      if (nextMatch) {
        new Notification(`⚽ ${favoriteTeam} joga em breve!`, {
          body: `${nextMatch.home} vs ${nextMatch.away} · ${nextMatch.date} ${nextMatch.time}`,
          icon: "/favicon.svg",
        });
      }
    } else {
      setNotifyStatus("denied");
    }
  };

  const sectionBg = dark ? "" : "bg-white";

  return (
    <section id="alertas" aria-labelledby="alert-heading" className={`py-16 md:py-24 ${sectionBg}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-red-400" : "text-red-600"}`}>
          {ui.sectionLabel}
        </p>
        <h2 id="alert-heading" className={`text-3xl md:text-5xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}>
          {ui.title}<span className="text-red-500">{ui.highlight}</span>
        </h2>
        <p className={`text-center text-sm mb-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>{ui.desc}</p>

        {/* Selected team header */}
        {favoriteTeam && !showSelector && (
          <div className={`flex items-center justify-between mb-6 p-4 rounded-2xl border ${dark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{FLAGS[favoriteTeam]}</span>
              <div>
                <p className={`text-[10px] uppercase tracking-wider font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{ui.favoriteLabel}</p>
                <p className={`font-black text-lg ${dark ? "text-white" : "text-slate-900"}`}>{favoriteTeam}</p>
                <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{ui.group} {TEAM_GROUPS[favoriteTeam]} · {ui.groupStage}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <button
                onClick={handleNotify}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${notifyStatus === "granted" ? "bg-emerald-500 text-white"
                  : notifyStatus === "denied"  ? dark ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"
                  : dark ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-400 hover:text-slate-900"}`}
              >
                {notifyStatus === "granted" ? ui.notifyGranted
                : notifyStatus === "denied"  ? ui.notifyDenied
                : notifyStatus === "unsupported" ? ui.notifyUnsupported
                : ui.notifyBtn}
              </button>
              <button onClick={() => setShowSelector(true)}
                className={`text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${dark ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-700"}`}>
                ↩ {ui.change}
              </button>
            </div>
          </div>
        )}

        {/* Team selector */}
        {showSelector && (
          <div className="mb-8">
            <TeamSelector selected={favoriteTeam} onSelect={handleSelectTeam} lang={lang} />
          </div>
        )}

        {/* No team selected */}
        {!favoriteTeam && (
          <p className={`text-center py-12 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`} role="status">
            {ui.noTeam}
          </p>
        )}

        {/* Matches */}
        {favoriteTeam && !showSelector && (
          <div>
            {/* Next match highlight */}
            {nextMatch && (
              <div className="mb-6">
                <p className={`text-xs font-black uppercase tracking-widest mb-3 ${dark ? "text-yellow-500" : "text-yellow-600"}`}>
                  🔔 {ui.nextMatch}
                </p>
                <AlertMatchCard match={nextMatch} favoriteTeam={favoriteTeam} lang={lang} />
              </div>
            )}

            {/* All matches */}
            <p className={`text-xs font-black uppercase tracking-widest mb-3 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {ui.allMatches} · {teamMatches.length} {ui.group === "Grupo" ? "jogos" : "matches"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {teamMatches.map(m => (
                <AlertMatchCard key={m.id} match={m} favoriteTeam={favoriteTeam} lang={lang} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
