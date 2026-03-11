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
│   ├── TemplatesPanel.tsx    # Rich template selector with categories
│   └── ExportDialog.tsx      # Export dialog with file naming + format picker
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

## Undo/Redo System

The store includes a history stack (`history: HistorySnapshot[]`, `historyIndex`) with `pushHistory()`, `undo()`, and `redo()` actions. Keyboard shortcuts: `Cmd/Ctrl+Z` (undo), `Cmd/Ctrl+Shift+Z` or `Cmd/Ctrl+Y` (redo). Max 50 snapshots. History is pushed after element add, delete, drag, and draw operations.

## Export System

Export uses a modal dialog (`ExportDialog.tsx`) that lets users name the file and pick a format (PNG, JPEG, SVG, Excalidraw JSON). The dialog is toggled via `showExportDialog` in the store.

## UX/Aesthetic Guidelines for AI Assistants

These guidelines are critical and must be followed meticulously. They reflect real user testing feedback and common mistakes made by coding agents.

### Mobile-First Toolbar Rules
- **Bottom toolbar is flush with the screen bottom** — no floating island, no rounded border around the bar itself. Background bleeds to edges. Safe area insets handle notch/home indicator spacing.
- **Tool icons must be large enough to tap confidently** — minimum `w-6 h-6` (24px) for primary drawing tools. Secondary actions (layers, import, save) can be smaller (`w-5 h-5`).
- **Aim for ~6 primary tools per row** — Select, Pen, Rectangle, Circle, Line, Text. Secondary actions go in a second row below.
- **No visible borders or dividers between toolbar buttons** — the icons stand on their own against the surface background. Active tool uses `bg-claude-terracotta` highlight.

### Properties Panel Rules
- **Must be dismissible** — Close button (X icon) in header AND swipe-down gesture on mobile.
- **X/Y inputs are inline** — Label and input sit side-by-side horizontally (e.g., `X [___]  Y [___]`), NOT label-above-input. This saves critical vertical space on mobile.
- **Panel should not obscure more than 40vh** — use `max-h-[40vh]` with overflow scroll.
- **Swipe handle** — Show a small pill-shaped handle at top on mobile (`md:hidden`) as affordance.

### Canvas Rules — NO CLIPPING
- **Never clip or mask elements outside the canvas boundary.** The canvas boundary is indicated by a faint dotted terracotta outline (`strokeDasharray`), NOT a clipping mask. Elements that extend beyond the boundary must remain visible and interactive. Clipping makes oversized templates impossible to select/resize and traps the user.
- **Canvas boundary scales with zoom** — `strokeWidth` and `strokeDasharray` values should be divided by `zoom` to maintain consistent visual size.
- **Grid background** — Use a multi-level terracotta-tinted grid: fine dots at 24px intervals, subtle line grid at 96px, and major grid lines at 480px. The grid should be visible enough to convey scale changes during zoom, but subtle enough not to distract (opacity 0.06–0.10 range for lines).

### Template Loading Rules
- **Templates must auto-fit to the viewport after loading.** Call `fitToContent()` (with a short `setTimeout`) after all template elements are added. Templates should never load at 1:1 scale if that would overflow the viewport — the user should see the complete template centered on screen.
- **Close the templates panel after applying** — don't leave it open blocking the view.

### Save/Export UX
- **Saving work must be obvious and accessible.** The save button is always visible in the toolbar.
- **Export dialog must let users pick a file name AND format in one step.** Never force users through multiple clicks to figure out what "Download" does.
- **Format options**: PNG, JPEG, SVG, Excalidraw JSON — clearly labeled with short descriptions.

### Undo/Redo Visibility
- **Undo and redo arrows must be visible at the top of the screen at all times** — in the top-right area, as a paired button group. Disabled state (opacity 30%) when no history to undo/redo.
- **Keyboard shortcuts must work globally** — `Cmd/Ctrl+Z`, `Cmd/Ctrl+Shift+Z`.

### Common AI Agent Mistakes to Avoid
1. **Do not add clipping masks to the canvas.** This is the #1 mistake. See "Canvas Rules" above.
2. **Do not make toolbar icons too small.** If icons are hard to distinguish at arm's length on a phone, they're too small.
3. **Do not stack labels above inputs when horizontal layout saves space.** Especially for X/Y coordinate fields.
4. **Do not leave panels with no close/dismiss mechanism.** Every overlay panel needs a way to close it.
5. **Do not load templates without fitting to viewport.** Users should never see a zoomed-in corner of a template with no way to access the rest.
6. **Do not remove the grid background or make it invisible.** The grid provides essential visual feedback for zoom/pan.
7. **Do not scatter export options across many unlabeled icon buttons.** Group them in a dialog.
8. **Do not forget undo/redo.** Every drawing app needs it. It must be visually prominent, not buried.
9. **Do not use `overflow: hidden` on the SVG canvas area** to crop out-of-bounds content. Use a visual boundary indicator only.
10. **Do not add borders/dividers between every toolbar button.** Clean, minimal UI.

## Key Considerations for AI Assistants

- Always run `npm run lint` after making TypeScript changes to verify type correctness
- No test framework is configured — do not add test files unless explicitly requested
- The project is fully client-side; there is no production backend
- When modifying the store, maintain the Zustand pattern of immutable state updates
- SVG path data (`d` attribute) is the core data format for vector shapes — handle with care
- Excalidraw import/export lives in `documentStore.ts` — keep conversion functions in sync with the Excalidraw v2 schema
- Use `claude-*` Tailwind color tokens (e.g., `bg-claude-surface`, `text-claude-terracotta`) for consistent theming
- Templates should use the ClaudeCrayons color palette for default element colors
- When adding new UI panels, always include a dismiss/close mechanism (button + gesture)
- After loading templates or importing files, always call `fitToContent()` to center in viewport
- Export dialog file name should default to the document name from the store
- Test Excalidraw import by loading a `.excalidraw` file and verifying elements render correctly
- Visually verify that the save workflow is discoverable: save button visible, export dialog accessible
