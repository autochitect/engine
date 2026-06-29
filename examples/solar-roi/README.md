# Solar ROI Calculator — Vanilla JavaScript

A single HTML file solar return-on-investment calculator using `@autochitect/engine`. Shows how to model multi-step cost and savings calculations with real-world constants baked into the model.

## What this demonstrates

- Chaining inputs through multiple derived values (cost → savings → payback → profit)
- Embedding constants directly in the model (EPA CO₂ factor, tree absorption rate)
- Calculating environmental impact alongside financial returns
- All in a single `<script type="module">` tag with no build tools

## Usage

Open directly in a browser — no build step, no server required:

```bash
open index.html
```

Or serve it if your browser blocks local ES module imports:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## The model

```
system_kw: Input
cost_per_watt: Input
daily_sun_hours: Input
electricity_rate: Input
tax_credit_pct: Input

gross_system_cost = system_kw * 1000 * cost_per_watt
tax_credit = gross_system_cost * tax_credit_pct / 100
net_system_cost = gross_system_cost - tax_credit

annual_kwh = system_kw * daily_sun_hours * 365
annual_savings = annual_kwh * electricity_rate

payback_years = net_system_cost / annual_savings
lifetime_savings = annual_savings * 25
net_profit = lifetime_savings - net_system_cost

co2_offset_kg_per_year = annual_kwh * 0.386
trees_equivalent = co2_offset_kg_per_year / 21
```
