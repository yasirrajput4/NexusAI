<div align="center">

# NexusAI

### Production-grade AI chat platform with authentication and persistent storage.

React 19 + Vite + Tailwind CSS v4 (frontend) · Express + MongoDB (backend) · Groq API (GPT-OSS 120B)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://nexus-ai-yasir.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/yasirrajput4/NexusAI)
[![License](https://img.shields.io/badge/License-MIT-violet?style=for-the-badge)](./LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)

![NexusAI Screenshot](https://github.com/user-attachments/assets/6e8d6bba-4dae-412a-b863-1e6647b7a06b)

</div>

---

## Architecture

```
Frontend (React → Vercel)
         ↓  JWT Token
Express Backend (Render)
    ↓              ↓
MongoDB Atlas    Groq API
(Users/Threads)  (GPT-OSS 120B)
```

---

## Features

### Auth

| Feature            | Details                                          |
| ------------------ | ------------------------------------------------ |
| Register / Login   | Email + password with JWT authentication         |
| Protected routes   | All chat and thread APIs require a valid token   |
| Persistent session | JWT stored in localStorage, verified on app load |

### Core Chat

| Feature               | Details                                                      |
| --------------------- | ------------------------------------------------------------ |
| Multi-session threads | Create, switch, rename, and delete independent conversations |
| Auto-naming           | Thread titles auto-generated from the first user message     |
| Cloud persistence     | Chat history synced to MongoDB — survives any device         |

### AI & Rendering

| Feature             | Details                                                          |
| ------------------- | ---------------------------------------------------------------- |
| Groq inference      | GPT-OSS 120B via Groq — secure server-side API key               |
| Rich Markdown       | Lists, tables, blockquotes, bold, inline code via react-markdown |
| Code blocks         | Language badge + one-click copy button                           |
| Syntax highlighting | VSCode Dark+ theme via react-syntax-highlighter                  |
| Skeleton loading    | Animated typing indicator while awaiting response                |

### UI

| Feature              | Details                                                  |
| -------------------- | -------------------------------------------------------- |
| Minimal chat layout  | Centered input on empty threads, ChatGPT-style           |
| Fully responsive     | Mobile sidebar drawer + desktop persistent layout        |
| User avatar + logout | Sidebar bottom shows logged-in user name + logout button |

---

## Tech Stack

| Layer               | Technology               |
| ------------------- | ------------------------ |
| Frontend Framework  | React 19                 |
| Build Tool          | Vite 6                   |
| Styling             | Tailwind CSS v4          |
| Backend             | Express.js + Node.js     |
| Database            | MongoDB Atlas + Mongoose |
| Authentication      | JWT + bcryptjs           |
| AI Inference        | Groq API — GPT-OSS 120B  |
| Markdown            | react-markdown           |
| Syntax Highlighting | react-syntax-highlighter |
| Frontend Hosting    | Vercel                   |
| Backend Hosting     | Render                   |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free)
- Groq API key (free) — https://console.groq.com

---

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/nexusai
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

---

### Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm start
```

---

## Deployment

### Backend → Render

1. Push `backend/` folder to GitHub (separate repo or monorepo)
2. New Web Service on render.com
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables (same as `.env` above)
6. Copy the Render URL: `https://your-app.onrender.com`

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Import project on vercel.com
3. Add Environment Variable:
   ```
   VITE_API_BASE_URL = https://your-app.onrender.com
   ```
4. Deploy

---

## Where to update the Render URL

After backend is deployed on Render, update these **3 places**:

| Location                                 | What to update                                    |
| ---------------------------------------- | ------------------------------------------------- |
| Vercel Dashboard → Environment Variables | `VITE_API_BASE_URL=https://your-app.onrender.com` |
| `backend/.env` → `FRONTEND_URL`          | `FRONTEND_URL=https://nexus-ai-yasir.vercel.app`  |
| Render Dashboard → Environment Variables | All backend `.env` values                         |

> **Important:** After updating `VITE_API_BASE_URL` on Vercel, redeploy the frontend — environment variables are baked in at build time.

---

## Project Structure

```
NexusAI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthPage.jsx       # Login / Register form
│   │   │   ├── ChatInput.jsx      # Auto-resize input + send button
│   │   │   ├── ChatWindow.jsx     # Main chat area with header + scroll
│   │   │   ├── CodeBlock.jsx      # Code renderer with language badge + copy
│   │   │   ├── EmptyState.jsx     # Centered hero on new/empty threads
│   │   │   ├── MessageBubble.jsx  # User / AI / Error bubbles with copy
│   │   │   └── Sidebar.jsx        # Thread list, new chat, user info, logout
│   │   ├── hooks/
│   │   │   ├── useAuth.js         # JWT auth — login, register, logout, verify
│   │   │   ├── useGroqAPI.js      # Backend /api/chat proxy call
│   │   │   └── useThreads.js      # Thread CRUD via backend API
│   │   ├── constants.js           # API_BASE_URL
│   │   ├── App.jsx                # Root — auth gate + layout
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles + Tailwind + animations
│   ├── .env.local                 # VITE_API_BASE_URL (never commit)
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js            # Mongoose user schema + bcrypt
│   │   │   └── Thread.js          # Mongoose thread + messages schema
│   │   ├── routes/
│   │   │   ├── auth.js            # POST /register, POST /login, GET /me
│   │   │   ├── threads.js         # CRUD for threads
│   │   │   └── chat.js            # POST /chat — Groq proxy + DB save
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT protect middleware
│   │   │   └── errorHandler.js    # Global error handler
│   │   └── index.js               # Express app entry point
│   ├── .env                       # Server secrets (never commit)
│   └── package.json
│
└── README.md
```

---

## Known Tradeoffs

| Tradeoff              | Details                                                |
| --------------------- | ------------------------------------------------------ |
| Render cold starts    | Free tier sleeps after inactivity — first request ~30s |
| No email verification | Users can register with any email format               |
| Single device session | JWT in localStorage — not synced across browsers       |

---

## Roadmap

- [x] JWT authentication
- [x] MongoDB thread + message persistence
- [x] Secure Groq API key (server-side only)
- [x] Multi-session thread management
- [x] Markdown + syntax highlighting
- [x] Responsive layout
- [ ] Streaming responses
- [ ] Email verification
- [ ] Password reset
- [ ] Model switcher

---

## License

MIT — [Yasir Rajput](https://github.com/yasirrajput4)

<div align="center">
  <a href="https://nexus-ai-yasir.vercel.app">Live Demo</a> ·
  <a href="https://github.com/yasirrajput4/NexusAI/issues">Report Bug</a> ·
  <a href="https://github.com/yasirrajput4/NexusAI/issues">Request Feature</a>
</div>
