# Copa do Mundo FIFA 2026

> Site informativo, moderno e acessível sobre a Copa do Mundo FIFA 2026.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat&logo=tailwindcss)
![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E?style=flat&logo=javascript)
![WCAG](https://img.shields.io/badge/Acessibilidade-WCAG_2.1_AA-22c55e?style=flat)

---

## Sobre o Projeto

Este projeto foi desenvolvido como um site informativo completo sobre a **Copa do Mundo FIFA 2026**, a maior edição da história do torneio, com 48 seleções, 12 grupos, 16 cidades e 104 jogos disputados em 3 países sede.

O site foi construído com foco em **acessibilidade**, **responsividade mobile-first** e **experiência do usuário**, seguindo as diretrizes WCAG 2.1 AA.

---

## Funcionalidades

### Internacionalização
- Suporte a **7 idiomas**: Português 🇧🇷, Inglês 🇺🇸, Espanhol 🇲🇽, Francês 🇫🇷, Alemão 🇩🇪, Japonês 🇯🇵 e Árabe 🇸🇦
- Suporte a layout **RTL** (Árabe)

### Acessibilidade
- Leitura em voz alta com a **Web Speech API** em todos os idiomas citados
- Navegação completa por teclado com `focus-visible`
- Atributos ARIA dinâmicos (`aria-live`, `aria-expanded`, `aria-label`)
- Link de "Pular para o conteúdo principal"
- Hierarquia semântica de cabeçalhos (`h1` → `h3`)

### Tema
- Modo **claro e escuro** com alternância via botão na navbar
- Paleta de cores baseada na identidade visual da Copa 2026 (Verde, Azul e Dourado)

### Contagem Regressiva
- Countdown em tempo real para a abertura do torneio
- Atualização acessível via `aria-live="polite"`

### Filtro de Grupos e Sedes
- Filtro dinâmico por **Grupo (A–L)** ou **País Sede**
- Exibe seleções por grupo e estádios por país sede

### Galeria de Estádios
- Galeria interativa com os **16 estádios** da Copa
- Filtro por país (EUA, Canadá, México)
- Modal detalhado com foto, capacidade, arquiteto e descrição histórica
- Navegação pelo teclado tab(← →) e fechamento com `Escape`

### Calendário de Jogos
- **72 jogos** da fase de grupos com datas, horários, estádio e cidade
- Filtro por grupo, rodada e busca por seleção
- Agrupamento visual por data

### Simulador de Fases
- Monte seu próprio chaveamento da Copa
- **Fase de Grupos**: escolha 1º, 2º e 3º de cada grupo
- **Fase Eliminatória**: oitavas → quartas → semis → final → campeão
- Barra de progresso por fase e botão de reset

### Alerta de Jogo
- Selecione sua **seleção favorita** e veja todos os seus jogos
- Contagem regressiva individual para cada partida
- Notificações nativas do browser via **Notification API**

### Quiz da Copa
- **20 perguntas** sobre história, recordes, estádios e Copa 2026
- Timer de 20 segundos por pergunta
- Sistema de sequência de acertos (🔥 streak)
- 3 níveis de dificuldade (Fácil, Médio, Difícil)
- Tela de resultado com revisão completa e opção de compartilhar

### Formulário de Feedback
- Avaliação por estrelas
- Validação de campos em tempo real
- Mensagens de erro acessíveis com `role="alert"`
- Totalmente traduzido nos 7 idiomas

---

## Tecnologias e Frameworks

| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 18 | Componentes, hooks e gerenciamento de estado |
| **Vite** | 5 | Bundler e servidor de desenvolvimento |
| **Tailwind CSS** | 4 | Estilização mobile-first e responsiva |
| **JavaScript (JSX)** | ESNext | Lógica e interface do site |
| **HTML5 Semântico** | — | Estrutura acessível (`header`, `main`, `section`, `article`, `footer`) |
| **Web Speech API** | Nativa | Leitura em voz alta |
| **Notification API** | Nativa | Alertas de jogo no browser |

---

## Estrutura de Arquivos

```
wc2026/
├── public/
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── WorldCup2026.jsx     # Componente principal + Layout + Navbar + Hero
│   ├── StadiumGallery.jsx   # Galeria interativa dos 16 estádios
│   ├── BracketSimulator.jsx # Simulador de chaveamento
│   ├── MatchCalendar.jsx    # Calendário dos 72 jogos da fase de grupos
│   ├── GameAlert.jsx        # Alerta de jogo por seleção favorita
│   ├── CupQuiz.jsx          # Quiz de trivia sobre a Copa
│   ├── main.jsx             # Ponto de entrada React
│   └── index.css            # Tailwind CSS
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Documentação

### Por que escolhemos este framework?

Escolhemos **React com Vite** por ser uma combinação moderna, rápida e amplamente utilizada no mercado. O React permite criar componentes reutilizáveis e gerenciar o estado da interface de forma simples, o que foi essencial para funcionalidades como o filtro por continente e os cards expansíveis do histórico de campeões. O Vite oferece um servidor de desenvolvimento extremamente rápido e build otimizado para produção. Além disso, utilizamos **Tailwind CSS** para estilização ágil e consistente, sem a necessidade de escrever CSS manualmente.

### Principais dificuldades técnicas encontradas

- **Integração com o ThemeContext:** Foi necessário entender como o contexto de tema (`ThemeContext`) já existente no projeto funcionava para que o componente `ChampionsHistory` respondesse corretamente ao modo claro e escuro.
- **Deploy no GitHub Pages:** O fluxo de build e deploy não era disparado automaticamente após o merge do Pull Request, exigindo a execução manual dos comandos `npm run build` e `npm run deploy` no terminal.
- **Tradução para múltiplos idiomas:** O projeto suporta 7 idiomas e a propriedade `navChampions` estava ausente em 5 deles (`es-MX`, `fr-FR`, `de-DE`, `ja-JP`, `ar-SA`), o que exigiu identificar e corrigir cada entrada manualmente no objeto `T`.


## Deploy

O site está publicado via **GitHub Pages**:

```
https://dudamarquesst.github.io/wc2026/
```

---

## Licença

Este projeto é um site informativo **não oficial** sobre a Copa do Mundo FIFA 2026, desenvolvido para fins educacionais.

---

<div align="center">
  Feito por Maria Eduarda, Miguel Moura, Lucas Gabriel e Jorge Murilo para a matéria de Desenvolvimento Web<br/>
  🇺🇸 Estados Unidos · 🇨🇦 Canadá · 🇲🇽 México
</div>
