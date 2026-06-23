# NexusAI — Production-Grade AI Chat SaaS Platform

A fully-featured, production-ready AI chat platform built with React + Vite + Tailwind CSS, powered by Groq (Llama 3.3 70B).

## Features

- **Multi-session chat management** — Create, switch, rename, and delete independent conversation threads
- **Auto-naming** — Thread titles auto-generate from the first message
- **LocalStorage persistence** — Full chat history survives page refreshes
- **Time-categorized sidebar** — Threads grouped by Today / Yesterday / Last 7 Days / Last 30 Days
- **Voice input (STT)** — Mic button using the Web Speech API (`webkitSpeechRecognition`)
- **Text-to-speech (TTS)** — Speaker button on every AI response using `window.speechSynthesis`
- **Rich Markdown rendering** — Lists, tables, bold, code, blockquotes via `react-markdown`
- **Code blocks** — Language label header + functional "Copy" button with 2-second confirmation
- **Syntax highlighting** — via `react-syntax-highlighter` (VSCode Dark+ theme)
- **Skeleton loading** — Animated typing indicator while waiting for the API
- **Example prompt grid** — Beautiful empty state with 6 clickable prompt starters
- **Fully responsive** — Mobile sidebar drawer, desktop persistent sidebar

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Groq API key

Create a `.env.local` file in the **project root** (same folder as `package.json`) and add:

```env
VITE_GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

Get a **free** API key at: https://console.groq.com

> ⚠️ Make sure the file is named `.env.local` (dot, not underscore). After creating or editing this file, restart the dev server.

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx        — Sidebar with thread list, new chat, clear all
│   ├── ChatWindow.jsx     — Main chat area with header and scroll
│   ├── MessageBubble.jsx  — User/AI/Error message bubbles + TTS/Copy
│   ├── ChatInput.jsx      — Input bar with voice input + send button
│   ├── CodeBlock.jsx      — Code blocks with language label + copy
│   └── EmptyState.jsx     — Landing screen with example prompts
├── hooks/
│   ├── useThreads.js           — Thread CRUD + LocalStorage state
│   ├── useGroqAPI.js           — Groq API request logic
│   └── useSpeechRecognition.js — Web Speech API wrapper
├── utils/
│   └── threadUtils.js     — Thread creation, persistence, categorization
├── constants.js           — API URL, example prompts, storage keys
├── App.jsx                — Root orchestrator component
├── main.jsx               — React entry point
└── index.css              — Global styles + Tailwind + animations
```

## Tech Stack

- **React 19** with hooks (useState, useEffect, useRef, useCallback, useMemo)
- **Vite** — Lightning-fast bundler
- **Tailwind CSS v4** — Utility-first styling
- **react-markdown** — Markdown rendering
- **react-syntax-highlighter** — Code syntax highlighting
- **Groq API** — Ultra-fast LLM inference (Llama 3.3 70B Versatile)
- **Web Speech API** — Browser-native STT/TTS (no external library)
- **localStorage** — Zero-backend persistence

## Notes

- The Groq API key is visible in the browser. For production, proxy calls through a backend.
- Voice input requires HTTPS or localhost.
- TTS voice quality depends on the user's OS and installed voices.
- Groq's free tier has generous rate limits suitable for development and personal use.
