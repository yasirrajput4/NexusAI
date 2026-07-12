<div align="center">

<img src="https://nexus-ai-five-wine.vercel.app/favicon.ico" width="60" height="60" alt="NexusAI Logo" />

# NexusAI

### A production-grade AI chat platform — fully frontend, zero backend.

Built with React 19 + Vite + Tailwind CSS v4, powered by Groq's ultra-fast Llama 3.3 70B inference.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://nexus-ai-five-wine.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/yasirrajput4/NexusAI)
[![License](https://img.shields.io/badge/License-MIT-violet?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)

![NexusAI Screenshot](https://github.com/user-attachments/assets/f7541950-c89f-4fef-b3d3-cee59c66eeff)

</div>

---

## Why frontend-only?

This isn't a limitation — it's a deliberate architecture choice.

NexusAI proves that a full-featured, multi-session AI chat product can be built and shipped without standing up a single server. No Express, no Node API routes, no database. Session state, history, and persistence all live in the browser via `localStorage`, while AI inference is handled directly by Groq's API from the client.

> **Tradeoff acknowledged:** The API key ships in the browser bundle — acceptable for personal projects and demos. For a production multi-tenant SaaS, route requests through a lightweight backend proxy (e.g. a Vercel serverless function) to keep the key server-side and add auth + rate limiting.

---

## Features

### Core Chat

| Feature                  | Details                                                      |
| ------------------------ | ------------------------------------------------------------ |
| Multi-session threads    | Create, switch, rename, and delete independent conversations |
| Auto-naming              | Thread titles auto-generated from the first user message     |
| LocalStorage persistence | Full chat history survives page refreshes — zero backend     |
| Time-categorized sidebar | Grouped by Today, Yesterday, Last 7 Days, Last 30 Days       |

### AI & Voice

| Feature              | Details                                                       |
| -------------------- | ------------------------------------------------------------- |
| Voice input (STT)    | Speech-to-text via Web Speech API (`webkitSpeechRecognition`) |
| Text-to-speech (TTS) | Listen to any AI response via `window.speechSynthesis`        |
| Groq inference       | Llama 3.3 70B Versatile — one of the fastest LLMs available   |

### UI & Rendering

| Feature                 | Details                                                            |
| ----------------------- | ------------------------------------------------------------------ |
| Rich Markdown rendering | Lists, tables, blockquotes, bold, inline code via `react-markdown` |
| Code blocks             | Language label header + one-click copy button                      |
| Syntax highlighting     | VSCode Dark+ theme via `react-syntax-highlighter`                  |
| Skeleton loading        | Animated typing indicator while awaiting API response              |
| Fully responsive        | Mobile sidebar drawer + desktop persistent layout                  |

---

## Tech Stack

| Layer               | Technology                                       |
| ------------------- | ------------------------------------------------ |
| Library             | React 19                                         |
| Build Tool          | Vite 6                                           |
| Styling             | Tailwind CSS v4                                  |
| AI Inference        | Groq API — Llama 3.3 70B Versatile               |
| Markdown            | react-markdown                                   |
| Syntax Highlighting | react-syntax-highlighter                         |
| Voice I/O           | Web Speech API (native browser, no external lib) |
| Persistence         | localStorage                                     |
| Deployment          | Vercel                                           |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/yasirrajput4/NexusAI.git
cd NexusAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxx
```

> **Note:** The file must be named `.env.local` (not `.env`). Restart the dev server after creating or editing it. Never commit this file — it's already in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

---

## Project Structure

```
NexusAI/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx          # Thread list, new chat, rename, delete, clear all
│   │   ├── ChatWindow.jsx       # Main chat area — header, scroll, empty state layout
│   │   ├── MessageBubble.jsx    # User / AI / Error bubbles with TTS + copy
│   │   ├── ChatInput.jsx        # Auto-resize input with voice mic + send button
│   │   ├── CodeBlock.jsx        # Code renderer with language badge + copy button
│   │   └── EmptyState.jsx       # Centered hero shown on new/empty threads
│   │
│   ├── hooks/
│   │   ├── useThreads.js            # Thread CRUD + localStorage sync + auto-naming
│   │   ├── useGroqAPI.js            # Groq API fetch wrapper with error state
│   │   └── useSpeechRecognition.js  # Web Speech API — start / stop / toggle
│   │
│   ├── utils/
│   │   └── threadUtils.js       # generateId, categorizeThreads, buildPayload, stripMarkdown
│   │
│   ├── constants.js             # API config, storage keys
│   ├── App.jsx                  # Root component — wires all hooks and layouts
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles, Tailwind, custom animations
│
├── .env.local                   # Your API key (never commit)
├── .gitignore
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Architecture Overview

```
Browser
│
├── React App (Vite static bundle)
│   ├── State: useThreads hook → localStorage
│   ├── Voice: useSpeechRecognition → Web Speech API
│   └── UI: Sidebar + ChatWindow + MessageBubble
│
└── API Calls
    └── Groq REST API (client-side fetch)
        └── Model: llama-3.3-70b-versatile
```

No server. No database. No auth layer. Just a static site talking directly to an AI API.

---

## Known Tradeoffs

| Tradeoff           | Details                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| API key in browser | Exposed via `VITE_` prefix. Fine for demos; use a backend proxy for production. |
| Voice input        | Requires HTTPS or `localhost` — won't work on plain HTTP.                       |
| TTS voice quality  | Depends on the user's OS and installed system voices.                           |
| Rate limits        | Groq free tier is generous for personal use, not for high-traffic production.   |
| No auth            | All threads are local to the browser — no user accounts or sync across devices. |

---

## Roadmap

- [ ] Streaming responses (token-by-token rendering)
- [ ] Backend proxy for secure API key handling
- [ ] Export chat as Markdown or PDF
- [ ] Custom system prompt per thread
- [ ] Model switcher (Llama, Mixtral, Gemma)
- [ ] PWA support for offline access

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  <p>Built by <a href="https://github.com/yasirrajput4">Yasir Rajput</a></p>
  <p>
    <a href="https://nexus-ai-five-wine.vercel.app">Live Demo</a> ·
    <a href="https://github.com/yasirrajput4/NexusAI/issues">Report Bug</a> ·
    <a href="https://github.com/yasirrajput4/NexusAI/issues">Request Feature</a>
  </p>
</div>
