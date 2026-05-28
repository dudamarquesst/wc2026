/**
 * MatchCalendar.jsx
 * Calendário de jogos da fase de grupos — Copa 2026.
 **/

import { useState, useContext, useMemo } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── UI STRINGS ───────────────────────────────────────────────────────────────

const UI = {
  "pt-BR": { sectionLabel: "Programação completa", title: "Calendário de", highlight: " Jogos", allGroups: "Todos", filterLabel: "Filtrar por grupo", searchPlaceholder: "Buscar seleção...", noResults: "Nenhum jogo encontrado.", round: "Rodada", matchday: "Jogo", stadium: "Estádio", city: "Cidade", group: "Grupo", date: "Data", time: "Horário (Brasília)", home: "Casa", away: "Visitante", vs: "vs", showing: "Exibindo", of: "de", matches: "jogos" },
  "en-US": { sectionLabel: "Full schedule", title: "Match", highlight: " Calendar", allGroups: "All", filterLabel: "Filter by group", searchPlaceholder: "Search team...", noResults: "No matches found.", round: "Round", matchday: "Match", stadium: "Stadium", city: "City", group: "Group", date: "Date", time: "Time (ET)", home: "Home", away: "Away", vs: "vs", showing: "Showing", of: "of", matches: "matches" },
  "es-MX": { sectionLabel: "Programa completo", title: "Calendario de", highlight: " Partidos", allGroups: "Todos", filterLabel: "Filtrar por grupo", searchPlaceholder: "Buscar selección...", noResults: "No se encontraron partidos.", round: "Jornada", matchday: "Partido", stadium: "Estadio", city: "Ciudad", group: "Grupo", date: "Fecha", time: "Hora (CDMX)", home: "Local", away: "Visitante", vs: "vs", showing: "Mostrando", of: "de", matches: "partidos" },
  "fr-FR": { sectionLabel: "Programme complet", title: "Calendrier des", highlight: " Matchs", allGroups: "Tous", filterLabel: "Filtrer par groupe", searchPlaceholder: "Rechercher une équipe...", noResults: "Aucun match trouvé.", round: "Journée", matchday: "Match", stadium: "Stade", city: "Ville", group: "Groupe", date: "Date", time: "Heure (Paris)", home: "Domicile", away: "Extérieur", vs: "vs", showing: "Affichage", of: "sur", matches: "matchs" },
  "de-DE": { sectionLabel: "Vollständiger Spielplan", title: "Spiel", highlight: "plan", allGroups: "Alle", filterLabel: "Nach Gruppe filtern", searchPlaceholder: "Team suchen...", noResults: "Keine Spiele gefunden.", round: "Spieltag", matchday: "Spiel", stadium: "Stadion", city: "Stadt", group: "Gruppe", date: "Datum", time: "Uhrzeit (Berlin)", home: "Heimteam", away: "Auswärtsteam", vs: "vs", showing: "Zeige", of: "von", matches: "Spiele" },
  "ja-JP": { sectionLabel: "全試合スケジュール", title: "試合", highlight: "日程", allGroups: "全て", filterLabel: "グループで絞り込む", searchPlaceholder: "チームを検索...", noResults: "試合が見つかりません。", round: "第", matchday: "試合", stadium: "スタジアム", city: "都市", group: "グループ", date: "日付", time: "時間（JST）", home: "ホーム", away: "アウェー", vs: "vs", showing: "表示中", of: "/", matches: "試合" },
  "ar-SA": { sectionLabel: "الجدول الكامل", title: "جدول", highlight: " المباريات", allGroups: "الكل", filterLabel: "تصفية حسب المجموعة", searchPlaceholder: "ابحث عن منتخب...", noResults: "لم يتم العثور على مباريات.", round: "الجولة", matchday: "مباراة", stadium: "الملعب", city: "المدينة", group: "المجموعة", date: "التاريخ", time: "الوقت (الرياض)", home: "المضيف", away: "الضيف", vs: "ضد", showing: "عرض", of: "من", matches: "مباريات" },
};

// ─── MATCH DATA ───────────────────────────────────────────────────────────────
// Group stage: 48 matches (4 per group × 12 groups, 3 rounds each)
// Dates are illustrative based on FIFA 2026 schedule framework

const FLAGS = {
  "Qatar":"🇶🇦","Ecuador":"🇪🇨","Senegal":"🇸🇳","Netherlands":"🇳🇱","England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Iran":"🇮🇷","USA":"🇺🇸","Wales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿","Argentina":"🇦🇷","Saudi Arabia":"🇸🇦","Mexico":"🇲🇽","Poland":"🇵🇱","France":"🇫🇷","Australia":"🇦🇺","Denmark":"🇩🇰","Tunisia":"🇹🇳","Spain":"🇪🇸","Costa Rica":"🇨🇷","Germany":"🇩🇪","Japan":"🇯🇵","Belgium":"🇧🇪","Canada":"🇨🇦","Morocco":"🇲🇦","Croatia":"🇭🇷","Brazil":"🇧🇷","Serbia":"🇷🇸","Switzerland":"🇨🇭","Cameroon":"🇨🇲","Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","South Korea":"🇰🇷","Italy":"🇮🇹","Colombia":"🇨🇴","Egypt":"🇪🇬","Ivory Coast":"🇨🇮","Nigeria":"🇳🇬","South Africa":"🇿🇦","Chile":"🇨🇱","New Zealand":"🇳🇿","Algeria":"🇩🇿","Indonesia":"🇮🇩","Peru":"🇵🇪",
};

const STADIUMS = {
  MetLife:     { name: "MetLife Stadium",           city: "New York/NJ" },
  ATT:         { name: "AT&T Stadium",              city: "Dallas" },
  SoFi:        { name: "SoFi Stadium",              city: "Los Angeles" },
  Rose:        { name: "Rose Bowl",                 city: "Pasadena" },
  Levis:       { name: "Levi's Stadium",            city: "San Francisco" },
  Hard:        { name: "Hard Rock Stadium",         city: "Miami" },
  Gillette:    { name: "Gillette Stadium",          city: "Boston" },
  Lincoln:     { name: "Lincoln Financial Field",   city: "Philadelphia" },
  Arrowhead:   { name: "Arrowhead Stadium",         city: "Kansas City" },
  Lumen:       { name: "Lumen Field",               city: "Seattle" },
  Mercedes:    { name: "Mercedes-Benz Stadium",     city: "Atlanta" },
  BC:          { name: "BC Place",                  city: "Vancouver" },
  BMO:         { name: "BMO Field",                 city: "Toronto" },
  Azteca:      { name: "Estadio Azteca",            city: "Mexico City" },
  Akron:       { name: "Estadio Akron",             city: "Guadalajara" },
  BBVA:        { name: "Estadio BBVA",              city: "Monterrey" },
};

// Format: { id, group, round, date, time, home, away, stadium }
const MATCHES = [
  // ── GROUP A ──────────────────────────────────────────────────────────────
  { id:1,  group:"A", round:1, date:"2026-06-11", time:"17:00", home:"Qatar",       away:"Ecuador",     stadium:"MetLife"  },
  { id:2,  group:"A", round:1, date:"2026-06-12", time:"14:00", home:"Senegal",     away:"Netherlands", stadium:"ATT"      },
  { id:3,  group:"A", round:2, date:"2026-06-16", time:"14:00", home:"Qatar",       away:"Senegal",     stadium:"SoFi"     },
  { id:4,  group:"A", round:2, date:"2026-06-16", time:"17:00", home:"Netherlands", away:"Ecuador",     stadium:"Rose"     },
  { id:5,  group:"A", round:3, date:"2026-06-20", time:"12:00", home:"Ecuador",     away:"Senegal",     stadium:"Levis"    },
  { id:6,  group:"A", round:3, date:"2026-06-20", time:"12:00", home:"Netherlands", away:"Qatar",       stadium:"Hard"     },
  // ── GROUP B ──────────────────────────────────────────────────────────────
  { id:7,  group:"B", round:1, date:"2026-06-12", time:"17:00", home:"England",     away:"Iran",        stadium:"MetLife"  },
  { id:8,  group:"B", round:1, date:"2026-06-13", time:"14:00", home:"USA",         away:"Wales",       stadium:"Gillette" },
  { id:9,  group:"B", round:2, date:"2026-06-17", time:"14:00", home:"England",     away:"USA",         stadium:"Lincoln"  },
  { id:10, group:"B", round:2, date:"2026-06-17", time:"17:00", home:"Iran",        away:"Wales",       stadium:"Arrowhead"},
  { id:11, group:"B", round:3, date:"2026-06-21", time:"12:00", home:"Wales",       away:"England",     stadium:"Lumen"    },
  { id:12, group:"B", round:3, date:"2026-06-21", time:"12:00", home:"Iran",        away:"USA",         stadium:"Mercedes" },
  // ── GROUP C ──────────────────────────────────────────────────────────────
  { id:13, group:"C", round:1, date:"2026-06-13", time:"17:00", home:"Argentina",   away:"Saudi Arabia",stadium:"Azteca"   },
  { id:14, group:"C", round:1, date:"2026-06-14", time:"14:00", home:"Mexico",      away:"Poland",      stadium:"Akron"    },
  { id:15, group:"C", round:2, date:"2026-06-18", time:"14:00", home:"Argentina",   away:"Mexico",      stadium:"BBVA"     },
  { id:16, group:"C", round:2, date:"2026-06-18", time:"17:00", home:"Saudi Arabia",away:"Poland",      stadium:"BC"       },
  { id:17, group:"C", round:3, date:"2026-06-22", time:"12:00", home:"Poland",      away:"Argentina",   stadium:"BMO"      },
  { id:18, group:"C", round:3, date:"2026-06-22", time:"12:00", home:"Saudi Arabia",away:"Mexico",      stadium:"ATT"      },
  // ── GROUP D ──────────────────────────────────────────────────────────────
  { id:19, group:"D", round:1, date:"2026-06-14", time:"17:00", home:"France",      away:"Australia",   stadium:"SoFi"     },
  { id:20, group:"D", round:1, date:"2026-06-15", time:"14:00", home:"Denmark",     away:"Tunisia",     stadium:"Rose"     },
  { id:21, group:"D", round:2, date:"2026-06-19", time:"14:00", home:"France",      away:"Denmark",     stadium:"Levis"    },
  { id:22, group:"D", round:2, date:"2026-06-19", time:"17:00", home:"Australia",   away:"Tunisia",     stadium:"Hard"     },
  { id:23, group:"D", round:3, date:"2026-06-23", time:"12:00", home:"Tunisia",     away:"France",      stadium:"Gillette" },
  { id:24, group:"D", round:3, date:"2026-06-23", time:"12:00", home:"Australia",   away:"Denmark",     stadium:"Lincoln"  },
  // ── GROUP E ──────────────────────────────────────────────────────────────
  { id:25, group:"E", round:1, date:"2026-06-15", time:"17:00", home:"Spain",       away:"Costa Rica",  stadium:"Arrowhead"},
  { id:26, group:"E", round:1, date:"2026-06-16", time:"14:00", home:"Germany",     away:"Japan",       stadium:"Lumen"    },
  { id:27, group:"E", round:2, date:"2026-06-20", time:"14:00", home:"Spain",       away:"Germany",     stadium:"Mercedes" },
  { id:28, group:"E", round:2, date:"2026-06-20", time:"17:00", home:"Costa Rica",  away:"Japan",       stadium:"Azteca"   },
  { id:29, group:"E", round:3, date:"2026-06-24", time:"12:00", home:"Japan",       away:"Spain",       stadium:"Akron"    },
  { id:30, group:"E", round:3, date:"2026-06-24", time:"12:00", home:"Costa Rica",  away:"Germany",     stadium:"BBVA"     },
  // ── GROUP F ──────────────────────────────────────────────────────────────
  { id:31, group:"F", round:1, date:"2026-06-16", time:"17:00", home:"Belgium",     away:"Canada",      stadium:"BC"       },
  { id:32, group:"F", round:1, date:"2026-06-17", time:"14:00", home:"Morocco",     away:"Croatia",     stadium:"BMO"      },
  { id:33, group:"F", round:2, date:"2026-06-21", time:"14:00", home:"Belgium",     away:"Morocco",     stadium:"ATT"      },
  { id:34, group:"F", round:2, date:"2026-06-21", time:"17:00", home:"Canada",      away:"Croatia",     stadium:"SoFi"     },
  { id:35, group:"F", round:3, date:"2026-06-25", time:"12:00", home:"Croatia",     away:"Belgium",     stadium:"MetLife"  },
  { id:36, group:"F", round:3, date:"2026-06-25", time:"12:00", home:"Canada",      away:"Morocco",     stadium:"Rose"     },
  // ── GROUP G ──────────────────────────────────────────────────────────────
  { id:37, group:"G", round:1, date:"2026-06-17", time:"17:00", home:"Brazil",      away:"Serbia",      stadium:"Levis"    },
  { id:38, group:"G", round:1, date:"2026-06-18", time:"14:00", home:"Switzerland", away:"Cameroon",    stadium:"Hard"     },
  { id:39, group:"G", round:2, date:"2026-06-22", time:"14:00", home:"Brazil",      away:"Switzerland", stadium:"Gillette" },
  { id:40, group:"G", round:2, date:"2026-06-22", time:"17:00", home:"Serbia",      away:"Cameroon",    stadium:"Lincoln"  },
  { id:41, group:"G", round:3, date:"2026-06-26", time:"12:00", home:"Cameroon",    away:"Brazil",      stadium:"Arrowhead"},
  { id:42, group:"G", round:3, date:"2026-06-26", time:"12:00", home:"Serbia",      away:"Switzerland", stadium:"Lumen"    },
  // ── GROUP H ──────────────────────────────────────────────────────────────
  { id:43, group:"H", round:1, date:"2026-06-18", time:"17:00", home:"Portugal",    away:"Ghana",       stadium:"Mercedes" },
  { id:44, group:"H", round:1, date:"2026-06-19", time:"14:00", home:"Uruguay",     away:"South Korea", stadium:"Azteca"   },
  { id:45, group:"H", round:2, date:"2026-06-23", time:"14:00", home:"Portugal",    away:"Uruguay",     stadium:"Akron"    },
  { id:46, group:"H", round:2, date:"2026-06-23", time:"17:00", home:"Ghana",       away:"South Korea", stadium:"BBVA"     },
  { id:47, group:"H", round:3, date:"2026-06-27", time:"12:00", home:"South Korea", away:"Portugal",    stadium:"BC"       },
  { id:48, group:"H", round:3, date:"2026-06-27", time:"12:00", home:"Ghana",       away:"Uruguay",     stadium:"BMO"      },
  // ── GROUP I ──────────────────────────────────────────────────────────────
  { id:49, group:"I", round:1, date:"2026-06-19", time:"17:00", home:"Italy",       away:"Colombia",    stadium:"ATT"      },
  { id:50, group:"I", round:1, date:"2026-06-20", time:"14:00", home:"Egypt",       away:"Ivory Coast", stadium:"SoFi"     },
  { id:51, group:"I", round:2, date:"2026-06-24", time:"14:00", home:"Italy",       away:"Egypt",       stadium:"Rose"     },
  { id:52, group:"I", round:2, date:"2026-06-24", time:"17:00", home:"Colombia",    away:"Ivory Coast", stadium:"Levis"    },
  { id:53, group:"I", round:3, date:"2026-06-28", time:"12:00", home:"Ivory Coast", away:"Italy",       stadium:"Hard"     },
  { id:54, group:"I", round:3, date:"2026-06-28", time:"12:00", home:"Colombia",    away:"Egypt",       stadium:"Gillette" },
  // ── GROUP J ──────────────────────────────────────────────────────────────
  { id:55, group:"J", round:1, date:"2026-06-20", time:"17:00", home:"Nigeria",     away:"South Africa",stadium:"Lincoln"  },
  { id:56, group:"J", round:1, date:"2026-06-21", time:"14:00", home:"Chile",       away:"New Zealand", stadium:"Arrowhead"},
  { id:57, group:"J", round:2, date:"2026-06-25", time:"14:00", home:"Nigeria",     away:"Chile",       stadium:"Lumen"    },
  { id:58, group:"J", round:2, date:"2026-06-25", time:"17:00", home:"South Africa",away:"New Zealand", stadium:"Mercedes" },
  { id:59, group:"J", round:3, date:"2026-06-29", time:"12:00", home:"New Zealand", away:"Nigeria",     stadium:"Azteca"   },
  { id:60, group:"J", round:3, date:"2026-06-29", time:"12:00", home:"South Africa",away:"Chile",       stadium:"Akron"    },
  // ── GROUP K ──────────────────────────────────────────────────────────────
  { id:61, group:"K", round:1, date:"2026-06-21", time:"17:00", home:"Netherlands", away:"Senegal",     stadium:"BBVA"     },
  { id:62, group:"K", round:1, date:"2026-06-22", time:"14:00", home:"Ecuador",     away:"Qatar",       stadium:"BC"       },
  { id:63, group:"K", round:2, date:"2026-06-26", time:"14:00", home:"Netherlands", away:"Ecuador",     stadium:"BMO"      },
  { id:64, group:"K", round:2, date:"2026-06-26", time:"17:00", home:"Senegal",     away:"Qatar",       stadium:"ATT"      },
  { id:65, group:"K", round:3, date:"2026-06-30", time:"12:00", home:"Qatar",       away:"Netherlands", stadium:"SoFi"     },
  { id:66, group:"K", round:3, date:"2026-06-30", time:"12:00", home:"Senegal",     away:"Ecuador",     stadium:"Rose"     },
  // ── GROUP L ──────────────────────────────────────────────────────────────
  { id:67, group:"L", round:1, date:"2026-06-22", time:"17:00", home:"Iran",        away:"Algeria",     stadium:"Levis"    },
  { id:68, group:"L", round:1, date:"2026-06-23", time:"14:00", home:"Indonesia",   away:"Peru",        stadium:"Hard"     },
  { id:69, group:"L", round:2, date:"2026-06-27", time:"14:00", home:"Iran",        away:"Indonesia",   stadium:"Gillette" },
  { id:70, group:"L", round:2, date:"2026-06-27", time:"17:00", home:"Algeria",     away:"Peru",        stadium:"Lincoln"  },
  { id:71, group:"L", round:3, date:"2026-07-01", time:"12:00", home:"Peru",        away:"Iran",        stadium:"Arrowhead"},
  { id:72, group:"L", round:3, date:"2026-07-01", time:"12:00", home:"Algeria",     away:"Indonesia",   stadium:"Lumen"    },
];

const GROUP_KEYS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatDate(dateStr, lang) {
  const d = new Date(dateStr + "T12:00:00");
  const locales = { "pt-BR":"pt-BR","en-US":"en-US","es-MX":"es-MX","fr-FR":"fr-FR","de-DE":"de-DE","ja-JP":"ja-JP","ar-SA":"ar-SA" };
  return d.toLocaleDateString(locales[lang] || "pt-BR", { weekday:"short", day:"2-digit", month:"short" });
}

function groupByDate(matches) {
  const map = {};
  matches.forEach(m => {
    if (!map[m.date]) map[m.date] = [];
    map[m.date].push(m);
  });
  return Object.entries(map).sort(([a],[b]) => a.localeCompare(b));
}

// ─── MATCH ROW ────────────────────────────────────────────────────────────────

function MatchRow({ match, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const stad = STADIUMS[match.stadium];
  const isToday = match.date === new Date().toISOString().slice(0,10);
  const isPast  = match.date < new Date().toISOString().slice(0,10);

  return (
    <article
      className={`flex flex-col sm:flex-row items-center gap-3 px-4 py-3 rounded-2xl border transition-colors
        ${isToday
          ? dark ? "border-yellow-500/50 bg-yellow-500/10" : "border-yellow-400 bg-yellow-50"
          : isPast
            ? dark ? "border-slate-700/30 bg-slate-800/20 opacity-60" : "border-slate-200 bg-slate-50/60 opacity-70"
            : dark ? "border-slate-700/50 bg-slate-800/40 hover:border-emerald-500/30" : "border-slate-200 bg-white hover:border-emerald-400 shadow-sm"
        }`}
      aria-label={`${match.home} vs ${match.away}, ${formatDate(match.date, lang)}, ${ui.round} ${match.round}`}
    >
      {/* Time */}
      <div className="flex-shrink-0 text-center w-16">
        <p className={`text-xs font-black ${isToday ? "text-yellow-500" : dark ? "text-slate-400" : "text-slate-500"}`}>{match.time}</p>
        <p className={`text-[10px] uppercase tracking-wide ${dark ? "text-slate-600" : "text-slate-400"}`}>{ui.round} {match.round}</p>
      </div>

      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 justify-end sm:justify-end">
        <span className={`text-sm font-bold text-right ${dark ? "text-white" : "text-slate-900"}`}>{match.home}</span>
        <span className="text-xl leading-none" aria-hidden="true">{FLAGS[match.home] || "🏳️"}</span>
      </div>

      {/* VS */}
      <div className={`flex-shrink-0 w-8 text-center text-xs font-black ${dark ? "text-slate-500" : "text-slate-400"}`}>
        {ui.vs}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-1 justify-start">
        <span className="text-xl leading-none" aria-hidden="true">{FLAGS[match.away] || "🏳️"}</span>
        <span className={`text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>{match.away}</span>
      </div>

      {/* Stadium */}
      <div className="flex-shrink-0 text-right hidden md:block">
        <p className={`text-xs font-semibold ${dark ? "text-slate-400" : "text-slate-600"}`}>{stad?.name}</p>
        <p className={`text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>{stad?.city}</p>
      </div>

      {/* Group badge */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black
        ${dark ? "bg-slate-700 text-emerald-400" : "bg-slate-100 text-emerald-600"}`}>
        {match.group}
      </div>
    </article>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function MatchCalendar({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];

  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [roundFilter, setRoundFilter] = useState("all");

  const filtered = useMemo(() => {
    return MATCHES.filter(m => {
      const matchGroup  = groupFilter === "all" || m.group === groupFilter;
      const matchRound  = roundFilter === "all" || m.round === Number(roundFilter);
      const matchSearch = !search.trim() ||
        m.home.toLowerCase().includes(search.toLowerCase()) ||
        m.away.toLowerCase().includes(search.toLowerCase());
      return matchGroup && matchRound && matchSearch;
    });
  }, [groupFilter, search, roundFilter]);

  const byDate = groupByDate(filtered);
  const sectionBg = dark ? "bg-slate-900/60" : "bg-slate-50";

  return (
    <section
      id="calendario"
      aria-labelledby="calendar-heading"
      className={`py-16 md:py-24 ${sectionBg}`}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-blue-400" : "text-blue-600"}`}>
          {ui.sectionLabel}
        </p>
        <h2
          id="calendar-heading"
          className={`text-3xl md:text-5xl font-black uppercase mb-10 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}
        >
          {ui.title}<span className="text-blue-500">{ui.highlight}</span>
        </h2>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-slate-500" : "text-slate-400"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={ui.searchPlaceholder}
              aria-label={ui.searchPlaceholder}
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-all outline-none focus:ring-2 focus:ring-blue-500
                ${dark ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"}`}
            />
          </div>

          {/* Group filter */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            aria-label={ui.filterLabel}
            className={`px-4 py-2.5 rounded-xl border text-sm font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500
              ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
          >
            <option value="all">{ui.allGroups}</option>
            {GROUP_KEYS.map(g => (
              <option key={g} value={g}>{ui.group} {g}</option>
            ))}
          </select>

          {/* Round filter */}
          <select
            value={roundFilter}
            onChange={e => setRoundFilter(e.target.value)}
            aria-label={ui.round}
            className={`px-4 py-2.5 rounded-xl border text-sm font-bold cursor-pointer outline-none focus:ring-2 focus:ring-blue-500
              ${dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"}`}
          >
            <option value="all">{ui.allGroups}</option>
            <option value="1">{ui.round} 1</option>
            <option value="2">{ui.round} 2</option>
            <option value="3">{ui.round} 3</option>
          </select>
        </div>

        {/* Count */}
        <p className={`text-sm mb-6 ${dark ? "text-slate-500" : "text-slate-400"}`} aria-live="polite" aria-atomic="true">
          {ui.showing} <strong className={dark ? "text-white" : "text-slate-900"}>{filtered.length}</strong> {ui.of} {MATCHES.length} {ui.matches}
        </p>

        {/* Match list by date */}
        {byDate.length === 0 ? (
          <p className={`text-center py-16 ${dark ? "text-slate-500" : "text-slate-400"}`} role="status">
            {ui.noResults}
          </p>
        ) : (
          <div className="space-y-8">
            {byDate.map(([date, dayMatches]) => (
              <div key={date}>
                {/* Date header */}
                <div className={`flex items-center gap-3 mb-3`}>
                  <div className={`h-px flex-1 ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
                  <h3 className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full
                    ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                    {formatDate(date, lang)}
                  </h3>
                  <div className={`h-px flex-1 ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
                </div>

                {/* Matches */}
                <div className="flex flex-col gap-2">
                  {dayMatches.map(m => (
                    <MatchRow key={m.id} match={m} lang={lang} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
