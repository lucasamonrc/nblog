# AGENTS.md

## Build & Dev Commands

- **Dev server**: `npm run dev` - starts Vite dev server on http://localhost:5173
- **Build**: `npm run build` - creates optimized production build in dist/
- **Preview**: `npm run preview` - preview production build locally
- **Deploy**: `wrangler deploy` - deploys to Cloudflare (configured in wrangler.jsonc)
- **No tests**: project currently has no test setup

## Architecture

Single-page Vue 3 app for tracking newborn feeding and diaper changes. 

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Styling**: Tailwind CSS v4 (via @tailwindcss/vite plugin)
- **Build tool**: Vite with Cloudflare and PWA plugins
- **Storage**: Browser localStorage (key: "babyLog")
- **Entry point**: src/main.js → mounts App.vue to #app
- **Structure**: Single App.vue component (~570 lines) containing all UI and logic
- **PWA**: Configured with vite-plugin-pwa for offline support and installability
- **Deployment**: Cloudflare Pages via @cloudflare/vite-plugin and Wrangler

## Code Style & Conventions

- **Vue patterns**: Composition API with `ref()`, `computed()`, `onMounted()`
- **State management**: All state in reactive refs at component level
- **Naming**: camelCase for variables/functions, UPPER_CASE for constants (icons dict)
- **Data format**: Timestamps stored as milliseconds (new Date().getTime()), durations in minutes or seconds
- **Error handling**: Basic try-catch on localStorage load with console.error fallback
- **Styling**: Inline classes (Tailwind) + scoped `<style>` block with custom utilities (.soft-shadow, .calm-card, .btn-primary)
- **Comments**: Sparse; sections marked with HTML comments for clarity (e.g., <!-- Header -->, <!-- Active Feeding Session -->)
- **Functions**: Pure utility functions (formatTime, getIcon) don't modify state; side-effect functions explicitly save state (saveEntries)

## Key Patterns

- **Timer management**: clearInterval before starting new interval to prevent leaks
- **Data persistence**: Always call saveEntries() after entries.value mutations
- **Entry types**: "feeding" (startTime/endTime/leftBreast/rightBreast) or "diaper" (poop/pee booleans/timestamp)
- **Computed sorting**: sortedEntries computed property sorts by latest first (descending startTime/timestamp)
