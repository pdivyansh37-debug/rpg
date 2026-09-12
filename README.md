# ⚔️ Life RPG

> **Transform mundane real-world tasks and habit tracking into an engaging, gamified RPG progression system with an immersive 16-bit retro UI, non-linear progression, tactile micro-interactions, and real-time responsiveness.**

---

## 🌟 Key Features

- **🛡️ Hero Character Progression:**
  - **Non-Linear Leveling Curve:** Next Level XP $= \lfloor 100 \times (\text{Level})^{1.5} \rfloor$.
  - **4 Core Attributes:** Track separate proficiency and XP for **Strength** (Fitness), **Intellect** (Coding/Study), **Stamina** (Habits/Discipline), and **Agility** (Speed/Focus).
  - **Daily Streaks Engine:** Consecutive active day tracker with streak bonus reward multipliers (up to $+50\%$ bonus).

- **📜 Quests & Habit Forge:**
  - **Difficulty Tiers:** `TRIVIAL`, `EASY`, `MEDIUM`, and `HARD` (Boss) with deterministic reward balance matrices.
  - **Tactile Celebrations:** Optimistic UI state updates, floating `+XP`/`+Gold` indicator animations, and `canvas-confetti` particle explosions.
  - **Celebratory Fanfare Modal:** Fanfare audio effects and rank progression breakdown on level ups.

- **🪙 Virtual Economy & Bazaar:**
  - Earn in-game Gold through quest completion.
  - Purchase vanity items, custom color themes, avatar crest frames, and prestige titles (`Archmage of TypeScript`, `Dawn Sentry`).

- **🎵 Native 8-Bit Web Audio Engine:**
  - Procedural 8-bit sound synthesizer using the browser's Web Audio API (Quest completion chimes, gold pickup jingles, level-up fanfares) — zero external mp3 files required.

- **🔒 Anti-Cheat & Security:**
  - All XP and Gold calculations execute server-side in atomic PostgreSQL transactions (`$transaction`).

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Canvas-Confetti
- **Backend & Actions:** Next.js Server Actions with Zod schema validations
- **Database & ORM:** PostgreSQL, Prisma ORM, Supabase
- **Audio:** Web Audio API procedural sound synthesis

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/pdivyansh37-debug/rpg.git
cd rpg
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
```

### 3. Generate Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
rpg/
├── actions/             # Server actions with atomic ACID transactions & validation
│   ├── quest-actions.ts # Quest creation & completion
│   └── shop-actions.ts  # Virtual item purchases & equipment
├── app/                 # Next.js App Router views & global styling
│   ├── character/       # Hero attribute sheet
│   ├── shop/            # Bazaar / reward store
│   ├── globals.css      # Retro scanlines & custom scrollbars
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Quests Hub dashboard
├── components/          # Reusable UI & Game components
│   ├── character-sheet.tsx
│   ├── create-quest-modal.tsx
│   ├── hero-hud.tsx
│   ├── level-up-modal.tsx
│   ├── navigation.tsx
│   ├── quest-card.tsx
│   └── shop-view.tsx
├── lib/                 # Core utilities, math, & database
│   ├── auth.ts          # Supabase auth session bridge
│   ├── db.ts            # Prisma client singleton
│   ├── progression.ts   # Leveling math & streak calculations
│   ├── sound.ts         # 8-Bit Web Audio sound synthesizer
│   └── validations/     # Zod input schemas
├── prisma/
│   └── schema.prisma    # PostgreSQL Prisma database schema
└── types/
    └── game.ts          # TypeScript interfaces & types
```
