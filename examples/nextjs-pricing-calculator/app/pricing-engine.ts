import { createEngine, type Engine } from "@autochitect/engine";

let engine: Engine | null = null;

export async function getEngine(): Promise<Engine> {
  if (!engine) {
    engine = await createEngine("https://unpkg.com/@autochitect/engine/engine.wasm");
  }
  return engine;
}

export const defaultPricingModel = `seats: Input
storage_gb: Input
api_calls_k: Input

seat_cost = seats * 12
storage_cost = storage_gb * 0.50
api_cost = api_calls_k * 0.10

monthly_total = seat_cost + storage_cost + api_cost
annual_total = monthly_total * 12
per_seat_cost = monthly_total / seats
`;
