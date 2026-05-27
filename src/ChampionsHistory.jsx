/**
 * ChampionsHistory.jsx
 * Timeline dos campeões da Copa do Mundo FIFA (1930–2022)
 */

import { useState, useContext } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── DADOS DOS CAMPEÕES ───────────────────────────────────────────────────────

const CHAMPIONS = [
  { year: 1930, champion: "Uruguai 🇺🇾",    runner_up: "Argentina 🇦🇷",   score: "4–2", goals: 8,  topScorer: "Guillermo Stábile (ARG)", host: "Uruguai",      continent: "América do Sul" },
  { year: 1934, champion: "Itália 🇮🇹",      runner_up: "Tchecoslováquia", score: "2–1", goals: 7,  topScorer: "Oldřich Nejedlý (TCH)",   host: "Itália",       continent: "Europa" },
  { year: 1938, champion: "Itália 🇮🇹",      runner_up: "Hungria",         score: "4–2", goals: 8,  topScorer: "Leônidas (BRA)",          host: "França",       continent: "Europa" },
  { year: 1950, champion: "Uruguai 🇺🇾",    runner_up: "Brasil 🇧🇷",      score: "2–1", goals: 9,  topScorer: "Ademir (BRA)",            host: "Brasil",       continent: "América do Sul" },
  { year: 1954, champion: "Alemanha 🇩🇪",   runner_up: "Hungria",         score: "3–2", goals: 11, topScorer: "Sándor Kocsis (HUN)",     host: "Suíça",        continent: "Europa" },
  { year: 1958, champion: "Brasil 🇧🇷",      runner_up: "Suécia",          score: "5–2", goals: 13, topScorer: "Just Fontaine (FRA)",     host: "Suécia",       continent: "Europa" },
  { year: 1962, champion: "Brasil 🇧🇷",      runner_up: "Tchecoslováquia", score: "3–1", goals: 4,  topScorer: "Vários (4 gols)",         host: "Chile",        continent: "América do Sul" },
  { year: 1966, champion: "Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿",  runner_up: "Alemanha 🇩🇪",   score: "4–2", goals: 9,  topScorer: "Eusébio (POR)",          host: "Inglaterra",   continent: "Europa" },
  { year: 1970, champion: "Brasil 🇧🇷",      runner_up: "Itália 🇮🇹",      score: "4–1", goals: 10, topScorer: "Gerd Müller (ALE)",      host: "México",       continent: "América do Norte" },
  { year: 1974, champion: "Alemanha 🇩🇪",   runner_up: "Holanda",         score: "2–1", goals: 7,  topScorer: "Grzegorz Lato (POL)",    host: "Alemanha",     continent: "Europa" },
  { year: 1978, champion: "Argentina 🇦🇷",   runner_up: "Holanda",         score: "3–1", goals: 6,  topScorer: "Mario Kempes (ARG)",     host: "Argentina",    continent: "América do Sul" },
  { year: 1982, champion: "Itália 🇮🇹",      runner_up: "Alemanha 🇩🇪",   score: "3–1", goals: 6,  topScorer: "Paolo Rossi (ITA)",      host: "Espanha",      continent: "Europa" },
  { year: 1986, champion: "Argentina 🇦🇷",   runner_up: "Alemanha 🇩🇪",   score: "3–2", goals: 10, topScorer: "Gary Lineker (ING)",     host: "México",       continent: "América do Norte" },
  { year: 1990, champion: "Alemanha 🇩🇪",   runner_up: "Argentina 🇦🇷",   score: "1–0", goals: 4,  topScorer: "Salvatore Schillaci (ITA)", host: "Itália",    continent: "Europa" },
  { year: 1994, champion: "Brasil 🇧🇷",      runner_up: "Itália 🇮🇹",      score: "0–0 (3–2 pen.)", goals: 5, topScorer: "Oleg Salenko (RUS)", host: "EUA",  continent: "América do Norte" },
  { year: 1998, champion: "França 🇫🇷",      runner_up: "Brasil 🇧🇷",      score: "3–0", goals: 8,  topScorer: "Davor Šuker (CRO)",      host: "França",       continent: "Europa" },
  { year: 2002, champion: "Brasil 🇧🇷",      runner_up: "Alemanha 🇩🇪",   score: "2–0", goals: 8,  topScorer: "Ronaldo (BRA)",          host: "Coreia/Japão", continent: "Ásia" },
  { year: 2006, champion: "Itália 🇮🇹",      runner_up: "França 🇫🇷",      score: "1–1 (5–3 pen.)", goals: 5, topScorer: "Miroslav Klose (ALE)", host: "Alemanha", continent: "Europa" },
  { year: 2010, champion: "Espanha 🇪🇸",     runner_up: "Holanda",         score: "1–0", goals: 8,  topScorer: "Thomas Müller (ALE)",    host: "África do Sul", continent: "África" },
  { year: 2014, champion: "Alemanha 🇩🇪",   runner_up: "Argentina 🇦🇷",   score: "1–0", goals: 4,  topScorer: "James Rodríguez (COL)",  host: "Brasil",       continent: "América do Sul" },
  { year: 2018, champion: "França 🇫🇷",      runner_up: "Croácia 🇭🇷",     score: "4–2", goals: 6,  topScorer: "Harry Kane (ING)",       host: "Rússia",       continent: "Europa" },
  { year: 2022, champion: "Argentina 🇦🇷",   runner_up: "França 🇫🇷",      score: "3–3 (4–2 pen.)", goals: 8, topScorer: "Kylian Mbappé (FRA)", host: "Qatar",   continent: "Ásia" },
];

const CONTINENTS = ["Todos", "Europa", "América do Sul", "América do Norte", "África", "Ásia"];

const TITLES_COUNT = CHAMPIONS.reduce((acc, c) => {
  const country = c.champion.replace(/ 🇺🇾|🇮🇹|🇩🇪|🇧🇷|🏴󠁧󠁢󠁥󠁮󠁧󠁿|🇦🇷|🇫🇷|🇪🇸|🇭🇷/g, "").trim();
  acc[country] = (acc[country] || 0) + 1;
  return acc;
}, {});

export default function ChampionsHistory({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const [filter, setFilter] = useState("Todos");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "Todos"
    ? CHAMPIONS
    : CHAMPIONS.filter(c => c.continent === filter);

  const sectionBg = dark ? "" : "bg-white";

  return (
    <section
      id="campeoes"
      aria-labelledby="champions-heading"
      className={`py-16 md:py-24 ${sectionBg}`}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-yellow-500" : "text-yellow-600"}`}>
          História da Copa
        </p>
        <h2
          id="champions-heading"
          className={`text-3xl md:text-5xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}
        >
          Histórico de <span className="text-yellow-400">Campeões</span>
        </h2>
        <p className={`text-center text-sm mb-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          Todos os 22 campeões da Copa do Mundo FIFA (1930–2022)
        </p>

        {/* Títulos por país */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(TITLES_COUNT)
            .sort(([,a],[,b]) => b - a)
            .map(([country, count]) => (
              <div key={country} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border
                ${dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}>
                <span className="text-yellow-500 font-black">{count}x</span>
                {country}
              </div>
            ))
          }
        </div>

        {/* Filtro por continente */}
        <div role="tablist" aria-label="Filtrar por continente" className="flex flex-wrap justify-center gap-2 mb-10">
          {CONTINENTS.map(c => (
            <button
              key={c}
              role="tab"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                ${filter === c
                  ? "bg-yellow-400 text-slate-900 shadow-md"
                  : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Linha central */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 ${dark ? "bg-slate-700" : "bg-slate-200"}`} aria-hidden="true" />

          <div className="space-y-6">
            {filtered.map((c, i) => (
              <article
                key={c.year}
                className={`relative flex ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center gap-4`}
              >
                {/* Card */}
                <div className="w-[calc(50%-2rem)]">
                  <button
                    onClick={() => setExpanded(expanded === c.year ? null : c.year)}
                    aria-expanded={expanded === c.year}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                      ${dark
                        ? "bg-slate-800/60 border-slate-700/50 hover:border-yellow-500/40"
                        : "bg-white border-slate-200 shadow-sm hover:border-yellow-400 hover:shadow-md"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-black uppercase tracking-widest ${dark ? "text-yellow-500" : "text-yellow-600"}`}>
                        {c.year}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${dark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                        {c.host}
                      </span>
                    </div>
                    <p className={`font-black text-base ${dark ? "text-white" : "text-slate-900"}`}>{c.champion}</p>
                    <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      {c.score} vs {c.runner_up}
                    </p>

                    {/* Expandido */}
                    {expanded === c.year && (
                      <div className={`mt-3 pt-3 border-t space-y-1 ${dark ? "border-slate-700" : "border-slate-200"}`}>
                        <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          ⚽ Artilheiro: <strong className={dark ? "text-white" : "text-slate-800"}>{c.topScorer}</strong>
                        </p>
                        <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          🌎 Sede: <strong className={dark ? "text-white" : "text-slate-800"}>{c.host}</strong>
                        </p>
                        <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          🥇 Gols do artilheiro: <strong className={dark ? "text-white" : "text-slate-800"}>{c.goals}</strong>
                        </p>
                      </div>
                    )}
                  </button>
                </div>

                {/* Bolinha central */}
                <div className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10
                  ${dark ? "bg-yellow-400 border-slate-900" : "bg-yellow-400 border-white shadow-md"}`}
                  aria-hidden="true"
                />

                {/* Espaço do outro lado */}
                <div className="w-[calc(50%-2rem)]" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}