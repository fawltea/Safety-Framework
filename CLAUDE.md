# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static website documenting a physical device safety framework with 5 levels (0-4). Built with Vite and Bootstrap, deployed to GitHub Pages.

## Development Commands

All commands run from the `saftey-framework/` directory:

```bash
cd saftey-framework
npm install     # Install dependencies
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

## Architecture

- **Build tool**: Vite with vanilla JS (no framework)
- **Styling**: Bootstrap 5.3 + custom CSS variables in `src/style.css`
- **Entry point**: `index.html` loads `src/main.js`
- **Deployment**: GitHub Actions workflow (`.github/workflows/deploy.yml`) auto-deploys to GitHub Pages on push to main

## Project Structure Note

The Vite project lives in `saftey-framework/` subdirectory (note the intentional spelling).
