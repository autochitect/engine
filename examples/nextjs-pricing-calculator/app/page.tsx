"use client";

import { useState, useEffect, useCallback } from "react";
import { getEngine, defaultPricingModel } from "./pricing-engine";

function fmt(val: unknown): string {
  if (typeof val !== "number") return "—";
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function PricingPage() {
  const [seats, setSeats] = useState(10);
  const [storageGb, setStorageGb] = useState(100);
  const [apiCallsK, setApiCallsK] = useState(500);
  const [model, setModel] = useState(defaultPricingModel);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const recalculate = useCallback(async () => {
    const engine = await getEngine();
    const result = engine.estimate(model, {
      seats,
      storage_gb: storageGb,
      api_calls_k: apiCallsK,
    });
    if (result.success) {
      setResults(result.results);
      setError(null);
    } else {
      const msg = result.errors?.map((e) => `Line ${e.line}: ${e.message}`).join("\n") || "Unknown error";
      setError(msg);
    }
    setReady(true);
  }, [seats, storageGb, apiCallsK, model]);

  useEffect(() => {
    recalculate();
  }, [recalculate]);

  if (!ready) return <p style={{ padding: 32, color: "#888" }}>Loading engine…</p>;

  const resultKeys = Object.keys(results).filter(
    (k) => !["seats", "storage_gb", "api_calls_k"].includes(k)
  );

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Pricing Calculator</h1>
      <p style={{ marginTop: 4, fontSize: 14, color: "#888" }}>
        All calculations run client-side via <code>@autochitect/engine</code>.
      </p>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 16 }}>
        <Slider label="Seats" value={seats} min={1} max={100} onChange={setSeats} />
        <Slider label="Storage (GB)" value={storageGb} min={10} max={1000} step={10} onChange={setStorageGb} />
        <Slider label="API calls (k/mo)" value={apiCallsK} min={0} max={5000} step={100} onChange={setApiCallsK} />
      </div>

      {error && (
        <div style={{ marginTop: 16, padding: "8px 12px", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, fontSize: 13, color: "#b91c1c", whiteSpace: "pre-wrap" }}>
          {error}
        </div>
      )}

      <dl style={{ marginTop: 32, fontSize: 14, borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd" }}>
        {resultKeys.map((key) => (
          <Row key={key} label={key.replace(/_/g, " ")} value={fmt(results[key])} bold={key === "monthly_total"} />
        ))}
      </dl>

      <div style={{ marginTop: 32 }}>
        <button
          onClick={() => setShowEditor((v) => !v)}
          style={{
            background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "6px 14px",
            fontSize: 13, cursor: "pointer", color: "#555",
          }}
        >
          {showEditor ? "Hide" : "Edit"} Model
        </button>

        {showEditor && (
          <ModelEditor
            model={model}
            onChange={setModel}
            onReset={() => setModel(defaultPricingModel)}
          />
        )}
      </div>
    </main>
  );
}

function Slider({ label, value, min, max, step = 1, onChange }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void;
}) {
  return (
    <label>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", marginTop: 4 }} />
    </label>
  );
}

function ModelEditor({ model, onChange, onReset }: {
  model: string; onChange: (v: string) => void; onReset: () => void;
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <textarea
        value={model}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        style={{
          width: "100%", minHeight: 200, padding: 12, fontSize: 13,
          fontFamily: "ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, monospace",
          lineHeight: 1.6, border: "1px solid #ddd", borderRadius: 6,
          background: "#fafafa", resize: "vertical", boxSizing: "border-box",
        }}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={onReset}
          style={{
            background: "none", border: "1px solid #ddd", borderRadius: 6,
            padding: "4px 12px", fontSize: 12, cursor: "pointer", color: "#888",
          }}
        >
          Reset to default
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee", fontWeight: bold ? 700 : 400 }}>
      <dt style={{ textTransform: "capitalize" }}>{label}</dt>
      <dd style={{ margin: 0, fontVariantNumeric: "tabular-nums" }}>{value}</dd>
    </div>
  );
}
