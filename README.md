# Habit Tracker PWA

A mobile-first Progressive Web App for tracking daily habits. Built as a Stage 3 implementation task from a Technical Requirements Document.

---

## Project Overview

Habit Tracker lets users:
- Sign up and log in with email and password
- Create, edit, and delete daily habits
- Mark habits complete for today and unmark them
- View a current streak for each habit
- Reload the app and retain all saved state
- Install the app as a PWA
- Load the cached app shell when offline

Authentication and persistence are entirely local — no backend, no external services. All data lives in the browser's localStorage.

---

## Setup Instructions

**Requirements:**
- Node.js 18+
- pnpm

**Install dependencies:**
```bash
pnpm install
```

**Install Playwright browsers:**
```bash
pnpx playwright install chromium
```

---

## Run Instructions

**Start the development server:**
```bash
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

**Build for production:**
```bash
pnpm build
pnpm start
```

---

## Test Instructions

**Unit tests only (with coverage):**
```bash
pnpm test:unit
```

**Integration tests:**
```bash
pnpm test:integration
```

**End-to-end tests (requires dev server or starts one automatically):**
```bash
pnpm test:e2e
```

**Run all tests:**
```bash
pnpm test
```

Coverage report is generated automatically when running `test:unit`. The minimum threshold is 80% line coverage for files in `src/lib`.

---

## Local Persistence Structure

All data is stored in the browser's `localStorage` under three keys:

| Key | Shape | Description |
|-----|-------|-------------|
| `habit-tracker-users` | `User[]` | All registered users |
| `habit-tracker-session` | `Session \| null` | The currently active session |
| `habit-tracker-habits` | `Habit[]` | All habits across all users |

**User shape:**
```json
{
  "id": "string (UUID)",
  "email": "string",
  "password": "string (plain text)",
  "createdAt": "ISO string"
}
```

**Session shape:**
```json
{
  "userId": "string",
  "email": "string"
}
```

**Habit shape:**
```json
{
  "id": "string (UUID)",
  "userId": "string",
  "name": "string",
  "description": "string",
  "frequency": "daily",
  "createdAt": "ISO string",
  "completions": ["YYYY-MM-DD"]
}
```

All habits for all users are stored in one array. The dashboard filters by `userId` to show only the logged-in user's habits. Every write operation reads the full array, modifies it, and writes it back to preserve other users' data.

Because localStorage is browser-only, all reads and writes are guarded with `typeof window === 'undefined'` checks to prevent crashes during Next.js server-side rendering.

---

## PWA Support

The app is installable and supports basic offline use through two files:

**`public/manifest.json`**
Declares the app name, icons, start URL, display mode, and theme colors. Linked in the root layout via `<link rel="manifest">`.

**`public/sw.js`**
A service worker using a Cache First strategy:
- On `install`: caches the app shell routes (`/`, `/login`, `/signup`, `/dashboard`)
- On `activate`: deletes outdated caches from previous versions
- On `fetch`: serves from cache first, falls back to network, falls back to cached `/` if offline

The service worker is registered in `src/app/layout.tsx` via an inline script that runs on page load.

**Why `public` is at the project root:**
Next.js only serves static files from a `public` folder at the project root. Service workers must also be served from the root scope (`/sw.js`) to intercept requests across the entire app. Moving `public` inside `src` would break both static file serving and the service worker scope.

---

## Trade-offs and Limitations

| Area | Decision | Reason |
|------|----------|--------|
| Passwords | Stored in plain text | Spec is front-end only with no auth service. Not suitable for production. |
| All habits in one array | Single localStorage key for all users | Simpler reads/writes. Filtered by `userId` at runtime. |
| No token expiry | Session persists until logout | Spec does not require expiry. localStorage has no TTL. |
| Offline support | App shell only | Full offline data access would require a more complex sync strategy outside scope. |
| Frequency | Only `daily` supported | Spec explicitly limits this stage to daily frequency. |
| `public` at root | Not inside `src` | Required by Next.js static file serving and service worker scope rules. |
| Auth route guarding | `/login` and `/signup` are accessible while logged in | The TRD does not specify redirect behavior for these routes for authenticated users. |
| Service Worker strategy | Network First for HTML, Cache First for static assets | Cache First for HTML caused stale JS references to break redirects on repeated loads. Network First preserves correct app behavior while still serving the app shell offline. |

---

## Test File Map

| Test File | What It Verifies |
|-----------|-----------------|
| `tests/unit/slug.test.ts` | `getHabitSlug` — lowercase conversion, space trimming, special character removal |
| `tests/unit/validators.test.ts` | `validateHabitName` — empty input rejection, 60 char limit, trimmed output |
| `tests/unit/streaks.test.ts` | `calculateCurrentStreak` — empty completions, missing today, consecutive days, duplicates, broken streaks |
| `tests/unit/habits.test.ts` | `toggleHabitCompletion` — adding dates, removing dates, immutability, no duplicates |
| `tests/integration/auth-flow.test.tsx` | Signup creates session, duplicate email rejection, login stores session, invalid credentials error |
| `tests/integration/habit-form.test.tsx` | Form validation, habit creation callback, edit preserves immutable fields, delete requires confirmation, completion toggle |
| `tests/e2e/app.spec.ts` | Full user flows in a real browser — splash redirect, auth guard, signup, login, habit CRUD, streak update, persistence, logout, offline shell |