/**
 * QuizRanking.jsx
 * Ranking global do Quiz da Copa — salvo no Firebase Firestore
 */

import { useState, useEffect, useContext } from "react";
import { collection, addDoc, getDocs, orderBy, query, limit, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { ThemeContext } from "./WorldCup2026";
const useTheme = () => useContext(ThemeContext);

// ─── SALVAR PONTUAÇÃO ─────────────────────────────────────────────────────────

export async function saveQuizScore(name, score, total, lang) {
  try {
    await addDoc(collection(db, "quiz_scores"), {
      name,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      lang,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Erro ao salvar pontuação:", err);
  }
}

// ─── COMPONENTE DE RANKING ────────────────────────────────────────────────────

export default function QuizRanking({ lang = "pt-BR" }) {
  const { dark } = useTheme();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const q = query(
          collection(db, "quiz_scores"),
          orderBy("percentage", "desc"),
          orderBy("createdAt", "asc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        setScores(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className={`rounded-2xl border p-6 mt-8 ${dark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
      <h3 className={`font-black text-lg uppercase mb-4 text-center ${dark ? "text-white" : "text-slate-900"}`}>
        🏆 Ranking Global
      </h3>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => (
            <div key={i} className={`h-10 rounded-xl animate-pulse ${dark ? "bg-slate-700" : "bg-slate-100"}`} />
          ))}
        </div>
      ) : scores.length === 0 ? (
        <p className={`text-center text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
          Nenhuma pontuação ainda. Seja o primeiro! 🎯
        </p>
      ) : (
        <ol className="space-y-2" aria-label="Top 10 do Quiz">
          {scores.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
              ${i === 0
                ? dark ? "bg-yellow-400/20 border border-yellow-500/30" : "bg-yellow-50 border border-yellow-300"
                : dark ? "bg-slate-700/50" : "bg-slate-50"
              }`}>
              <span className="text-lg w-8 text-center" aria-hidden="true">
                {medals[i] || `${i + 1}º`}
              </span>
              <span className={`flex-1 font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                {s.name}
              </span>
              <span className={`font-black ${i === 0 ? "text-yellow-500" : dark ? "text-slate-300" : "text-slate-700"}`}>
                {s.score}/{s.total}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                ${s.percentage === 100
                  ? "bg-yellow-400 text-slate-900"
                  : s.percentage >= 60
                    ? "bg-emerald-500/20 text-emerald-400"
                    : dark ? "bg-slate-600 text-slate-400" : "bg-slate-200 text-slate-500"
                }`}>
                {s.percentage}%
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}