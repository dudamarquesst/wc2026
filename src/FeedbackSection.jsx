/**
 * FeedbackSection.jsx
 * Componente de feedback com CRUD completo:
 *   - CREATE: envia novo feedback via formulário
 *   - READ:   lista todos os feedbacks do banco
 *   - UPDATE: edita feedbacks enviados pelo próprio usuário (rastreados via localStorage)
 *   - DELETE: remove feedbacks enviados pelo próprio usuário
 *
 * Os IDs dos feedbacks criados pelo usuário são salvos em:
 *   localStorage["wc2026_meus_feedbacks"] = [1, 5, 12, ...]
 *
 * Isso permite mostrar os botões Editar/Excluir apenas nos feedbacks do próprio usuário,
 * sem precisar de um sistema de login.
 */

import { useState, useEffect, useCallback } from "react";

// ─── URL base da API ──────────────────────────────────────────────────────────
// O Vite proxy em vite.config.js redireciona "/api" → "http://localhost:3001"
const API_URL = "https://wc2026-0zo4.onrender.com/api/feedbacks";

// ─── Chave do localStorage ────────────────────────────────────────────────────
const LS_KEY = "wc2026_meus_feedbacks";

// ─── Helpers de localStorage ──────────────────────────────────────────────────
function getMeusFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function adicionarMeuFeedback(id) {
  const ids = getMeusFeedbacks();
  if (!ids.includes(id)) {
    localStorage.setItem(LS_KEY, JSON.stringify([...ids, id]));
  }
}

function removerMeuFeedback(id) {
  const ids = getMeusFeedbacks().filter((i) => i !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

// ─── Renderiza estrelas ───────────────────────────────────────────────────────
function Estrelas({ avaliacao }) {
  return (
    <span aria-label={`${avaliacao} de 5 estrelas`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < avaliacao ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

// ─── Formulário reutilizável (criar e editar) ─────────────────────────────────
function FeedbackForm({ inicial, aoSubmeter, aoCancel, carregando }) {
  const [form, setForm] = useState(
    inicial || { nome: "", email: "", mensagem: "", avaliacao: 5 }
  );
  const [erros, setErros] = useState([]);

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function submeter(e) {
    e.preventDefault();
    setErros([]);
    aoSubmeter(form, setErros);
  }

  return (
    <form onSubmit={submeter} noValidate className="space-y-4">
      {/* Erros de validação */}
      {erros.length > 0 && (
        <div
          role="alert"
          className="rounded-lg border border-red-400 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300"
        >
          <ul className="list-disc pl-4 space-y-1">
            {erros.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Nome */}
      <div>
        <label
          htmlFor="fb-nome"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Nome *
        </label>
        <input
          id="fb-nome"
          type="text"
          value={form.nome}
          onChange={(e) => atualizar("nome", e.target.value)}
          maxLength={100}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-500
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Seu nome"
        />
      </div>

      {/* E-mail */}
      <div>
        <label
          htmlFor="fb-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          E-mail *
        </label>
        <input
          id="fb-email"
          type="email"
          value={form.email}
          onChange={(e) => atualizar("email", e.target.value)}
          maxLength={150}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-500
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="seu@email.com"
        />
      </div>

      {/* Avaliação por estrelas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Avaliação *
        </label>
        <div className="flex gap-2" role="group" aria-label="Avaliação em estrelas">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => atualizar("avaliacao", n)}
              aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
              aria-pressed={form.avaliacao >= n}
              className={`text-2xl transition-colors focus:outline-none focus-visible:ring-2
                focus-visible:ring-green-500 ${
                  form.avaliacao >= n ? "text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Mensagem */}
      <div>
        <label
          htmlFor="fb-mensagem"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Mensagem * <span className="text-gray-400 font-normal">(10–500 caracteres)</span>
        </label>
        <textarea
          id="fb-mensagem"
          value={form.mensagem}
          onChange={(e) => atualizar("mensagem", e.target.value)}
          maxLength={500}
          required
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-green-500 resize-none
                     dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Escreva seu comentário sobre o site..."
        />
        <p className="text-xs text-gray-400 text-right mt-0.5">
          {form.mensagem.length}/500
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={carregando}
          className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white
                     hover:bg-green-700 focus:outline-none focus-visible:ring-2
                     focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {carregando ? "Enviando…" : inicial ? "Salvar alterações" : "Enviar feedback"}
        </button>
        {aoCancel && (
          <button
            type="button"
            onClick={aoCancel}
            disabled={carregando}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium
                       text-gray-700 hover:bg-gray-100 focus:outline-none
                       focus-visible:ring-2 focus-visible:ring-gray-400
                       dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700
                       transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function FeedbackSection({ t, isDark }) {
  const [feedbacks, setFeedbacks]       = useState([]);
  const [meuIds, setMeuIds]             = useState(() => getMeusFeedbacks());
  const [carregando, setCarregando]     = useState(false);
  const [enviando, setEnviando]         = useState(false);
  const [editandoId, setEditandoId]     = useState(null); // ID do feedback em edição
  const [erro, setErro]                 = useState(null);
  const [sucesso, setSucesso]           = useState(null);

  // ── Busca todos os feedbacks do banco ──────────────────────────────────────
  const carregarFeedbacks = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setFeedbacks(json.dados || []);
    } catch (err) {
      setErro("Não foi possível carregar os feedbacks. Verifique se o servidor está rodando.");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Carrega ao montar o componente
  useEffect(() => {
    carregarFeedbacks();
  }, [carregarFeedbacks]);

  // ── CREATE ─────────────────────────────────────────────────────────────────
  async function criarFeedback(form, setErros) {
    setEnviando(true);
    setSucesso(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok) {
        setErros(json.erros || [json.mensagem || "Erro ao enviar."]);
        return;
      }

      // Registra o ID no localStorage para habilitar Editar/Excluir
      adicionarMeuFeedback(json.dados.id);
      setMeuIds(getMeusFeedbacks());

      setSucesso("✅ Feedback enviado com sucesso!");
      await carregarFeedbacks();
    } catch {
      setErros(["Erro de conexão com o servidor."]);
    } finally {
      setEnviando(false);
    }
  }

  // ── UPDATE ─────────────────────────────────────────────────────────────────
  async function atualizarFeedback(id, form, setErros) {
    setEnviando(true);
    setSucesso(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (!res.ok) {
        setErros(json.erros || [json.mensagem || "Erro ao atualizar."]);
        return;
      }

      setEditandoId(null);
      setSucesso("✅ Feedback atualizado com sucesso!");
      await carregarFeedbacks();
    } catch {
      setErros(["Erro de conexão com o servidor."]);
    } finally {
      setEnviando(false);
    }
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  async function deletarFeedback(id) {
    if (!window.confirm("Tem certeza que deseja excluir este feedback?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      removerMeuFeedback(id);
      setMeuIds(getMeusFeedbacks());
      setSucesso("🗑️ Feedback excluído.");
      await carregarFeedbacks();
    } catch {
      setErro("Erro ao excluir o feedback.");
    }
  }

  // ─── Renderização ─────────────────────────────────────────────────────────
  return (
    <section
      id="feedback"
      aria-labelledby="feedback-titulo"
      className="py-16 px-4 bg-white dark:bg-gray-900"
    >
      <div className="max-w-2xl mx-auto">
        {/* Cabeçalho */}
        <h2
          id="feedback-titulo"
          className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2"
        >
          💬 {t?.feedback?.titulo || "Deixe seu Feedback"}
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
          {t?.feedback?.subtitulo || "Sua opinião nos ajuda a melhorar o site!"}
        </p>

        {/* ── Formulário de CRIAÇÃO ──────────────────────────────────────── */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 mb-10
                        dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Novo feedback
          </h3>
          <FeedbackForm
            aoSubmeter={criarFeedback}
            carregando={enviando}
          />
        </div>

        {/* Mensagem de sucesso */}
        {sucesso && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 rounded-lg bg-green-50 border border-green-300 px-4 py-3
                       text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300"
          >
            {sucesso}
          </div>
        )}

        {/* ── Lista de feedbacks (READ) ──────────────────────────────────── */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📋 Comentários ({feedbacks.length})
          </h3>

          {/* Erro de carregamento */}
          {erro && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-300 px-4 py-3
                         text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300 mb-4"
            >
              {erro}
            </div>
          )}

          {/* Carregando */}
          {carregando && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8" aria-live="polite">
              Carregando feedbacks…
            </p>
          )}

          {/* Lista vazia */}
          {!carregando && feedbacks.length === 0 && !erro && (
            <p className="text-center text-gray-400 dark:text-gray-500 py-8 text-sm">
              Nenhum feedback ainda. Seja o primeiro! ⚽
            </p>
          )}

          {/* Feedbacks */}
          <ul className="space-y-4" aria-label="Lista de feedbacks">
            {feedbacks.map((fb, index) => {
              const ehMeu = meuIds.includes(fb.id);
              const estaEditando = editandoId === fb.id;

              return (
                <li
                  key={fb.id}
                  className="rounded-2xl border bg-white p-5 shadow-sm
                             dark:border-gray-700 dark:bg-gray-800
                             transition-shadow hover:shadow-md"
                >
                  {estaEditando ? (
                    /* ── Modo edição (UPDATE) ──────────────────────────── */
                    <div>
                      <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-3">
                        ✏️ Editando feedback #{fb.id}
                      </p>
                      <FeedbackForm
                        inicial={{
                          nome: fb.nome,
                          email: fb.email,
                          mensagem: fb.mensagem,
                          avaliacao: fb.avaliacao,
                        }}
                        aoSubmeter={(form, setErros) =>
                          atualizarFeedback(fb.id, form, setErros)
                        }
                        aoCancel={() => setEditandoId(null)}
                        carregando={enviando}
                      />
                    </div>
                  ) : (
                    /* ── Modo visualização (READ) ──────────────────────── */
                    <>
                      {/* Cabeçalho do card */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            {/* Numeração visível conforme requisito da professora */}
                            <span className="text-gray-400 font-normal mr-1">
                              Comentário {feedbacks.length - index}:
                            </span>
                            {fb.nome}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {fb.email}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Estrelas avaliacao={fb.avaliacao} />
                          <time
                            className="text-xs text-gray-400"
                            dateTime={fb.criado_em}
                          >
                            {new Date(fb.criado_em).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                      </div>

                      {/* Mensagem */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {fb.mensagem}
                      </p>

                      {/* Botões Editar / Excluir — apenas para feedbacks do usuário */}
                      {ehMeu && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <span className="text-xs text-green-600 dark:text-green-400 mr-auto font-medium">
                            ✓ Seu feedback
                          </span>
                          <button
                            onClick={() => setEditandoId(fb.id)}
                            aria-label={`Editar feedback de ${fb.nome}`}
                            className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1
                                       text-xs font-medium text-amber-700 hover:bg-amber-100
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                                       dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300
                                       transition-colors"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => deletarFeedback(fb.id)}
                            aria-label={`Excluir feedback de ${fb.nome}`}
                            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1
                                       text-xs font-medium text-red-700 hover:bg-red-100
                                       focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400
                                       dark:border-red-700 dark:bg-red-900/30 dark:text-red-300
                                       transition-colors"
                          >
                            🗑️ Excluir
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
