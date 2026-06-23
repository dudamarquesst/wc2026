import { useState, useEffect, useCallback, useRef } from "react";

const API_URL = "https://worldcup26.ir/get/games";

// Bandeiras por nome em inglês
const FLAGS = {
  "Mexico":"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷","Czech Republic":"🇨🇿",
  "Canada":"🇨🇦","Bosnia and Herzegovina":"🇧🇦","Qatar":"🇶🇦","Switzerland":"🇨🇭",
  "Brazil":"🇧🇷","Morocco":"🇲🇦","Haiti":"🇭🇹","Scotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "United States":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turkey":"🇹🇷",
  "Germany":"🇩🇪","Curaçao":"🇨🇼","Ivory Coast":"🇨🇮","Ecuador":"🇪🇨",
  "Netherlands":"🇳🇱","Japan":"🇯🇵","Sweden":"🇸🇪","Tunisia":"🇹🇳",
  "Belgium":"🇧🇪","Egypt":"🇪🇬","Iran":"🇮🇷","New Zealand":"🇳🇿",
  "Spain":"🇪🇸","Cape Verde":"🇨🇻","Saudi Arabia":"🇸🇦","Uruguay":"🇺🇾",
  "France":"🇫🇷","Senegal":"🇸🇳","Iraq":"🇮🇶","Norway":"🇳🇴",
  "Argentina":"🇦🇷","Algeria":"🇩🇿","Austria":"🇦🇹","Jordan":"🇯🇴",
  "Portugal":"🇵🇹","Democratic Republic of the Congo":"🇨🇩","Uzbekistan":"🇺🇿","Colombia":"🇨🇴",
  "England":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croatia":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦",
};

// Nomes em português
const PT_NAMES = {
  "Mexico":"México","South Africa":"África do Sul","South Korea":"Coreia do Sul",
  "Czech Republic":"Tchéquia","Canada":"Canadá","Bosnia and Herzegovina":"Bósnia e Herzegovina",
  "Qatar":"Catar","Switzerland":"Suíça","Brazil":"Brasil","Morocco":"Marrocos",
  "Haiti":"Haiti","Scotland":"Escócia","United States":"Estados Unidos","Paraguay":"Paraguai",
  "Australia":"Austrália","Turkey":"Turquia","Germany":"Alemanha","Curaçao":"Curaçao",
  "Ivory Coast":"Costa do Marfim","Ecuador":"Equador","Netherlands":"Holanda","Japan":"Japão",
  "Sweden":"Suécia","Tunisia":"Tunísia","Belgium":"Bélgica","Egypt":"Egito","Iran":"Irã",
  "New Zealand":"Nova Zelândia","Spain":"Espanha","Cape Verde":"Cabo Verde",
  "Saudi Arabia":"Arábia Saudita","Uruguay":"Uruguai","France":"França","Senegal":"Senegal",
  "Iraq":"Iraque","Norway":"Noruega","Argentina":"Argentina","Algeria":"Argélia",
  "Austria":"Áustria","Jordan":"Jordânia","Portugal":"Portugal",
  "Democratic Republic of the Congo":"Rep. Dem. do Congo","Uzbekistan":"Uzbequistão",
  "Colombia":"Colômbia","England":"Inglaterra","Croatia":"Croácia","Ghana":"Gana","Panama":"Panamá",
};

const FASES = {
  "A":"Grupo A","B":"Grupo B","C":"Grupo C","D":"Grupo D","E":"Grupo E","F":"Grupo F",
  "G":"Grupo G","H":"Grupo H","I":"Grupo I","J":"Grupo J","K":"Grupo K","L":"Grupo L",
  "R32":"Oitavas de Final","R16":"Oitavas","QF":"Quartas de Final","SF":"Semifinais",
  "3RD":"Disputa de 3º Lugar","FINAL":"Final",
};

function getStatus(jogo) {
  const elapsed = (jogo.time_elapsed || "").toLowerCase();
  if (elapsed === "finished" || jogo.finished === "TRUE")
    return { label: "Encerrado", cor: "text-gray-400", bg: "bg-gray-500/10", aoVivo: false };
  if (elapsed === "live")
    return { label: "Ao Vivo", cor: "text-green-400", bg: "bg-green-500/20", aoVivo: true };
  return { label: "Não iniciado", cor: "text-blue-400", bg: "bg-blue-500/10", aoVivo: false };
}

function formatarData(dateStr) {
  if (!dateStr) return "";
  const [datePart, timePart] = dateStr.split(" ");
  const [m, d, y] = datePart.split("/");
  return `${d}/${m} ${timePart}`;
}

function CardJogo({ jogo, dark }) {
  const status = getStatus(jogo);
  const encerrado = status.label === "Encerrado";
  const aoVivo = status.aoVivo;

  const homeName = PT_NAMES[jogo.home_team_name_en] || jogo.home_team_name_en || jogo.home_team_label || "A definir";
  const awayName = PT_NAMES[jogo.away_team_name_en] || jogo.away_team_name_en || jogo.away_team_label || "A definir";
  const homeFlag = FLAGS[jogo.home_team_name_en] || "🏳️";
  const awayFlag = FLAGS[jogo.away_team_name_en] || "🏳️";
  const homeScore = jogo.home_score !== "null" ? jogo.home_score : null;
  const awayScore = jogo.away_score !== "null" ? jogo.away_score : null;

  return (
    <article className={`rounded-2xl border p-4 transition-all duration-200
      ${dark
        ? `bg-slate-800/60 border-slate-700/50 hover:border-slate-600 ${aoVivo ? "!border-green-500/50" : ""}`
        : `bg-white border-slate-200 shadow-sm hover:shadow-md ${aoVivo ? "!border-green-400" : ""}`
      }`}
    >
      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>
          {formatarData(jogo.local_date)}
        </span>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${status.cor} ${status.bg}`}>
          {status.label}
          {aoVivo && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
        </span>
      </div>

      {/* Times e placar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl leading-none">{homeFlag}</span>
          <span className={`text-xs font-semibold leading-tight ${dark ? "text-slate-300" : "text-slate-700"}`}>
            {homeName}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 min-w-[72px]">
          {(encerrado || aoVivo) && homeScore !== null ? (
            <div className={`text-2xl font-black tabular-nums ${dark ? "text-white" : "text-slate-900"}`}>
              {homeScore} — {awayScore}
            </div>
          ) : (
            <div className={`text-lg font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>VS</div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center gap-1 text-center">
          <span className="text-3xl leading-none">{awayFlag}</span>
          <span className={`text-xs font-semibold leading-tight ${dark ? "text-slate-300" : "text-slate-700"}`}>
            {awayName}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function LiveScores({ dark }) {
  const [jogos, setJogos]           = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro]             = useState(null);
  const [ultimaAtt, setUltimaAtt]   = useState(null);
  const [filtro, setFiltro]         = useState("todos");
  const intervalRef                 = useRef(null);

  const buscarJogos = useCallback(async (silencioso = false) => {
    if (!silencioso) setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const lista = Array.isArray(data) ? data : (data.games || []);
      setJogos(lista);
      setUltimaAtt(new Date());
    } catch {
      setErro("Não foi possível carregar os jogos. Tente novamente.");
    } finally {
      if (!silencioso) setCarregando(false);
    }
  }, []);

  const temAoVivo = jogos.some(j => (j.time_elapsed || "").toLowerCase() === "live");

  useEffect(() => { buscarJogos(); return () => clearInterval(intervalRef.current); }, [buscarJogos]);

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (temAoVivo) intervalRef.current = setInterval(() => buscarJogos(true), 5 * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [temAoVivo, buscarJogos]);

  const hoje = new Date().toLocaleDateString("pt-BR");

  const jogosFiltrados = jogos.filter(j => {
    const elapsed = (j.time_elapsed || "").toLowerCase();
    const encerrado = elapsed === "finished" || j.finished === "TRUE";
    const aoVivo = elapsed === "live";
    const dataJogo = formatarData(j.local_date).split(" ")[0];
    const hojeFormatado = new Date().toLocaleDateString("pt-BR", { day:"2-digit", month:"2-digit" });

    if (filtro === "ao_vivo")    return aoVivo;
    if (filtro === "hoje")       return dataJogo === hojeFormatado;
    if (filtro === "encerrados") return encerrado;
    if (filtro === "proximos")   return !encerrado && !aoVivo;
    return true;
  });

  const porFase = jogosFiltrados.reduce((acc, j) => {
    const fase = FASES[j.group] || j.group || "Copa 2026";
    if (!acc[fase]) acc[fase] = [];
    acc[fase].push(j);
    return acc;
  }, {});

  return (
    <section id="placares" aria-labelledby="placares-titulo"
      className={`py-16 px-4 ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-2 ${dark ? "text-green-400" : "text-green-600"}`}>
            Copa do Mundo FIFA 2026
          </p>
          <h2 id="placares-titulo"
            className={`text-3xl md:text-5xl font-black uppercase mb-2 flex items-center justify-center gap-3 ${dark ? "text-white" : "text-slate-900"}`}>
            Placares
            {temAoVivo && (
              <span className="text-green-500 flex items-center gap-2 text-2xl">
                Ao Vivo <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse inline-block" />
              </span>
            )}
          </h2>
          <p className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
            {jogos.length} jogos carregados
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex flex-wrap gap-2">
            {[["todos","Todos"],["ao_vivo","🔴 Ao Vivo"],["hoje","Hoje"],["proximos","Próximos"],["encerrados","Encerrados"]].map(([val, label]) => (
              <button key={val} onClick={() => setFiltro(val)} aria-pressed={filtro === val}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                  ${filtro === val
                    ? "bg-yellow-400 text-slate-900 shadow-md"
                    : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                           : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {ultimaAtt && (
              <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>
                {ultimaAtt.toLocaleTimeString("pt-BR", { hour:"2-digit", minute:"2-digit" })}
                {temAoVivo && " · auto 5min"}
              </span>
            )}
            <button onClick={() => buscarJogos()} disabled={carregando}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all
                focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 disabled:opacity-50
                ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                       : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}`}>
              <svg className={`w-3.5 h-3.5 ${carregando ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
              </svg>
              {carregando ? "Atualizando…" : "Atualizar"}
            </button>
          </div>
        </div>

        {erro && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700 mb-6">
            ⚠️ {erro}
          </div>
        )}

        {carregando && jogos.length === 0 && (
          <div className="text-center py-16">
            <div className={`inline-block w-8 h-8 border-4 rounded-full animate-spin mb-4
              ${dark ? "border-slate-700 border-t-yellow-400" : "border-slate-200 border-t-yellow-500"}`} />
            <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Buscando jogos…</p>
          </div>
        )}

        {!carregando && jogosFiltrados.length === 0 && !erro && (
          <p className={`text-center py-16 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Nenhum jogo encontrado para este filtro.
          </p>
        )}

        {Object.entries(porFase).map(([fase, jogosF]) => (
          <div key={fase} className="mb-10">
            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 pb-2 border-b
              ${dark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-200"}`}>
              {fase}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogosF.map((jogo, i) => (
                <CardJogo key={jogo.id || i} jogo={jogo} dark={dark} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
