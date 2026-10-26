export type CartActionResult =
  | { ok: true }
  | { ok: false; reason: "invalid_input" | "quantity_exceeded" | "product_unavailable" | "server_error"; message?: string; cap?: number };