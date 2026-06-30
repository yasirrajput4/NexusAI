# NexusAI — AI Chat SaaS Platform

A production-ready AI chat platform built entirely on the frontend — no custom backend server, no database to manage, no infrastructure to deploy. Just React, Vite, and Groq's API, shipped as a static site.

**🔗 Live Demo:** https://nexus-ai-five-wine.vercel.app/
**💻 GitHub:** https://github.com/yasirrajput4/NexusAI

---

## Why frontend-only?

This isn't a limitation — it's a deliberate architecture choice.

NexusAI proves that a full-featured, multi-session AI chat product can be built and shipped without standing up a server: no Express, no Node API routes, and no database. Session state, history, and persistence all live in the browser using `localStorage`, while AI inference is handled directly by Groq's API from the client.

The tradeoff is that the API key is exposed in the browser, which is acceptable for personal projects, demos, and prototypes. For a production-ready multi-tenant SaaS product, requests should go through a lightweight backend proxy to keep the API key secure and support authentication, authorization, and rate limiting. This tradeoff is intentional and documented rather than being an oversight.

---

## Features

- **Multi-session chat management** — Create, switch, rename, and delete independent conversation threads.
- **Auto-naming** — Thread titles are automatically generated from the first user message.
- **LocalStorage persistence** — Chat history survives page refreshes without any backend.
- **Time-categorized sidebar** — Conversations grouped by Today, Yesterday, Last 7 Days, and Last 30 Days.
- **Voice input (STT)** — Speech-to-text using the Web Speech API (`webkitSpeechRecognition`).
- **Text-to-speech (TTS)** — Listen to AI responses using `window.speechSynthesis`.
- **Rich Markdown rendering** — Supports lists, tables, blockquotes, bold text, and more using `react-markdown`.
- **Code blocks** — Language header with one-click copy functionality.
- **Syntax highlighting** — Powered by `react-syntax-highlighter` using the VSCode Dark+ theme.
- **Skeleton loading** — Animated loading state while waiting for AI responses.
- **Example prompt grid** — Six clickable starter prompts for first-time users.
- **Fully responsive** — Optimized for desktop, tablet, and mobile devices.

---

## Tech Stack

| Layer               | Technology                         |
| ------------------- | ---------------------------------- |
| Framework           | React 19                           |
| Build Tool          | Vite                               |
| Styling             | Tailwind CSS v4                    |
| AI Model            | Groq API — Llama 3.3 70B Versatile |
| Markdown Rendering  | react-markdown                     |
| Syntax Highlighting | react-syntax-highlighter           |
| Voice Features      | Web Speech API                     |
| State Persistence   | localStorage                       |
| Deployment          | Vercel                             |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yasirrajput4/NexusAI.git
cd NexusAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Groq API key

Create a `.env.local` file in the project root.

```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxx
```

You can obtain a free API key from:

https://console.groq.com

> **Note:** The file must be named `.env.local`. Restart the development server after creating or updating it.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

---

## Project Structure

```text
src/
├── components/
│   ├── Sidebar.jsx
│   ├── ChatWindow.jsx
│   ├── MessageBubble.jsx
│   ├── ChatInput.jsx
│   ├── CodeBlock.jsx
│   └── EmptyState.jsx
│
├── hooks/
│   ├── useThreads.js
│   ├── useGroqAPI.js
│   └── useSpeechRecognition.js
│
├── utils/
│   └── threadUtils.js
│
├── constants.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## Known Tradeoffs & Notes

- **API key exposure:** Since this is a frontend-only application, the Groq API key is included in the browser bundle using the `VITE_` environment variable. This is acceptable for demos and personal projects but should be replaced with a backend proxy in production.
- **Voice input:** Speech recognition requires HTTPS or `localhost`.
- **Text-to-speech:** Voice quality depends on the operating system and installed voices.
- **Rate limits:** Groq's free tier is suitable for development and personal use but is not intended for high-traffic production workloads.

---

## License

This project is licensed under the MIT License.
