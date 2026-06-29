# Loan Calculator — Vanilla JavaScript

A single HTML file loan calculator using `@autochitect/engine`. Demonstrates the built-in `PMT()` financial function for real amortization math.

## What this demonstrates

- Using the built-in `PMT()` function for mortgage/loan calculations
- Negating PMT output (it returns cash outflow as negative)
- Sliders for loan amount, interest rate, and term
- Full dependency graph showing how monthly payment flows through to totals

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
loan_amount: Input
annual_rate_pct: Input
years: Input

monthly_rate = annual_rate_pct / 100 / 12
total_months = years * 12
monthly_payment = -PMT(monthly_rate, total_months, loan_amount)
total_paid = monthly_payment * total_months
total_interest = total_paid - loan_amount
interest_pct = total_interest / loan_amount * 100
```

`PMT(rate, nper, pv)` is the standard Excel/spreadsheet payment function — it returns the fixed periodic payment for a loan given an interest rate, number of periods, and present value.
