# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static website documenting the Safety Design Index, a classification system for device safety with 6 levels (0-5). Built with Vite and Tailwind CSS (CDN), deployed to GitHub Pages. Supports multiple languages (English, Chinese, Japanese).

## Development

Run from the repository root using Docker:

```powershell
.\run.ps1    # Build and start dev server at http://localhost:5173
```

To stop:
```powershell
docker rm -f safety-framework-dev
```

**Important**: Never run `npm`, `node`, or other tooling locally. Always use Docker.

## Architecture

- **Build tool**: Vite with vanilla JS (no framework)
- **Styling**: Tailwind CSS (built at build time via PostCSS)
- **Internationalisation**: Build-time generation from JSON locale files

## Testing the Build

To manually run the i18n build script inside the Docker container:

```powershell
docker exec safety-framework-dev node src/build-i18n.js
```

To verify generated output:

```powershell
docker exec safety-framework-dev cat index.html | head -30      # Check English (root)
docker exec safety-framework-dev cat zh/index.html | head -30   # Check Chinese
docker exec safety-framework-dev cat ja/index.html | head -30   # Check Japanese
```

## Project Structure

```
saftey-framework/           # Note: intentional spelling
├── src/
│   ├── template.html       # Main HTML template with {{placeholders}}
│   ├── build-i18n.js       # Generates localised pages at build time
│   ├── style.css           # Tailwind CSS source (directives only)
│   └── main.js             # Entry point (minimal)
├── locales/
│   ├── en.json             # English translations (levels array with examples)
│   ├── zh.json             # Chinese (Simplified) translations
│   └── ja.json             # Japanese translations
├── public/
│   └── style.css           # Generated CSS (gitignored)
├── index.html              # English content (generated, root)
├── zh/                     # Generated (gitignored)
├── ja/                     # Generated (gitignored)
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
└── vite.config.js          # Vite config with i18n hot-reload plugin
```

## Adding a New Language

1. Create `locales/{code}.json` based on `locales/en.json`
2. Add language entry to `languages` array in `src/build-i18n.js` (e.g. `{ code: 'fr', outputPath: 'fr' }`)
3. Add `<option>` to language dropdown in `src/template.html`
4. Add `<link rel="alternate" hreflang="{code}">` in `src/template.html`
5. Add input entry in `vite.config.js` build rollupOptions
6. Add `/{code}/` to `.gitignore`

Note: English is served at root (`/`), all other languages at `/{code}/`.

## Key Design Decisions

- British English spelling throughout (behaviour, colour, etc.)
- No brand names in examples (use generic descriptions)
- Device-centric language ("The device..." not "The process...")
- Dark mode support with localStorage persistence
- Examples auto-expand when navigating via anchor links (#level-3)
