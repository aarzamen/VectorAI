# CLAUDE.md — ClaudeCrayons

## Project Overview

ClaudeCrayons is a mobile-first Progressive Web App (PWA) vector graphics editor with an Anthropic-inspired warm design aesthetic. It supports freehand drawing, shape creation (rectangles, circles, lines), text elements, layer management, rich templates, and export to SVG/PNG/JPEG and Excalidraw-compatible JSON.

## Tech Stack

- **Framework**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1 (utility-first, `@tailwindcss/vite` plugin) with custom ClaudeCrayons theme
- **State Management**: Zustand 5.0
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
├── index.css                 # Tailwind CSS imports + ClaudeCrayons theme
├── components/
│   ├── Layout.tsx            # Fixed full-screen container
│   ├── Canvas.tsx            # SVG canvas (drawing, zoom, pan, selection)
│   ├── Toolbar.tsx           # Tool buttons, export/import options
│   ├── PropertiesPanel.tsx   # Element property editor
│   ├── ColorPicker.tsx       # Color selection UI with ClaudeCrayons palette
│   ├── LayersPanel.tsx       # Layer management panel
│   └── TemplatesPanel.tsx    # Rich template selector with categories
└── store/
    └── documentStore.ts      # Zustand store (all app state + Excalidraw conversion)
```

## Architecture & Patterns

### State Management
All application state lives in a single Zustand store (`src/store/documentStore.ts`). This includes the document model (layers, elements), active tool, selection state, viewport transforms, UI panel visibility, and Excalidraw import/export functions.

### Element Model
Elements use discriminated union types: `PathElement`, `RectElement`, `CircleElement`, `TextElement`, `LineElement`, `GroupElement`. Each has a `type` field for discrimination. Element IDs are generated with `crypto.randomUUID()`.

### Excalidraw Compatibility
The store includes `exportToExcalidraw()` and `importFromExcalidraw()` functions for full bidirectional compatibility with Excalidraw's JSON format (v2). Element types are mapped between formats (rect<->rectangle, circle<->ellipse, path<->freedraw, line<->line).

### Rendering
All graphics are rendered as SVG (not HTML Canvas). The `Canvas.tsx` component renders elements directly as SVG nodes. Export to PNG/JPEG uses an offscreen Canvas 2D context to rasterize the SVG.

### Template System
Templates are categorized (App, Business, Diagrams, Social, Shapes) and include complete multi-element compositions: iOS App Icon, Mobile Wireframe, Business Card, Presentation Slide, Flowchart, Org Chart, Mind Map, Social Post, Logo Design, Geometric Pattern, Icon Grid, Dashboard Layout, and Star Burst.

### Component Pattern
All components are functional React components using hooks. No class components.

### Mobile-First Design
- Touch gestures: pinch-to-zoom, two-finger pan
- Pointer events for cross-device input handling
- CSS `env(safe-area-inset-*)` for notch/device cutout support
- Responsive breakpoints via Tailwind `md:` prefix

## ClaudeCrayons Design System

### Color Palette (defined as CSS custom properties in index.css)
- **Terracotta**: `#D97757` (primary accent — Anthropic-inspired)
- **Terracotta Light**: `#E8A87C`
- **Terracotta Dark**: `#B8583A`
- **Background**: `#1C1917` (warm black)
- **Surface**: `#292524` (warm dark gray)
- **Border**: `#44403C` / `#57534E`
- **Text**: `#FAFAF9` (warm white)
- **Text Muted**: `#A8A29E`
- **Selection**: `rgba(217,119,87,0.2)` with terracotta border

### Styling Conventions
- Warm, earthy color palette throughout
- Rounded corners: `rounded-lg` / `rounded-xl` / `rounded-2xl`
- Glass-morphism panels with `backdrop-blur-md`
- Dot grid canvas background (terracotta-tinted dots)
- All styling via Tailwind utility classes using custom `claude-*` color tokens

## Environment Variables

- `DISABLE_HMR` — Set to disable Hot Module Replacement in dev

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
- When modifying the store, maintain the Zustand pattern of immutable state updates
- SVG path data (`d` attribute) is the core data format for vector shapes — handle with care
- Excalidraw import/export lives in `documentStore.ts` — keep conversion functions in sync with the Excalidraw v2 schema
- Use `claude-*` Tailwind color tokens (e.g., `bg-claude-surface`, `text-claude-terracotta`) for consistent theming
- Templates should use the ClaudeCrayons color palette for default element colors
