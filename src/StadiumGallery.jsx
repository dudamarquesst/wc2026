/**
 * StadiumGallery.jsx
 *
 * Componente de galeria interativa dos estádios da Copa 2026.
 *
 * COMO USAR — adicione no WorldCup2026.jsx:
 *
 *   import StadiumGallery from "./StadiumGallery";
 *
 * E dentro do <main>, após o <GroupFilter>:
 *
 *   <div id="estadios"><StadiumGallery lang={lang} /></div>
 *
 * Adicione também o link na navbar:
 *   { href: "#estadios", label: t.navStadiums }
 *
 * E em cada objeto de tradução (T["pt-BR"] etc.) adicione:
 *   navStadiums: "Estádios",
 *   stadiumsLabel: "Os palcos da Copa",
 *   stadiumsTitle: "Galeria de",
 *   stadiumsHighlight: " Estádios",
 *   stadiumsAll: "Todos",
 *   stadiumsCapacity: "Capacidade",
 *   stadiumsCity: "Cidade",
 *   stadiumsClose: "Fechar detalhes",
 *   stadiumsGames: "jogos",
 *   stadiumsOpening: "Jogo de abertura",
 *   stadiumsFinal: "Final",
 *   stadiumsViewMore: "Ver detalhes",
 *   stadiumsPrev: "Estádio anterior",
 *   stadiumsNext: "Próximo estádio",
 */

import { useState, useCallback, useRef, useContext } from "react";

import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── DADOS DOS ESTÁDIOS ───────────────────────────────────────────────────────

const STADIUMS = [
  // ── EUA ──
  {
    id: 1,
    name: "MetLife Stadium",
    city: "East Rutherford, NJ",
    country: "USA",
    flag: "🇺🇸",
    capacity: 82_500,
    games: 8,
    isOpening: true,
    isFinal: true,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/MetLife_Stadium_aerial_2014.jpg/1280px-MetLife_Stadium_aerial_2014.jpg",
    desc: "O maior estádio da Copa, palco da abertura e da grande final. Casa dos Giants e Jets da NFL, localizado em New Jersey, a poucos minutos de Manhattan.",
    builtYear: 2010,
    surface: "Gramado Natural",
    architect: "Populous / 360 Architecture",
  },
  {
    id: 2,
    name: "AT&T Stadium",
    city: "Arlington, TX",
    country: "USA",
    flag: "🇺🇸",
    capacity: 80_000,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/AT%26T_Stadium_-_exterior_in_2022.jpg/1280px-AT%26T_Stadium_-_exterior_in_2022.jpg",
    desc: "Conhecido como 'A Casa', o estádio dos Dallas Cowboys possui uma das maiores telas de vídeo suspensas do mundo e é um ícone da cultura esportiva americana.",
    builtYear: 2009,
    surface: "Gramado Natural",
    architect: "HKS Architects",
  },
  {
    id: 3,
    name: "SoFi Stadium",
    city: "Inglewood, CA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 70_240,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/SoFi_Stadium_-_2021_Super_Bowl_LVI.jpg/1280px-SoFi_Stadium_-_2021_Super_Bowl_LVI.jpg",
    desc: "O mais moderno estádio dos EUA, com telhado translúcido e campo central suspenso. Casa dos Rams e Chargers, sediou o Super Bowl LVI em 2022.",
    builtYear: 2020,
    surface: "Gramado Sintético",
    architect: "HKS Architects",
  },
  {
    id: 4,
    name: "Rose Bowl",
    city: "Pasadena, CA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 92_542,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Rose_Bowl_2018b.jpg/1280px-Rose_Bowl_2018b.jpg",
    desc: "Um dos estádios mais históricos do futebol mundial. Aqui aconteceu a final da Copa 1994 entre Brasil e Itália. Patrimônio histórico dos EUA.",
    builtYear: 1922,
    surface: "Gramado Natural",
    architect: "Myron Hunt",
  },
  {
    id: 5,
    name: "Levi's Stadium",
    city: "Santa Clara, CA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 68_500,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Levi%27s_Stadium_-_Santa_Clara%2C_CA_-_panoramio_%282%29.jpg/1280px-Levi%27s_Stadium_-_Santa_Clara%2C_CA_-_panoramio_%282%29.jpg",
    desc: "Estádio de alta tecnologia no coração do Vale do Silício, com painéis solares no telhado e sistemas de sustentabilidade de ponta. Casa do San Francisco 49ers.",
    builtYear: 2014,
    surface: "Gramado Natural",
    architect: "HNTB",
  },
  {
    id: 6,
    name: "Hard Rock Stadium",
    city: "Miami Gardens, FL",
    country: "USA",
    flag: "🇺🇸",
    capacity: 65_326,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Hard_Rock_Stadium_August_2016.jpg/1280px-Hard_Rock_Stadium_August_2016.jpg",
    desc: "Casa do Miami Dolphins, o estádio passou por uma reforma bilionária com telhado retrátil e estrutura completamente renovada para receber o evento.",
    builtYear: 1987,
    surface: "Gramado Natural",
    architect: "HOK Sport",
  },
  {
    id: 7,
    name: "Gillette Stadium",
    city: "Foxborough, MA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 65_878,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Gillette_Stadium_2012.jpg/1280px-Gillette_Stadium_2012.jpg",
    desc: "Casa do New England Patriots e do New England Revolution de MLS, localizado a 48 km de Boston. Um dos estádios mais emblemáticos da Costa Leste.",
    builtYear: 2002,
    surface: "Gramado Natural",
    architect: "HOK Sport",
  },
  {
    id: 8,
    name: "Lincoln Financial Field",
    city: "Philadelphia, PA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 69_796,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Lincoln_Financial_Field_aerial.jpg/1280px-Lincoln_Financial_Field_aerial.jpg",
    desc: "O 'Linc', casa do Philadelphia Eagles, é famoso pela paixão da sua torcida. Filadelfia é uma das cidades mais históricas dos EUA, onde a Declaração de Independência foi assinada.",
    builtYear: 2003,
    surface: "Gramado Natural",
    architect: "AECOM",
  },
  {
    id: 9,
    name: "Arrowhead Stadium",
    city: "Kansas City, MO",
    country: "USA",
    flag: "🇺🇸",
    capacity: 76_416,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Arrowhead_Stadium_2012.jpg/1280px-Arrowhead_Stadium_2012.jpg",
    desc: "Considerado um dos estádios mais barulhentos do mundo, casa do Kansas City Chiefs. A cidade também abriga um dos clubes de MLS mais bem-sucedidos, o Sporting KC.",
    builtYear: 1972,
    surface: "Gramado Natural",
    architect: "Kivett & Myers",
  },
  {
    id: 10,
    name: "Lumen Field",
    city: "Seattle, WA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 69_000,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Lumen_Field_2021.jpg/1280px-Lumen_Field_2021.jpg",
    desc: "Casa do Seattle Seahawks e do Seattle Sounders FC da MLS. Seattle é famosa pela Space Needle e por ser o berço do grunge, com visual deslumbrante das montanhas.",
    builtYear: 2002,
    surface: "Gramado Sintético",
    architect: "Ellerbe Becket",
  },
  {
    id: 11,
    name: "Mercedes-Benz Stadium",
    city: "Atlanta, GA",
    country: "USA",
    flag: "🇺🇸",
    capacity: 71_000,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Mercedes-Benz_Stadium%2C_exterior.jpg/1280px-Mercedes-Benz_Stadium%2C_exterior.jpg",
    desc: "Um dos estádios mais modernos e premiados do mundo. O telhado retrátil em formato de olho de pássaro é uma obra de engenharia. Casa do Atlanta Falcons e Atlanta United.",
    builtYear: 2017,
    surface: "Gramado Sintético",
    architect: "HOK",
  },
  // ── Canadá ──
  {
    id: 12,
    name: "BC Place",
    city: "Vancouver, BC",
    country: "Canada",
    flag: "🇨🇦",
    capacity: 54_500,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/BC_Place_Stadium_with_retractable_roof_extended.jpg/1280px-BC_Place_Stadium_with_retractable_roof_extended.jpg",
    desc: "O maior estádio coberto do Canadá, com teto retrátil inflável único no mundo. Vancouver é uma das cidades mais multiculturais do planeta, com vista para as Montanhas Rochosas.",
    builtYear: 1983,
    surface: "Gramado Sintético",
    architect: "Phillips Barratt",
  },
  {
    id: 13,
    name: "BMO Field",
    city: "Toronto, ON",
    country: "Canada",
    flag: "🇨🇦",
    capacity: 45_736,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/BMO_Field_Expansion_Complete.jpg/1280px-BMO_Field_Expansion_Complete.jpg",
    desc: "O único estádio de futebol dedicado exclusivamente ao esporte no Canadá. Casa do Toronto FC, multicampeão da MLS, localizado às margens do Lago Ontario.",
    builtYear: 2007,
    surface: "Gramado Natural",
    architect: "Populous",
  },
  // ── México ──
  {
    id: 14,
    name: "Estadio Azteca",
    city: "Cidade do México, CDMX",
    country: "Mexico",
    flag: "🇲🇽",
    capacity: 87_523,
    games: 6,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Estadio_Azteca_-_Mexico_City.jpg/1280px-Estadio_Azteca_-_Mexico_City.jpg",
    desc: "O templo do futebol mundial. Único estádio a sediar duas finais de Copa (1970 e 1986). Aqui Pelé foi campeão e Maradona fez o 'Gol do Século'. Localizado a 2.240m de altitude.",
    builtYear: 1966,
    surface: "Gramado Natural",
    architect: "Pedro Ramírez Vázquez",
  },
  {
    id: 15,
    name: "Estadio Akron",
    city: "Guadalajara, JAL",
    country: "Mexico",
    flag: "🇲🇽",
    capacity: 49_850,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Estadio_Omnilife_-_Guadalajara%2C_M%C3%A9xico.jpg/1280px-Estadio_Omnilife_-_Guadalajara%2C_M%C3%A9xico.jpg",
    desc: "Casa do Chivas de Guadalajara, o clube mais popular do México. O estádio moderno tem formato elíptico e iluminação espetacular. Guadalajara é a 'Perola do Ocidente'.",
    builtYear: 2010,
    surface: "Gramado Natural",
    architect: "Populous",
  },
  {
    id: 16,
    name: "Estadio BBVA",
    city: "Guadalupe, NL",
    country: "Mexico",
    flag: "🇲🇽",
    capacity: 53_500,
    games: 5,
    isOpening: false,
    isFinal: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Estadio_BBVA_Bancomer.jpg/1280px-Estadio_BBVA_Bancomer.jpg",
    desc: "Casa do Monterrey, o estádio é envolto pelas majestosas montanhas da Serra Madre Oriental, criando um dos cenários mais deslumbrantes do futebol mundial.",
    builtYear: 2015,
    surface: "Gramado Natural",
    architect: "Populous",
  },
];

const COUNTRY_FILTERS = ["Todos", "USA", "Canada", "Mexico"];

const COUNTRY_LABELS = {
  "pt-BR": { Todos: "Todos", USA: "🇺🇸 EUA", Canada: "🇨🇦 Canadá", Mexico: "🇲🇽 México" },
  "en-US": { Todos: "All",  USA: "🇺🇸 USA", Canada: "🇨🇦 Canada", Mexico: "🇲🇽 Mexico" },
  "es-MX": { Todos: "Todos",USA: "🇺🇸 EE.UU.", Canada: "🇨🇦 Canadá", Mexico: "🇲🇽 México" },
  "fr-FR": { Todos: "Tous", USA: "🇺🇸 États-Unis", Canada: "🇨🇦 Canada", Mexico: "🇲🇽 Mexique" },
  "de-DE": { Todos: "Alle", USA: "🇺🇸 USA", Canada: "🇨🇦 Kanada", Mexico: "🇲🇽 Mexiko" },
  "ja-JP": { Todos: "すべて",USA: "🇺🇸 アメリカ", Canada: "🇨🇦 カナダ", Mexico: "🇲🇽 メキシコ" },
  "ar-SA": { Todos: "الكل",  USA: "🇺🇸 أمريكا", Canada: "🇨🇦 كندا", Mexico: "🇲🇽 المكسيك" },
};

const UI = {
  "pt-BR": { sectionLabel:"Os palcos da Copa", title:"Galeria de", highlight:" Estádios", capacity:"Capacidade", city:"Cidade", close:"Fechar detalhes do estádio", games:"jogos", opening:"Jogo de Abertura", final:"FINAL", details:"Ver detalhes", prev:"Estádio anterior", next:"Próximo estádio", built:"Inaugurado", surface:"Gramado", architect:"Arquiteto", photoBy:"Foto via Wikimedia Commons", of:"de" },
  "en-US": { sectionLabel:"The World Cup venues", title:"Stadium", highlight:" Gallery", capacity:"Capacity", city:"City", close:"Close stadium details", games:"matches", opening:"Opening Match", final:"FINAL", details:"View details", prev:"Previous stadium", next:"Next stadium", built:"Built", surface:"Surface", architect:"Architect", photoBy:"Photo via Wikimedia Commons", of:"of" },
  "es-MX": { sectionLabel:"Los escenarios del Mundial", title:"Galería de", highlight:" Estadios", capacity:"Capacidad", city:"Ciudad", close:"Cerrar detalles", games:"partidos", opening:"Partido Inaugural", final:"FINAL", details:"Ver detalles", prev:"Estadio anterior", next:"Siguiente estadio", built:"Inaugurado", surface:"Cancha", architect:"Arquitecto", photoBy:"Foto vía Wikimedia Commons", of:"de" },
  "fr-FR": { sectionLabel:"Les stades de la Coupe", title:"Galerie des", highlight:" Stades", capacity:"Capacité", city:"Ville", close:"Fermer les détails", games:"matchs", opening:"Match d'ouverture", final:"FINALE", details:"Voir détails", prev:"Stade précédent", next:"Stade suivant", built:"Construit", surface:"Surface", architect:"Architecte", photoBy:"Photo via Wikimedia Commons", of:"sur" },
  "de-DE": { sectionLabel:"Die WM-Stadien", title:"Stadion", highlight:"-Galerie", capacity:"Kapazität", city:"Stadt", close:"Details schließen", games:"Spiele", opening:"Eröffnungsspiel", final:"FINALE", details:"Details anzeigen", prev:"Vorheriges Stadion", next:"Nächstes Stadion", built:"Gebaut", surface:"Belag", architect:"Architekt", photoBy:"Foto via Wikimedia Commons", of:"von" },
  "ja-JP": { sectionLabel:"W杯の会場", title:"スタジアム", highlight:"ギャラリー", capacity:"収容人数", city:"都市", close:"詳細を閉じる", games:"試合", opening:"開幕戦", final:"決勝", details:"詳細を見る", prev:"前のスタジアム", next:"次のスタジアム", built:"開場", surface:"芝", architect:"設計者", photoBy:"写真：Wikimedia Commons", of:"/" },
  "ar-SA": { sectionLabel:"ملاعب كأس العالم", title:"معرض", highlight:" الملاعب", capacity:"السعة", city:"المدينة", close:"إغلاق التفاصيل", games:"مباريات", opening:"مباراة الافتتاح", final:"النهائي", details:"عرض التفاصيل", prev:"الملعب السابق", next:"الملعب التالي", built:"تأسس", surface:"أرضية", architect:"المعماري", photoBy:"صورة عبر ويكيميديا", of:"من" },
};

// ─── IMAGE WITH FALLBACK ──────────────────────────────────────────────────────

function StadiumImage({ src, alt, className }) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className={`${className} flex items-center justify-center bg-slate-800`}>
      <span className="text-5xl" aria-hidden="true">🏟️</span>
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────

function StadiumModal({ stadium, onClose, onPrev, onNext, currentIndex, total, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const closeRef = useRef(null);

  // Trap focus & keyboard navigation
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  const cap = stadium.capacity.toLocaleString();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={stadium.name}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col
        ${dark ? "bg-slate-900 border border-slate-700" : "bg-white border border-slate-200"}`}>

        {/* Image */}
        <div className="relative h-52 sm:h-72 flex-shrink-0 overflow-hidden rounded-t-3xl">
          <StadiumImage
            src={stadium.image}
            alt={`Foto do ${stadium.name} em ${stadium.city}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />

          {/* Badges over image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full
              ${dark ? "bg-slate-900/80 text-white" : "bg-white/90 text-slate-900"}`}>
              {stadium.flag} {stadium.country}
            </span>
            {stadium.isOpening && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-white">
                {ui.opening}
              </span>
            )}
            {stadium.isFinal && (
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-yellow-400 text-slate-900">
                🏆 {ui.final}
              </span>
            )}
          </div>

          {/* Close */}
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={ui.close}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          {/* Name over image */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{stadium.name}</h3>
            <p className="text-white/70 text-sm mt-1">{stadium.city}</p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: ui.capacity, value: cap },
              { label: ui.games, value: stadium.games },
              { label: ui.built, value: stadium.builtYear },
            ].map(({ label, value }) => (
              <div key={label} className={`rounded-2xl p-3 text-center ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                <p className="text-lg font-black text-yellow-500">{value.toLocaleString()}</p>
                <p className={`text-[10px] uppercase tracking-wider font-semibold ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
              </div>
            ))}
          </div>

          {/* Surface & Architect */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: ui.surface, value: stadium.surface },
              { label: ui.architect, value: stadium.architect },
            ].map(({ label, value }) => (
              <div key={label} className={`rounded-2xl p-3 ${dark ? "bg-slate-800" : "bg-slate-50"}`}>
                <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                <p className={`text-sm font-bold leading-tight ${dark ? "text-white" : "text-slate-900"}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{stadium.desc}</p>

          {/* Photo credit */}
          <p className={`text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>{ui.photoBy}</p>
        </div>

        {/* Navigation */}
        <div className={`sticky bottom-0 flex items-center justify-between px-6 py-4 border-t rounded-b-3xl
          ${dark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white"}`}>
          <button
            onClick={onPrev}
            aria-label={ui.prev}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${dark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
            {ui.prev}
          </button>

          <span className={`text-xs font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {currentIndex + 1} {ui.of} {total}
          </span>

          <button
            onClick={onNext}
            aria-label={ui.next}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${dark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"}`}
          >
            {ui.next}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────

function StadiumCard({ stadium, onOpen, lang }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];

  return (
    <article
      className={`group rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl
        ${dark
          ? "bg-slate-800/60 border-slate-700/50 hover:border-emerald-500/40 hover:shadow-emerald-500/10"
          : "bg-white border-slate-200 hover:border-emerald-400 hover:shadow-emerald-200/50"
        }`}
      onClick={() => onOpen(stadium.id)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <StadiumImage
          src={stadium.image}
          alt={`Foto do ${stadium.name}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {stadium.isOpening && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              {ui.opening}
            </span>
          )}
          {stadium.isFinal && (
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-yellow-400 text-slate-900">
              🏆 {ui.final}
            </span>
          )}
        </div>

        {/* Country flag */}
        <span className="absolute top-3 right-3 text-xl" aria-hidden="true">{stadium.flag}</span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className={`font-black text-base leading-tight mb-1 group-hover:text-emerald-500 transition-colors
          ${dark ? "text-white" : "text-slate-900"}`}>
          {stadium.name}
        </h3>
        <p className={`text-xs mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>{stadium.city}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-500 font-black text-sm">{stadium.capacity.toLocaleString()}</p>
            <p className={`text-[10px] uppercase tracking-wider ${dark ? "text-slate-600" : "text-slate-400"}`}>{ui.capacity}</p>
          </div>
          <div className="text-right">
            <p className={`font-black text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{stadium.games}</p>
            <p className={`text-[10px] uppercase tracking-wider ${dark ? "text-slate-600" : "text-slate-400"}`}>{ui.games}</p>
          </div>
          <button
            aria-label={`${ui.details}: ${stadium.name}`}
            onClick={(e) => { e.stopPropagation(); onOpen(stadium.id); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
              ${dark ? "bg-slate-700 hover:bg-emerald-500 text-slate-300 hover:text-white" : "bg-slate-100 hover:bg-emerald-500 text-slate-600 hover:text-white"}`}
          >
            {ui.details} →
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── MAIN GALLERY ─────────────────────────────────────────────────────────────

export default function StadiumGallery({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const ui = UI[lang] || UI["pt-BR"];
  const countryLabels = COUNTRY_LABELS[lang] || COUNTRY_LABELS["pt-BR"];

  const [filter, setFilter] = useState("Todos");
  const [modalId, setModalId] = useState(null);

  const filtered = filter === "Todos" ? STADIUMS : STADIUMS.filter(s => s.country === filter);

  const modalIndex = filtered.findIndex(s => s.id === modalId);
  const modalStadium = modalIndex >= 0 ? filtered[modalIndex] : null;

  const openModal = useCallback((id) => setModalId(id), []);
  const closeModal = useCallback(() => setModalId(null), []);
  const prevModal = useCallback(() => {
    const prev = (modalIndex - 1 + filtered.length) % filtered.length;
    setModalId(filtered[prev].id);
  }, [modalIndex, filtered]);
  const nextModal = useCallback(() => {
    const next = (modalIndex + 1) % filtered.length;
    setModalId(filtered[next].id);
  }, [modalIndex, filtered]);

  const sectionBg = dark ? "" : "bg-white";

  return (
    <>
      <section
        id="estadios"
        aria-labelledby="stadiums-heading"
        className={`py-16 md:py-24 ${sectionBg}`}
      >
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
            {ui.sectionLabel}
          </p>
          <h2
            id="stadiums-heading"
            className={`text-3xl md:text-5xl font-black uppercase mb-10 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}
          >
            {ui.title}<span className="text-emerald-500">{ui.highlight}</span>
          </h2>

          {/* Filters */}
          <div
            role="tablist"
            aria-label="Filtrar estádios por país"
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {COUNTRY_FILTERS.map(c => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all duration-200
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2
                  ${filter === c
                    ? "bg-yellow-400 text-slate-900 shadow-lg shadow-yellow-400/30"
                    : dark
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                  }`}
              >
                {countryLabels[c]}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className={`text-center text-sm mb-8 ${dark ? "text-slate-500" : "text-slate-400"}`} aria-live="polite" aria-atomic="true">
            {filtered.length} {filtered.length === 1 ? "estádio" : "estádios"} {filter !== "Todos" ? `em ${countryLabels[filter]}` : ""}
          </p>

          {/* Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            role="list"
            aria-label="Lista de estádios"
          >
            {filtered.map(stadium => (
              <div key={stadium.id} role="listitem">
                <StadiumCard stadium={stadium} onOpen={openModal} lang={lang} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalStadium && (
        <StadiumModal
          stadium={modalStadium}
          onClose={closeModal}
          onPrev={prevModal}
          onNext={nextModal}
          currentIndex={modalIndex}
          total={filtered.length}
          lang={lang}
        />
      )}
    </>
  );
}
