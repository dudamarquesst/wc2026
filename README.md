# Copa do Mundo FIFA 2026

> Site informativo, moderno e acessível sobre a Copa do Mundo FIFA 2026
> · Projeto Final Full Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss)
![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E?logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express)
![SQLite](https://img.shields.io/badge/SQLite-node:sqlite-003B57?logo=sqlite)
![Helmet](https://img.shields.io/badge/Helmet-XSS_Protection-green)

**Deploy:** [dudamarquesst.github.io/wc2026](https://dudamarquesst.github.io/wc2026/)  
**Backend:** [wc2026-0zo4.onrender.com](https://wc2026-0zo4.onrender.com/api/health)  
**Branch do backend:** `feature/backend-sqlite`

---

## Equipe

| Membro | GitHub |
|---|---|
| Maria Eduarda Marques | [@dudamarquesst](https://github.com/dudamarquesst) |
| Jorge Murilo | [@jorgemuriloceub](https://github.com/jorgemuriloceub) |
| Miguel Moura | [@filemoura](https://github.com/filemoura) |
| Lucas Gabriel | [@LucasGabrielPaes](https://github.com/LucasGabrielPaes) |

---

## Arquitetura do Projeto

O sistema segue o modelo **Cliente-Servidor** com três camadas:

```
Frontend (React + Vite)  →  Backend (Node.js + Express)  →  Banco de Dados (SQLite)
     GitHub Pages              Render (porta 3001)              database.db
```

- **Frontend:** Interface construída em React 19 + Vite + Tailwind CSS, hospedada no GitHub Pages. Faz requisições HTTP ao backend usando `fetch()`.
- **Backend:** API REST construída em Node.js com o framework Express. Processa as requisições, aplica validações de segurança e persiste os dados.
- **Banco de Dados:** SQLite gerenciado diretamente com o módulo nativo `node:sqlite` (built-in do Node 22+), sem ORM externo.

---

## 1. Como Rodar

### Pré-requisitos
- Node.js v22 ou superior
- Git

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/dudamarquesst/wc2026.git
cd wc2026

# 2. Mude para a branch do backend
git checkout feature/backend-sqlite

# 3. Instale as dependências do frontend
npm install

# 4. Instale as dependências do backend
cd backend
npm install
cd ..
```

### Rodando localmente (dois terminais)

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```
O servidor sobe em `http://localhost:3001`. O arquivo `database.db` é criado automaticamente na primeira execução.

**Terminal 2 — Frontend:**
```bash
npm run dev
```
O site abre em `http://localhost:5173`.

### Testando os endpoints via curl

```bash
# Listar feedbacks (READ)
curl http://localhost:3001/api/feedbacks

# Criar feedback (CREATE)
curl -X POST http://localhost:3001/api/feedbacks \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","mensagem":"Site incrível!","avaliacao":5}'

# Editar feedback (UPDATE) — substitua 1 pelo ID real
curl -X PUT http://localhost:3001/api/feedbacks/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","mensagem":"Mensagem editada","avaliacao":4}'

# Excluir feedback (DELETE) — substitua 1 pelo ID real
curl -X DELETE http://localhost:3001/api/feedbacks/1
```

---

## 2. CRUD de Feedbacks

O sistema implementa as quatro operações do CRUD completo:

| Operação | Método HTTP | Rota | Descrição |
|---|---|---|---|
| **Create** | `POST` | `/api/feedbacks` | Usuário envia novo feedback pelo formulário |
| **Read** | `GET` | `/api/feedbacks` | Feedbacks são listados na tela como "Comentário 1: ...", "Comentário 2: ..." |
| **Update** | `PUT` | `/api/feedbacks/:id` | Usuário edita seu próprio feedback (identificado pelo localStorage) |
| **Delete** | `DELETE` | `/api/feedbacks/:id` | Usuário remove seu próprio feedback |

### Como o "dono do feedback" é identificado sem login

Quando o usuário envia um feedback, o `id` retornado pelo servidor é salvo no array `wc2026_meus_feedbacks` no `localStorage` do navegador. Na listagem, os botões **Editar** e **Excluir** só aparecem se `meuIds.includes(fb.id)` for verdadeiro — sem necessidade de sistema de autenticação.

---

## 3. Análise de Vulnerabilidade XSS

### O risco

Um ataque **XSS (Cross-Site Scripting)** ocorre quando um usuário mal-intencionado insere código JavaScript no formulário de feedback, como:

```html
<script>alert('Hackeado!')</script>
```

Se esse texto fosse salvo no banco sem tratamento e exibido usando `innerHTML` no frontend, o script seria **executado no navegador de todos os usuários** que acessassem a página — podendo roubar cookies, redirecionar para sites falsos ou capturar dados sensíveis.

### A resolução

O projeto aplica **dois níveis de proteção**:

#### Nível 1 — Backend: sanitização manual + Helmet

No `backend/server.js`, a função `sanitize()` escapa os caracteres perigosos **antes de qualquer dado ser salvo no banco**:

```js
function sanitize(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")   // < vira &lt; — scripts não executam
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}
```

Além disso, o pacote **`helmet`** configura automaticamente cabeçalhos HTTP de segurança:
- `Content-Security-Policy` — bloqueia execução de scripts externos
- `X-XSS-Protection` — ativa o filtro XSS do navegador
- `X-Frame-Options` — previne clickjacking
- `Strict-Transport-Security` — força HTTPS

#### Nível 2 — Frontend: React usa `textContent` por padrão

O componente `FeedbackSection.jsx` exibe os feedbacks usando JSX (`{fb.mensagem}`), que o React renderiza internamente via `textContent` — **nunca via `innerHTML`**. Isso significa que mesmo que um script passasse pelo backend, seria exibido como texto puro, não como código executável.

#### Resultado

| Cenário | Sem proteção | Com proteção |
|---|---|---|
| Usuário envia `<script>alert('x')</script>` | Script executa para todos | Exibido como texto: `&lt;script&gt;alert('x')&lt;/script&gt;` |
| Ataque via cabeçalhos HTTP | Vulnerável | Bloqueado pelo Helmet |

---

## 4. Stack Tecnológica

### Frontend
- React 19 + Vite 8
- Tailwind CSS v4
- 7 idiomas (pt-BR, en-US, es-MX, fr-FR, de-DE, ja-JP, ar-SA) com suporte RTL
- Acessibilidade WCAG 2.1 AA
- Text-to-Speech (Web Speech API)
- Notificações (Browser Notification API)

### Backend
- Node.js v24 + Express 4
- `node:sqlite` (módulo nativo — sem dependências externas de banco)
- `helmet` para segurança HTTP
- `cors` configurado para GitHub Pages + Codespaces

### Deploy
- Frontend: GitHub Pages (via `gh-pages`)
- Backend: Render (Free tier, branch `feature/backend-sqlite`)

---

## 5. Estrutura de Arquivos

```
wc2026/
├── backend/                  # Servidor Node.js
│   ├── server.js             # API REST com rotas CRUD
│   ├── package.json          # Dependências do backend
│   └── database.db           # Banco SQLite (criado automaticamente)
├── src/
│   ├── WorldCup2026.jsx      # Componente principal
│   ├── FeedbackSection.jsx   # CRUD completo de feedbacks
│   ├── LiveScores.jsx        # Placares em tempo real (worldcup26.ir)
│   ├── StadiumGallery.jsx    # Galeria dos 16 estádios
│   ├── BracketSimulator.jsx  # Simulador de chaveamento
│   ├── MatchCalendar.jsx     # Calendário de jogos
│   ├── GameAlert.jsx         # Alertas por time favorito
│   ├── CupQuiz.jsx           # Quiz com 20 perguntas
│   ├── ChampionsHistory.jsx  # Histórico de campeões
│   └── WeatherWidget.jsx     # Widget de clima (Open-Meteo)
├── vite.config.js            # Proxy /api → localhost:3001
└── package.json
```

---

## 6. Uso de Inteligência Artificial

Conforme as diretrizes do CEUB, declaramos o uso de IA no desenvolvimento deste projeto:

- **Ferramenta utilizada:** Claude (Anthropic)
- **Onde foi utilizado:** Auxílio na estruturação do `server.js` (rotas CRUD, função de sanitização XSS, configuração do CORS), no componente `FeedbackSection.jsx` e na resolução de incompatibilidades de versão (Node v24 + `better-sqlite3` → migração para `node:sqlite`).
- **O que foi desenvolvido pela equipe:** Concepção do projeto, definição da stack, estrutura visual do frontend, componentes de funcionalidades (estádios, simulador, calendário, quiz, clima), integração da API de placares, deploy no GitHub Pages e Render, e toda a tomada de decisão arquitetural.
