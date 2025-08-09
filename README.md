# Time-Master

A stylish **Stopwatch + Clock** web app built with **Next.js (JavaScript only)** — no TypeScript. Responsive design, modern UI, and packed with features.

## Features
-  **Live Clock**: Current time in hours, minutes, seconds (12/24-hour toggle).
- ⏱ **Stopwatch**: Start, stop, resume, reset, and lap tracking.
-  **Lap List**: Scrollable, animated with delete option per lap.
-  **Theme Toggle**: Light/Dark mode with preference saved in `localStorage`.
- ⌨️ **Keyboard Shortcuts**: Space = start/stop, R = reset, L = lap.
-  **Date Display** below the clock.
-  Smooth animations and modern, responsive UI powered by Tailwind CSS (and Framer Motion, if used).

## Tech Stack
- **Framework**: Next.js (App Router, `app/` directory)
- **Language**: JavaScript (no TS)
- **Styling**: Tailwind CSS
- **Timing logic**: React Hooks (`useState`, `useEffect`, `useRef`)
- **State Persistence**: `localStorage`

## Quick Start

```bash
git clone https://github.com/RanaDarpan/Time-Master.git
cd Time-Master
npm install
npm run dev
# Visit http://localhost:3000
