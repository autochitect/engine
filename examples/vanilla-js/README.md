# Vanilla JavaScript — No Build Tools

A single HTML file that loads `@autochitect/engine` directly in the browser. No bundler, no framework, no build step.

## What this demonstrates

- Simplest possible integration — one `<script type="module">` tag
- Loading WASM from a local path
- Interactive cost calculator with plain DOM manipulation
- Inspecting the dependency graph output

## Usage

### Option A: From npm (copy files)

```bash
npm install @autochitect/engine
cp node_modules/@autochitect/engine/index.mjs .
cp node_modules/@autochitect/engine/engine.wasm .
```

Then serve the directory:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Open `index.html` in your browser.

### Option B: From CDN

Edit `index.html` and change the import path to use a CDN:

```javascript
import { createEngine } from 'https://esm.sh/@autochitect/engine';
```

Note: you'll also need to adjust the WASM path accordingly.
