import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "cart_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const VERSION = "v1";

function getSecret(): string {
  const s = process.env.CART_COOKIE_SECRET;
  if (!s) throw new Error("CART_COOKIE_SECRET missing");
  return s;
}

function hmac(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function packCookie(token: string): string {
  const expiry = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${VERSION}.${token}.${expiry}`;
  const sig = hmac(payload);
  return `${payload}.${sig}`;
}

export type UnpackedCookie =
  | { ok: true; token: string }
  | { ok: false; reason: "absent" | "malformed" | "expired" | "tampered" };

export function unpackCookie(value: string | undefined): UnpackedCookie {
  if (!value) return { ok: false, reason: "absent" };
  const parts = value.split(".");
  if (parts.length !== 4) return { ok: false, reason: "malformed" };
  const [version, token, expiryStr, sig] = parts;
  if (version !== VERSION) return { ok: false, reason: "malformed" };
  if (!token || !expiryStr || !sig) return { ok: false, reason: "malformed" };

  const expiry = Number(expiryStr);
  if (!Number.isInteger(expiry)) return { ok: false, reason: "malformed" };

  const expected = hmac(`${version}.${token}.${expiryStr}`);
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return { ok: false, reason: "tampered" };
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return { ok: false, reason: "tampered" };

  if (Math.floor(Date.now() / 1000) > expiry) return { ok: false, reason: "expired" };
  return { ok: true, token };
}

export async function readCartCookie(): Promise<string | null> {
  const store = await cookies();
  const result = unpackCookie(store.get(COOKIE_NAME)?.value);
  return result.ok ? result.token : null;
}

export async function writeCartCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, packCookie(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}