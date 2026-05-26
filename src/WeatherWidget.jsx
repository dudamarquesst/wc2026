/**
 * WeatherWidget.jsx
 * Clima atual nas 16 cidades sede da Copa 2026
 * Usa a API Open-Meteo (gratuita, sem chave de API)
 */

import { useState, useEffect, useContext } from "react";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── CIDADES SEDE ─────────────────────────────────────────────────────────────

const CITIES = [
  { name: "New York/NJ",   country: "USA 🇺🇸",    lat: 40.7128,  lon: -74.0060  },
  { name: "Dallas",        country: "USA 🇺🇸",    lat: 32.7767,  lon: -96.7970  },
  { name: "Los Angeles",   country: "USA 🇺🇸",    lat: 34.0522,  lon: -118.2437 },
  { name: "San Francisco", country: "USA 🇺🇸",    lat: 37.7749,  lon: -122.4194 },
  { name: "Miami",         country: "USA 🇺🇸",    lat: 25.7617,  lon: -80.1918  },
  { name: "Boston",        country: "USA 🇺🇸",    lat: 42.3601,  lon: -71.0589  },
  { name: "Philadelphia",  country: "USA 🇺🇸",    lat: 39.9526,  lon: -75.1652  },
  { name: "Kansas City",   country: "USA 🇺🇸",    lat: 39.0997,  lon: -94.5786  },
  { name: "Seattle",       country: "USA 🇺🇸",    lat: 47.6062,  lon: -122.3321 },
  { name: "Atlanta",       country: "USA 🇺🇸",    lat: 33.7490,  lon: -84.3880  },
  { name: "Pasadena",      country: "USA 🇺🇸",    lat: 34.1478,  lon: -118.1445 },
  { name: "Vancouver",     country: "Canadá 🇨🇦", lat: 49.2827,  lon: -123.1207 },
  { name: "Toronto",       country: "Canadá 🇨🇦", lat: 43.6532,  lon: -79.3832  },
  { name: "Cidade do México", country: "México 🇲🇽", lat: 19.4326, lon: -99.1332 },
  { name: "Guadalajara",   country: "México 🇲🇽", lat: 20.6597,  lon: -103.3496 },
  { name: "Monterrey",     country: "México 🇲🇽", lat: 25.6866,  lon: -100.3161 },
];

// ─── ÍCONES DE CLIMA ─────────────────────────────────────────────────────────

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "☁️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  if (code <= 99) return "⛈️";
  return "🌡️";
}

function getWeatherDesc(code) {
  if (code === 0) return "Céu limpo";
  if (code <= 3) return "Parcialmente nublado";
  if (code <= 48) return "Nublado / Névoa";
  if (code <= 67) return "Chuva";
  if (code <= 77) return "Neve";
  if (code <= 82) return "Chuva fraca";
  if (code <= 99) return "Tempestade";
  return "Indefinido";
}

// ─── CARD DE CLIMA ────────────────────────────────────────────────────────────

function WeatherCard({ city, dark }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weathercode,windspeed_10m&wind_speed_unit=kmh`
        );
        const data = await res.json();
        setWeather(data.current);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [city.lat, city.lon]);

  return (
    <article
      className={`rounded-2xl border p-4 flex flex-col gap-2 transition-all hover:-translate-y-0.5
        ${dark ? "bg-slate-800/60 border-slate-700/50 hover:border-blue-500/40" : "bg-white border-slate-200 shadow-sm hover:border-blue-300"}`}
      aria-label={`Clima em ${city.name}: ${weather ? `${weather.temperature_2m}°C` : "carregando"}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-black text-sm ${dark ? "text-white" : "text-slate-900"}`}>{city.name}</p>
          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{city.country}</p>
        </div>
        {loading ? (
          <div className={`w-8 h-8 rounded-full animate-pulse ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
        ) : error ? (
          <span className="text-2xl">❓</span>
        ) : (
          <span className="text-3xl" aria-hidden="true">{getWeatherIcon(weather.weathercode)}</span>
        )}
      </div>

      {!loading && !error && weather && (
        <>
          <p className={`text-2xl font-black ${dark ? "text-blue-400" : "text-blue-600"}`}>
            {Math.round(weather.temperature_2m)}°C
          </p>
          <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {getWeatherDesc(weather.weathercode)} · 💨 {Math.round(weather.windspeed_10m)} km/h
          </p>
        </>
      )}

      {error && (
        <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Dados indisponíveis</p>
      )}
    </article>
  );
}

// ─── FILTRO POR PAÍS ─────────────────────────────────────────────────────────

const COUNTRY_FILTERS = ["Todos", "USA 🇺🇸", "Canadá 🇨🇦", "México 🇲🇽"];

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function WeatherWidget({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const [filter, setFilter] = useState("Todos");

  const filtered = filter === "Todos"
    ? CITIES
    : CITIES.filter(c => c.country === filter);

  const sectionBg = dark ? "bg-slate-900/60" : "bg-slate-50";

  return (
    <section
      id="clima"
      aria-labelledby="weather-heading"
      className={`py-16 md:py-24 ${sectionBg}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <p className={`text-xs uppercase tracking-[0.3em] font-bold mb-3 text-center ${dark ? "text-blue-400" : "text-blue-600"}`}>
          Condições meteorológicas
        </p>
        <h2
          id="weather-heading"
          className={`text-3xl md:text-5xl font-black uppercase mb-4 text-center leading-tight ${dark ? "text-white" : "text-slate-900"}`}
        >
          Clima nas <span className="text-blue-500">Cidades Sede</span>
        </h2>
        <p className={`text-center text-sm mb-10 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          Temperatura atual em tempo real nas 16 cidades sede da Copa 2026
        </p>

        {/* Filtros */}
        <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8">
          {COUNTRY_FILTERS.map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                ${filter === f
                  ? "bg-yellow-400 text-slate-900 shadow-md"
                  : dark ? "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid de cards */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          role="list"
          aria-label="Clima nas cidades sede"
          aria-live="polite"
        >
          {filtered.map(city => (
            <div key={city.name} role="listitem">
              <WeatherCard city={city} dark={dark} />
            </div>
          ))}
        </div>

        {/* Crédito da API */}
        <p className={`text-center text-[10px] mt-8 ${dark ? "text-slate-600" : "text-slate-400"}`}>
          Dados fornecidos por <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400">Open-Meteo API</a> (gratuita e open-source)
        </p>
      </div>
    </section>
  );
}