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

## Architecture

- **Build tool**: Vite with vanilla JS (no framework)
- **Styling**: Tailwind CSS via CDN (no local install)
- **Internationalisation**: Build-time generation from JSON locale files

## Project Structure

```
saftey-framework/           # Note: intentional spelling
├── src/
│   ├── template.html       # Main HTML template with {{placeholders}}
│   ├── build-i18n.js       # Generates localised pages at build time
│   ├── main.js             # Entry point (minimal)
│   └── style.css           # Custom styles
├── locales/
│   ├── en.json             # English translations
│   ├── zh.json             # Chinese (Simplified) translations
│   └── ja.json             # Japanese translations
├── index.html              # Root redirect (detects browser language)
├── en/                     # Generated (gitignored)
├── zh/                     # Generated (gitignored)
├── ja/                     # Generated (gitignored)
└── vite.config.js          # Vite config with i18n hot-reload plugin
```

## Adding a New Language

1. Create `locales/{code}.json` based on `locales/en.json`
2. Add language code to `languages` array in `src/build-i18n.js`
3. Add `<option>` to language dropdown in `src/template.html`
4. Add `<link rel="alternate" hreflang="{code}">` in `src/template.html`
5. Add input entry in `vite.config.js`
6. Add redirect case in root `index.html`
7. Add to `.gitignore`

## Key Design Decisions

- British English spelling throughout (behaviour, colour, etc.)
- No brand names in examples (use generic descriptions)
- Device-centric language ("The device..." not "The process...")
- Dark mode support with localStorage persistence
- Examples auto-expand when navigating via anchor links (#level-3)
