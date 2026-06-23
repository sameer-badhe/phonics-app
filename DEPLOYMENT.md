# Phonics Learning App — Deployment Guide

## Prerequisites

- [Node.js 18+](https://nodejs.org) installed
- [npm](https://npmjs.com) or [pnpm](https://pnpm.io)

---

## 1. Local Setup

```bash
# Clone / navigate to the project folder
cd phonics-app

# Install dependencies
npm install

# Start dev server
npm run dev
# → Opens at http://localhost:5173
```

---

## 2. Supabase Setup (optional — app works without it)

The app saves progress to **localStorage** by default.
To enable cloud sync, create a free Supabase project:

1. Go to https://supabase.com and create a project.
2. Open **SQL Editor** and paste the contents of `supabase/schema.sql` → Run.
3. Copy your **Project URL** and **anon key** from Project Settings → API.
4. Create a `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart the dev server — progress now syncs to the cloud.

---

## 3. Build for Production

```bash
npm run build
# Output goes to /dist
```

---

## 4. Deploy to Vercel (Recommended)

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel auto-detects Vite. Done!

### Option B — GitHub + Vercel Dashboard

1. Push the project to a GitHub repo.
2. Go to https://vercel.com → **New Project** → Import the repo.
3. Framework: **Vite** (auto-detected)
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.

---

## 5. Deploy to Netlify (Alternative)

```bash
npm run build
# Drag-and-drop the /dist folder at https://app.netlify.com/drop
```

Or connect via GitHub with build command `npm run build` and publish directory `dist`.

---

## 6. PWA Icons

Replace these placeholder files with real 192×192 and 512×512 PNG images:

- `public/pwa-192x192.png`
- `public/pwa-512x512.png`
- `public/apple-touch-icon.png`

Use https://realfavicongenerator.net to generate them from any icon.

---

## Project Structure

```
src/
├── components/
│   ├── AudioButton.tsx    ← Text-to-speech button
│   ├── LetterCard.tsx     ← A–Z alphabet card
│   ├── WordCard.tsx       ← Phonics word card
│   ├── QuizCard.tsx       ← Multiple-choice quiz question
│   └── NavBar.tsx         ← Bottom navigation
│
├── pages/
│   ├── Home.tsx           ← Landing screen
│   ├── LearnLetters.tsx   ← A–Z learning module
│   ├── WordPractice.tsx   ← Word practice with categories
│   ├── Quiz.tsx           ← 10-question randomised quiz
│   └── Progress.tsx       ← Progress tracking & badges
│
├── data/
│   ├── phonics.json       ← A–Z letters + 12 phonics words
│   └── quizzes.json       ← 15 quiz questions
│
├── services/
│   └── supabase.ts        ← Supabase client + localStorage fallback
│
└── App.tsx                ← Routes
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Audio | Web Speech API (built-in) |
| Database | Supabase (optional) |
| Offline | Vite PWA plugin |
| Deploy | Vercel / Netlify |
