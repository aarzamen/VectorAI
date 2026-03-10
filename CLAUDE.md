# CLAUDE.md — VectorAI

## Project Overview

VectorAI is a mobile-first Progressive Web App (PWA) vector graphics editor with AI-assisted SVG generation via Google's Gemini API. It supports freehand drawing, shape creation, text elements, layer management, and export to SVG/PNG/JPEG. Designed for use within AI Studio.

## Tech Stack

- **Framework**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1 (utility-first, `@tailwindcss/vite` plugin)
- **State Management**: Zustand 5.0
- **AI Integration**: `@google/genai` (Google Gemini API)
- **Animations**: `motion` (Framer Motion)
- **Icons**: `lucide-react`
- **Storage**: `idb-keyval` (IndexedDB wrapper for document persistence)
- **Color Picker**: `react-colorful`

## Commands

```bash
npm run dev        # Start dev server (port 3000, host 0.0.0.0)
npm run build      # Production build via Vite
npm run preview    # Preview production build
npm run clean      # Remove dist/ folder
npm run lint       # TypeScript type-check only (tsc --noEmit)
```

There are no test suites configured. Linting is TypeScript type-checking via `tsc --noEmit`.

## Project Structure

```
src/
├── main.tsx                  # React entry point
├── App.tsx                   # Root component
├── index.css                 # Tailwind CSS imports
├── components/
│   ├── Layout.tsx            # Fixed full-screen container
│   ├── Canvas.tsx            # SVG canvas (drawing, zoom, pan, selection)
│   ├── Toolbar.tsx           # Tool buttons and export options
│   ├── AIPrompt.tsx          # Gemini AI integration interface
│   ├── PropertiesPanel.tsx   # Element property editor
│   ├── ColorPicker.tsx       # Color selection UI
│   ├── LayersPanel.tsx       # Layer management panel
│   └── TemplatesPanel.tsx    # Design template selector
└── store/
    └── documentStore.ts      # Zustand store (all app state)
```

## Architecture & Patterns

### State Management
All application state lives in a single Zustand store (`src/store/documentStore.ts`). This includes the document model (layers, elements), active tool, selection state, viewport transforms, and UI panel visibility. Use the store's setter functions to update state.

### Element Model
Elements use discriminated union types: `PathElement`, `RectElement`, `CircleElement`, `TextElement`. Each has a `type` field for discrimination. Element IDs are generated with `crypto.randomUUID()`.

### Rendering
All graphics are rendered as SVG (not HTML Canvas). The `Canvas.tsx` component renders elements directly as SVG nodes. Export to PNG/JPEG uses an offscreen Canvas 2D context to rasterize the SVG.

### Component Pattern
All components are functional React components using hooks. No class components.

### Mobile-First Design
- Touch gestures: pinch-to-zoom, two-finger pan
- Pointer events for cross-device input handling
- CSS `env(safe-area-inset-*)` for notch/device cutout support
- Responsive breakpoints via Tailwind `md:` prefix

## Styling Conventions

- Dark theme: `zinc-900` backgrounds, `zinc-50` text
- Rounded corners: `rounded-lg` / `rounded-xl`
- Glass-morphism panels with `backdrop-blur`
- All styling via Tailwind utility classes inline — no separate CSS files beyond `index.css`

## Environment Variables

- `GEMINI_API_KEY` — Required for AI features; injected by AI Studio at runtime
- `APP_URL` — Application URL; injected by AI Studio
- `DISABLE_HMR` — Set to disable Hot Module Replacement in dev

These are injected through `vite.config.ts` via `define` and accessed as global constants.

## TypeScript Configuration

- Target: ES2022
- Module: ESNext with bundler resolution
- Path alias: `@/*` maps to project root (`./`)
- Strict typing with `noEmit` — TypeScript is used for type-checking only, Vite handles transpilation
- JSX: `react-jsx` transform

## Git Conventions

- Commit messages follow conventional commits: `feat:`, `fix:`, etc.
- Keep messages descriptive and concise

## Key Considerations for AI Assistants

- Always run `npm run lint` after making TypeScript changes to verify type correctness
- No test framework is configured — do not add test files unless explicitly requested
- The project is fully client-side; there is no production backend
- `express` and `better-sqlite3` in dependencies are for optional dev tooling, not core app functionality
- When modifying the store, maintain the Zustand pattern of immutable state updates
- SVG path data (`d` attribute) is the core data format for vector shapes — handle with care
- The AI prompt system sends structured prompts to Gemini and parses SVG path responses
