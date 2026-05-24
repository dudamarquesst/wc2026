/**
 * BracketSimulator.jsx
 * Simulador interativo do chaveamento da Copa 2026.
 **/

import { useState, useContext, createContext } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── DADOS ────────────────────────────────────────────────────────────────────

const GROUPS = {
  A: ["Qatar 🇶🇦",      "Ecuador 🇪🇨",     "Senegal 🇸🇳",      "Netherlands 🇳🇱"],
  B: ["England 🏴󠁧󠁢󠁥󠁮󠁧󠁿",    "Iran 🇮🇷",         "USA 🇺🇸",           "Wales 🏴󠁧󠁢󠁷󠁬󠁳󠁿"],
  C: ["Argentina 🇦🇷",   "Saudi Arabia 🇸🇦", "Mexico 🇲🇽",        "Poland 🇵🇱"],
  D: ["France 🇫🇷",      "Australia 🇦🇺",    "Denmark 🇩🇰",       "Tunisia 🇹🇳"],
  E: ["Spain 🇪🇸",       "Costa Rica 🇨🇷",   "Germany 🇩🇪",       "Japan 🇯🇵"],
  F: ["Belgium 🇧🇪",     "Canada 🇨🇦",       "Morocco 🇲🇦",       "Croatia 🇭🇷"],
  G: ["Brazil 🇧🇷",      "Serbia 🇷🇸",       "Switzerland 🇨🇭",   "Cameroon 🇨🇲"],
  H: ["Portugal 🇵🇹",    "Ghana 🇬🇭",        "Uruguay 🇺🇾",       "South Korea 🇰🇷"],
  I: ["Italy 🇮🇹",       "Colombia 🇨🇴",     "Egypt 🇪🇬",         "Ivory Coast 🇨🇮"],
  J: ["Nigeria 🇳🇬",     "South Africa 🇿🇦", "Chile 🇨🇱",         "New Zealand 🇳🇿"],
  K: ["Netherlands 🇳🇱", "Senegal 🇸🇳",      "Ecuador 🇪🇨",       "Qatar 🇶🇦"],
  L: ["Iran 🇮🇷",        "Algeria 🇩🇿",      "Indonesia 🇮🇩",     "Peru 🇵🇪"],
};

// Copa 2026: top-2 de cada grupo + 8 melhores terceiros = 32 times
// Simplificamos: 1º e 2º de cada grupo (24) + 8 wildcards dos 12 grupos
// Para o simulador, usamos os 32 classificados em 16 confrontos de oitavas

const GROUP_KEYS = Object.keys(GROUPS); // A-L

// Estrutura do chaveamento: 16 oitavas → 8 quartas → 4 semis → 2 final → campeão
const ROUND_LABELS = {
  "pt-BR": { r16: "Oitavas de Final", qf: "Quartas de Final", sf: "Semifinais", f: "Final", champion: "🏆 Campeão" },
  "en-US": { r16: "Round of 16",      qf: "Quarterfinals",    sf: "Semifinals", f: "Final", champion: "🏆 Champion" },
  "es-MX": { r16: "Octavos de Final", qf: "Cuartos de Final", sf: "Semifinales",f: "Final", champion: "🏆 Campeón" },
  "fr-FR": { r16: "Huitièmes",        qf: "Quarts de Finale", sf: "Demi-finales",f:"Finale", champion: "🏆 Champion" },
  "de-DE": { r16: "Achtelfinale",     qf: "Viertelfinale",    sf: "Halbfinale", f: "Finale", champion: "🏆 Sieger" },
  "ja-JP": { r16: "ラウンド16",        qf: "準々決勝",          sf: "準決勝",      f: "決勝",   champion: "🏆 優勝" },
  "ar-SA": { r16: "دور الـ16",        qf: "ربع النهائي",      sf: "نصف النهائي", f: "النهائي",champion: "🏆 البطل" },
};

const UI_LABELS = {
  "pt-BR": { title: "Simulador de", highlight: " Fases", sectionLabel: "Monte seu chaveamento", resetBtn: "Reiniciar", pickWinner: "Escolha o vencedor", groupPhase: "Fase de Grupos", knockoutPhase: "Fase Eliminatória", pickBoth: "Escolha 1º e 2º do grupo", instruction: "Clique num time para avançá-lo" },
  "en-US": { title: "Bracket", highlight: " Simulator", sectionLabel: "Build your bracket", resetBtn: "Reset", pickWinner: "Pick the winner", groupPhase: "Group Stage", knockoutPhase: "Knockout Stage", pickBoth: "Pick 1st and 2nd in group", instruction: "Click a team to advance them" },
  "es-MX": { title: "Simulador de", highlight: " Fases", sectionLabel: "Arma tu cuadro", resetBtn: "Reiniciar", pickWinner: "Elige al ganador", groupPhase: "Fase de Grupos", knockoutPhase: "Fase Eliminatoria", pickBoth: "Elige 1° y 2° del grupo", instruction: "Haz clic en un equipo para avanzarlo" },
  "fr-FR": { title: "Simulateur de", highlight: " Phases", sectionLabel: "Construisez votre tableau", resetBtn: "Réinitialiser", pickWinner: "Choisissez le vainqueur", groupPhase: "Phase de groupes", knockoutPhase: "Phase éliminatoire", pickBoth: "Choisissez 1er et 2e du groupe", instruction: "Cliquez sur une équipe pour l'avancer" },
  "de-DE": { title: "Phasen", highlight: "-Simulator", sectionLabel: "Erstelle deinen Spielplan", resetBtn: "Zurücksetzen", pickWinner: "Gewinner wählen", groupPhase: "Gruppenphase", knockoutPhase: "K.O.-Phase", pickBoth: "Wähle 1. und 2. der Gruppe", instruction: "Klicke auf ein Team, um es weiterzubringen" },
  "ja-JP": { title: "トーナメント", highlight: "シミュレーター", sectionLabel: "トーナメント表を作ろう", resetBtn: "リセット", pickWinner: "勝者を選んでください", groupPhase: "グループステージ", knockoutPhase: "決勝トーナメント", pickBoth: "グループの1位・2位を選択", instruction: "チームをクリックして勝ち進めよう" },
  "ar-SA": { title: "محاكاة", highlight: " المراحل", sectionLabel: "أنشئ جدول البطولة", resetBtn: "إعادة تعيين", pickWinner: "اختر الفائز", groupPhase: "مرحلة المجموعات", knockoutPhase: "مرحلة الإقصاء", pickBoth: "اختر الأول والثاني في المجموعة", instruction: "انقر على فريق لتأهيله" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function buildInitialBracket(groupWinners) {
  // 16 oitavas matchups (Copa 2026 format simplificado)
  // 1A vs 2B, 1C vs 2D, 1E vs 2F, 1G vs 2H, 1I vs 2J, 1K vs 2L, etc.
  const pairs = [
    [groupWinners["A"]?.[0], groupWinners["B"]?.[1]],
    [groupWinners["C"]?.[0], groupWinners["D"]?.[1]],
    [groupWinners["E"]?.[0], groupWinners["F"]?.[1]],
    [groupWinners["G"]?.[0], groupWinners["H"]?.[1]],
    [groupWinners["I"]?.[0], groupWinners["J"]?.[1]],
    [groupWinners["K"]?.[0], groupWinners["L"]?.[1]],
    [groupWinners["B"]?.[0], groupWinners["A"]?.[1]],
    [groupWinners["D"]?.[0], groupWinners["C"]?.[1]],
    [groupWinners["F"]?.[0], groupWinners["E"]?.[1]],
    [groupWinners["H"]?.[0], groupWinners["G"]?.[1]],
    [groupWinners["J"]?.[0], groupWinners["I"]?.[1]],
    [groupWinners["L"]?.[0], groupWinners["K"]?.[1]],
    // wildcards (3rd place, simplified)
    [groupWinners["A"]?.[2], groupWinners["C"]?.[2]],
    [groupWinners["B"]?.[2], groupWinners["D"]?.[2]],
    [groupWinners["E"]?.[2], groupWinners["G"]?.[2]],
    [groupWinners["F"]?.[2], groupWinners["H"]?.[2]],
  ];
  return pairs.map(([t1, t2]) => ({ t1: t1 || null, t2: t2 || null, winner: null }));
}

function buildEmptyRound(size) {
  return Array.from({ length: size }, () => ({ t1: null, t2: null, winner: null }));
}

// ─── MATCH CARD ───────────────────────────────────────────────────────────────

function MatchCard({ match, onPick, disabled, lang }) {
  const { dark } = useTheme();
  const ui = UI_LABELS[lang] || UI_LABELS["pt-BR"];

  const base = `w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400`;
  const emptySlot = `${base} ${dark ? "bg-slate-700/50 text-slate-500 cursor-default" : "bg-slate-100 text-slate-400 cursor-default"} italic`;

  const teamBtn = (team, side) => {
    const isWinner = match.winner === team;
    const isLoser  = match.winner && match.winner !== team;
    const canPick  = !disabled && team && !match.winner;
    return (
      <button
        key={side}
        onClick={() => canPick && onPick(team)}
        disabled={disabled || !team || !!match.winner}
        aria-label={team ? `${ui.pickWinner}: ${team}` : "TBD"}
        aria-pressed={isWinner}
        className={`${base} flex items-center gap-2
          ${!team
            ? emptySlot
            : isWinner
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-[1.02]"
              : isLoser
                ? `opacity-40 ${dark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400"}`
                : canPick
                  ? `${dark ? "bg-slate-700 hover:bg-yellow-400/20 hover:text-yellow-300 text-slate-200" : "bg-white hover:bg-yellow-50 hover:text-yellow-700 text-slate-700 border border-slate-200"} cursor-pointer`
                  : `${dark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"} cursor-default`
          }`}
      >
        <span className="truncate">{team || "TBD"}</span>
        {isWinner && <span className="ml-auto text-xs" aria-hidden="true">✓</span>}
      </button>
    );
  };

  return (
    <div className={`rounded-xl overflow-hidden border ${dark ? "border-slate-700/60 bg-slate-800/40" : "border-slate-200 bg-white shadow-sm"}`}>
      <div className="flex flex-col gap-px p-1.5 gap-1">
        {teamBtn(match.t1, "t1")}
        <div className={`text-center text-[9px] font-black uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-300"}`}>VS</div>
        {teamBtn(match.t2, "t2")}
      </div>
    </div>
  );
}

// ─── GROUP PICKER ─────────────────────────────────────────────────────────────

function GroupPicker({ groupWinners, onPick, lang }) {
  const { dark } = useTheme();
  const ui = UI_LABELS[lang] || UI_LABELS["pt-BR"];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {GROUP_KEYS.map(g => {
        const teams = GROUPS[g];
        const picks = groupWinners[g] || [];
        return (
          <div key={g} className={`rounded-2xl border p-3 ${dark ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-black text-sm uppercase ${dark ? "text-white" : "text-slate-900"}`}>
                <span className="text-emerald-500">Grupo {g}</span>
              </h3>
              {picks.length > 0 && (
                <button
                  onClick={() => onPick(g, null)}
                  aria-label={`Limpar grupo ${g}`}
                  className={`text-[10px] px-2 py-0.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400
                    ${dark ? "text-slate-500 hover:text-red-400 bg-slate-700" : "text-slate-400 hover:text-red-500 bg-slate-200"}`}
                >✕</button>
              )}
            </div>
            <p className={`text-[10px] uppercase tracking-wide mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>{ui.pickBoth}</p>
            <div className="flex flex-col gap-1">
              {teams.map((team, i) => {
                const pos = picks.indexOf(team);
                const isPicked = pos >= 0;
                const rank = pos === 0 ? "1º" : pos === 1 ? "2º" : pos === 2 ? "3º" : null;
                return (
                  <button
                    key={team}
                    onClick={() => onPick(g, team)}
                    aria-pressed={isPicked}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                      ${isPicked
                        ? pos === 0
                          ? "bg-yellow-400 text-slate-900"
                          : pos === 1
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-500 text-white"
                        : dark
                          ? "bg-slate-700/60 text-slate-300 hover:bg-slate-600"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                      }`}
                  >
                    {rank && <span className="font-black text-[10px] w-4 shrink-0">{rank}</span>}
                    <span className="truncate">{team}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── BRACKET COLUMN ──────────────────────────────────────────────────────────

function BracketColumn({ matches, onPick, label, disabled }) {
  const { dark } = useTheme();
  return (
    <div className="flex flex-col min-w-[140px]">
      <p className={`text-[10px] font-black uppercase tracking-widest text-center mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      <div className="flex flex-col justify-around flex-1 gap-2">
        {matches.map((match, i) => (
          <MatchCard key={i} match={match} onPick={(w) => onPick(i, w)} disabled={disabled} />
        ))}
      </div>
    </div>
  );
}

// ─── CHAMPION DISPLAY ─────────────────────────────────────────────────────────

function ChampionDisplay({ name, label, dark }) {
  if (!name) return null;
  return (
    <div className="flex flex-col items-center justify-center min-w-[120px] px-2">
      <div className={`rounded-2xl border-2 border-yellow-400 p-4 text-center shadow-2xl shadow-yellow-400/20
        ${dark ? "bg-slate-800" : "bg-yellow-50"}`}>
        <div className="text-3xl mb-2" aria-hidden="true">🏆</div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 text-yellow-500`}>{label}</p>
        <p className={`text-xs font-black leading-tight ${dark ? "text-white" : "text-slate-900"}`}>{name}</p>
      </div>
    </div>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ groupWinners, r16, qf, sf, final, lang }) {
  const { dark } = useTheme();
  const rl = ROUND_LABELS[lang] || ROUND_LABELS["pt-BR"];

  const groupsDone = GROUP_KEYS.filter(g => (groupWinners[g]?.length || 0) >= 3).length;
  const r16Done = r16.filter(m => m.winner).length;
  const qfDone  = qf.filter(m => m.winner).length;
  const sfDone  = sf.filter(m => m.winner).length;
  const fDone   = final[0]?.winner ? 1 : 0;

  const steps = [
    { label: "Grupos", done: groupsDone, total: 12 },
    { label: rl.r16,   done: r16Done,   total: 16 },
    { label: rl.qf,    done: qfDone,    total: 8 },
    { label: rl.sf,    done: sfDone,    total: 4 },
    { label: rl.f,     done: fDone,     total: 1 },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center">
      {steps.map(({ label, done, total }) => {
        const pct = Math.round((done / total) * 100);
        return (
          <div key={label} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[80px] ${dark ? "bg-slate-800/60" : "bg-slate-100"}`}>
            <span className={`text-[10px] uppercase tracking-wide font-bold ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
            <div className={`w-full h-1.5 rounded-full ${dark ? "bg-slate-700" : "bg-slate-300"}`}>
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-[10px] font-black ${pct === 100 ? "text-emerald-400" : dark ? "text-slate-500" : "text-slate-400"}`}>{done}/{total}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function BracketSimulator({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const ui  = UI_LABELS[lang]  || UI_LABELS["pt-BR"];
  const rl  = ROUND_LABELS[lang] || ROUND_LABELS["pt-BR"];

  // State: group picks (1st, 2nd, 3rd per group)
  const [groupWinners, setGroupWinners] = useState({});

  // Knockout rounds
  const [r16,   setR16]   = useState(buildEmptyRound(16));
  const [qf,    setQf]    = useState(buildEmptyRound(8));
  const [sf,    setSf]    = useState(buildEmptyRound(4));
  const [final, setFinal] = useState(buildEmptyRound(1));

  const [phase, setPhase] = useState("groups"); // "groups" | "knockout"

  // ── Group picking ──────────────────────────────────────────────────────────
  const handleGroupPick = (group, team) => {
    setGroupWinners(prev => {
      if (!team) return { ...prev, [group]: [] };
      const picks = prev[group] || [];
      if (picks.includes(team)) {
        // deselect: remove from picks
        return { ...prev, [group]: picks.filter(t => t !== team) };
      }
      if (picks.length >= 3) return prev; // max 3 (1st, 2nd, 3rd)
      return { ...prev, [group]: [...picks, team] };
    });
  };

  // ── Start knockout ─────────────────────────────────────────────────────────
  const startKnockout = () => {
    const bracket = buildInitialBracket(groupWinners);
    setR16(bracket);
    setQf(buildEmptyRound(8));
    setSf(buildEmptyRound(4));
    setFinal(buildEmptyRound(1));
    setPhase("knockout");
  };

  // ── Pick winner in a round ─────────────────────────────────────────────────
  const pickWinner = (round, setRound, nextRound, setNext) => (matchIdx, winner) => {
    setRound(prev => prev.map((m, i) => i === matchIdx ? { ...m, winner } : m));
    // feed winner into next round
    setNext(prev => {
      const next = [...prev];
      const slot = Math.floor(matchIdx / 2);
      const side = matchIdx % 2 === 0 ? "t1" : "t2";
      next[slot] = { ...next[slot], [side]: winner, winner: null };
      return next;
    });
  };

  const pickFinalWinner = (matchIdx, winner) => {
    setFinal(prev => prev.map((m, i) => i === matchIdx ? { ...m, winner } : m));
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = () => {
    setGroupWinners({});
    setR16(buildEmptyRound(16));
    setQf(buildEmptyRound(8));
    setSf(buildEmptyRound(4));
    setFinal(buildEmptyRound(1));
    setPhase("groups");
  };

  const allGroupsDone = GROUP_KEYS.every(g => (groupWinners[g]?.length || 0) >= 3);
  const champion = final[0]?.winner;

  const sectionBg = dark ? "" : "bg-slate-50";

  return (
    <section
      id="simulador"
      aria-labelledby="simulator-heading"
      className={`py-16 md:py-24 ${sectionBg}`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-yellow-500" : "text-yellow-600"}`}>
          {ui.sectionLabel}
        </p>
        <h2
          id="simulator-heading"
          className={`text-3xl md:text-5xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}
        >
          {ui.title}<span className="text-yellow-400">{ui.highlight}</span>
        </h2>

        {/* Phase tabs */}
        <div role="tablist" className="flex justify-center gap-2 mb-8">
          {[["groups", ui.groupPhase], ["knockout", ui.knockoutPhase]].map(([p, lbl]) => (
            <button
              key={p}
              role="tab"
              aria-selected={phase === p}
              onClick={() => p === "groups" ? setPhase("groups") : allGroupsDone && startKnockout()}
              disabled={p === "knockout" && !allGroupsDone && phase !== "knockout"}
              className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                disabled:opacity-40 disabled:cursor-not-allowed
                ${phase === p
                  ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/30"
                  : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {lbl}
            </button>
          ))}

          <button
            onClick={reset}
            aria-label={ui.resetBtn}
            className={`px-4 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${dark ? "bg-slate-800 text-red-400 hover:bg-red-500/20" : "bg-white text-red-500 border border-red-200 hover:bg-red-50"}`}
          >
            ↺ {ui.resetBtn}
          </button>
        </div>

        {/* Progress */}
        <ProgressBar groupWinners={groupWinners} r16={r16} qf={qf} sf={sf} final={final} lang={lang} />

        {/* Phase: Groups */}
        {phase === "groups" && (
          <div>
            <p className={`text-center text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {ui.instruction} · {ui.pickBoth}
            </p>
            <GroupPicker groupWinners={groupWinners} onPick={handleGroupPick} lang={lang} />

            {allGroupsDone && (
              <div className="mt-8 text-center">
                <button
                  onClick={startKnockout}
                  className="px-10 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-wide text-sm transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {ui.knockoutPhase} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Phase: Knockout */}
        {phase === "knockout" && (
          <div>
            <p className={`text-center text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {ui.instruction}
            </p>

            {/* Champion */}
            {champion && (
              <div className="flex justify-center mb-8" aria-live="polite" aria-atomic="true">
                <ChampionDisplay name={champion} label={rl.champion} dark={dark} />
              </div>
            )}

            {/* Scrollable bracket */}
            <div className="overflow-x-auto pb-4" role="region" aria-label={ui.knockoutPhase}>
              <div className="flex gap-4 min-w-max items-start">
                <BracketColumn
                  matches={r16}
                  label={rl.r16}
                  onPick={pickWinner(null, setR16, qf, setQf)}
                  disabled={false}
                />
                <BracketColumn
                  matches={qf}
                  label={rl.qf}
                  onPick={pickWinner(null, setQf, sf, setSf)}
                  disabled={false}
                />
                <BracketColumn
                  matches={sf}
                  label={rl.sf}
                  onPick={pickWinner(null, setSf, final, setFinal)}
                  disabled={false}
                />
                <BracketColumn
                  matches={final}
                  label={rl.f}
                  onPick={(i, w) => pickFinalWinner(i, w)}
                  disabled={false}
                />
                <ChampionDisplay name={champion} label={rl.champion} dark={dark} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
