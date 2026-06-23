# Examples

Integration examples for `@autochitect/engine` across popular frameworks.

| Example | Framework | Use Case |
|---------|-----------|----------|
| [nextjs-pricing-calculator](./nextjs-pricing-calculator/) | Next.js + TypeScript | SaaS pricing page with real-time sliders and volume discounts |
| [vanilla-js](./vanilla-js/) | Vanilla JS (no build) | Single HTML file, zero dependencies, plain DOM |

## How they work

Every example follows the same pattern:

1. **Load the engine** — `createEngine()` with the WASM file
2. **Define a model** — cost relationships in the DSL
3. **Estimate** — pass user inputs, get results instantly
4. **Render** — display the results however your framework prefers

The engine runs entirely client-side. No API calls, no server-side calculation, no data leaves the browser.
