# @autochitect/engine

A 245KB WebAssembly cost estimation engine. Define cost models in a purpose-built DSL, get instant estimates with full dependency tracing. Runs entirely client-side — no server, no latency, no data leaving the browser.

## Install

```bash
npm install @autochitect/engine
```

## Node.js

```javascript
import { createEngine } from '@autochitect/engine';

const engine = await createEngine();

const result = engine.estimate(`
  seats: Input
  base_price_per_seat = 12
  storage_gb: Input
  storage_price_per_gb = 0.50

  seat_cost = seats * base_price_per_seat
  storage_cost = storage_gb * storage_price_per_gb
  subtotal = seat_cost + storage_cost

  discount_rate = IF(seats > 50, 0.20, IF(seats > 20, 0.10, 0))
  discount = subtotal * discount_rate
  monthly_total = subtotal - discount
  annual_total = monthly_total * 12
`, {
  seats: 35,
  storage_gb: 200,
});

console.log(result.results);
// {
//   seats: 35, base_price_per_seat: 12, storage_gb: 200, storage_price_per_gb: 0.5,
//   seat_cost: 420, storage_cost: 100, subtotal: 520,
//   discount_rate: 0.1, discount: 52, monthly_total: 468, annual_total: 5616
// }
```

## Browser

No install needed — paste this into an HTML file and open it.

```html
<script type="module">
  import { createEngine } from 'https://esm.sh/@autochitect/engine';

  const engine = await createEngine(
    'https://unpkg.com/@autochitect/engine/engine.wasm'
  );

  const result = engine.estimate(`
    seats: Input
    base_price_per_seat = 12
    storage_gb: Input
    storage_price_per_gb = 0.50

    seat_cost = seats * base_price_per_seat
    storage_cost = storage_gb * storage_price_per_gb
    subtotal = seat_cost + storage_cost

    discount_rate = IF(seats > 50, 0.20, IF(seats > 20, 0.10, 0))
    discount = subtotal * discount_rate
    monthly_total = subtotal - discount
    annual_total = monthly_total * 12
  `, {
    seats: 35,
    storage_gb: 200,
  });

  console.log(result.results);
  // {
  //   seats: 35, base_price_per_seat: 12, storage_gb: 200, storage_price_per_gb: 0.5,
  //   seat_cost: 420, storage_cost: 100, subtotal: 520,
  //   discount_rate: 0.1, discount: 52, monthly_total: 468, annual_total: 5616
  // }
</script>
```

If you use a bundler (Vite, webpack, etc.), import normally:

```javascript
import { createEngine } from '@autochitect/engine';

const engine = await createEngine(
  new URL('@autochitect/engine/engine.wasm', import.meta.url)
);
```

## What you get

**`result.results`** — computed values for every variable.

**`result.graph`** — the full dependency DAG showing how each value was derived. Nodes have `kind` (input, formula, map, scan) and edges show data flow. Build audit trails, trace calculations back to source inputs, or render interactive cost breakdowns.

**`result.errors`** / **`result.warnings`** — with line and column numbers.

## The DSL

```
# Inputs — bind to external data (your JSON)
revenue: Input("annual_revenue")
headcount: Input

# Constants — use formula assignment
tax_rate = 0.21
avg_salary = 85000

# Params — tunable scenario knobs (passed via inputs)
growth: Param

# Formulas — define cost relationships
labor_cost = headcount * avg_salary
gross_profit = revenue * (1 - tax_rate)
net_income = gross_profit * (1 - tax_rate)

# Array operations — project over time
periods = SEQUENCE(12, 1, 1)
monthly = MAP(periods, LAMBDA(p, revenue / 12 * POWER(1 + growth, p)))

# Accumulation — running totals
cumulative = SCAN(monthly, 0, LAMBDA(acc, m, acc + m))
```

**Inputs** bind to external data (your JSON). **Constants** are defined with formula assignment (`name = value`). **Params** are tunable scenario knobs passed via the inputs object.

**MAP** transforms arrays element-wise. **SCAN** accumulates (like reduce, but returns intermediate results). **LAMBDA** defines inline functions with named parameters.

## Options

```javascript
// Skip the dependency graph for faster estimation
engine.estimate(source, inputs, { graph: false });
```

## TypeScript

Full type definitions are included. Key types:

```typescript
import type { Engine, EstimateResult, EstimateOptions } from '@autochitect/engine';
```

## License

MIT
