/**
 * server.js — Backend da Copa do Mundo 2026
 * Stack: Node.js + Express + node:sqlite (built-in) + helmet
 *
 * node:sqlite é o módulo SQLite embutido no Node 22+/24+.
 * Não precisa de compilação nativa — funciona em qualquer versão moderna.
 */

const express         = require("express");
const { DatabaseSync } = require("node:sqlite"); // ← built-in, sem npm install
const helmet          = require("helmet");
const cors            = require("cors");
const path            = require("path");

// ─── Configurações ────────────────────────────────────────────────────────────
const PORT    = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, "database.db");

// ─── Inicializa o banco de dados ──────────────────────────────────────────────
const db = new DatabaseSync(DB_PATH);

// Cria a tabela se ainda não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT    NOT NULL,
    email     TEXT    NOT NULL,
    mensagem  TEXT    NOT NULL,
    avaliacao INTEGER NOT NULL CHECK(avaliacao BETWEEN 1 AND 5),
    criado_em TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);

console.log("✅ Banco de dados SQLite (node:sqlite built-in) conectado em:", DB_PATH);

// ─── Sanitização de input (proteção XSS manual) ───────────────────────────────
function sanitize(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

// ─── Validação dos campos de feedback ────────────────────────────────────────
function validarFeedback({ nome, email, mensagem, avaliacao }) {
  const erros = [];

  if (!nome || nome.trim().length < 2)
    erros.push("Nome deve ter ao menos 2 caracteres.");
  if (nome && nome.trim().length > 100)
    erros.push("Nome deve ter no máximo 100 caracteres.");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim()))
    erros.push("E-mail inválido.");
  if (email && email.trim().length > 150)
    erros.push("E-mail deve ter no máximo 150 caracteres.");

  if (!mensagem || mensagem.trim().length < 10)
    erros.push("Mensagem deve ter ao menos 10 caracteres.");
  if (mensagem && mensagem.trim().length > 500)
    erros.push("Mensagem deve ter no máximo 500 caracteres.");

  const nota = Number(avaliacao);
  if (!avaliacao || isNaN(nota) || nota < 1 || nota > 5)
    erros.push("Avaliação deve ser um número entre 1 e 5.");

  return erros;
}

// ─── Inicializa o Express ─────────────────────────────────────────────────────
const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      /\.app\.github\.dev$/,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "10kb" }));

// ─── Rota de saúde ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── READ — GET /api/feedbacks ────────────────────────────────────────────────
app.get("/api/feedbacks", (req, res) => {
  try {
    const feedbacks = db
      .prepare(
        `SELECT id, nome, email, mensagem, avaliacao, criado_em
         FROM feedbacks
         ORDER BY id DESC`
      )
      .all();

    res.json({ sucesso: true, dados: feedbacks });
  } catch (error) {
    console.error("Erro ao buscar feedbacks:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
  }
});

// ─── CREATE — POST /api/feedbacks ────────────────────────────────────────────
app.post("/api/feedbacks", (req, res) => {
  const { nome, email, mensagem, avaliacao } = req.body;

  const erros = validarFeedback({ nome, email, mensagem, avaliacao });
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, erros });
  }

  const nomeSeguro     = sanitize(nome);
  const emailSeguro    = sanitize(email);
  const mensagemSegura = sanitize(mensagem);
  const avaliacaoInt   = Number(avaliacao);

  try {
    const resultado = db
      .prepare(
        `INSERT INTO feedbacks (nome, email, mensagem, avaliacao)
         VALUES (?, ?, ?, ?)`
      )
      .run(nomeSeguro, emailSeguro, mensagemSegura, avaliacaoInt);

    const novoFeedback = db
      .prepare(`SELECT * FROM feedbacks WHERE id = ?`)
      .get(resultado.lastInsertRowid);

    res.status(201).json({ sucesso: true, dados: novoFeedback });
  } catch (error) {
    console.error("Erro ao criar feedback:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
  }
});

// ─── UPDATE — PUT /api/feedbacks/:id ─────────────────────────────────────────
app.put("/api/feedbacks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: "ID inválido." });
  }

  const { nome, email, mensagem, avaliacao } = req.body;

  const erros = validarFeedback({ nome, email, mensagem, avaliacao });
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, erros });
  }

  const feedbackExistente = db
    .prepare(`SELECT id FROM feedbacks WHERE id = ?`)
    .get(id);

  if (!feedbackExistente) {
    return res.status(404).json({ sucesso: false, mensagem: "Feedback não encontrado." });
  }

  const nomeSeguro     = sanitize(nome);
  const emailSeguro    = sanitize(email);
  const mensagemSegura = sanitize(mensagem);
  const avaliacaoInt   = Number(avaliacao);

  try {
    db.prepare(
      `UPDATE feedbacks
       SET nome = ?, email = ?, mensagem = ?, avaliacao = ?
       WHERE id = ?`
    ).run(nomeSeguro, emailSeguro, mensagemSegura, avaliacaoInt, id);

    const feedbackAtualizado = db
      .prepare(`SELECT * FROM feedbacks WHERE id = ?`)
      .get(id);

    res.json({ sucesso: true, dados: feedbackAtualizado });
  } catch (error) {
    console.error("Erro ao atualizar feedback:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
  }
});

// ─── DELETE — DELETE /api/feedbacks/:id ──────────────────────────────────────
app.delete("/api/feedbacks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ sucesso: false, mensagem: "ID inválido." });
  }

  const feedbackExistente = db
    .prepare(`SELECT id FROM feedbacks WHERE id = ?`)
    .get(id);

  if (!feedbackExistente) {
    return res.status(404).json({ sucesso: false, mensagem: "Feedback não encontrado." });
  }

  try {
    db.prepare(`DELETE FROM feedbacks WHERE id = ?`).run(id);
    res.json({ sucesso: true, mensagem: `Feedback #${id} removido com sucesso.` });
  } catch (error) {
    console.error("Erro ao deletar feedback:", error);
    res.status(500).json({ sucesso: false, mensagem: "Erro interno do servidor." });
  }
});

// ─── Rota não encontrada ──────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ sucesso: false, mensagem: "Rota não encontrada." });
});

// ─── Inicia o servidor ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponíveis:`);
  console.log(`   GET    http://localhost:${PORT}/api/feedbacks`);
  console.log(`   POST   http://localhost:${PORT}/api/feedbacks`);
  console.log(`   PUT    http://localhost:${PORT}/api/feedbacks/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/feedbacks/:id`);
});
