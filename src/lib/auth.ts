import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { scryptSync, randomBytes, timingSafeEqual } from "crypto";

/* ─────────────────────────────────────────────
 * Lightweight single-admin session auth.
 * - Passwords: scrypt hash (node crypto) stored in AdminUser
 * - Sessions: HMAC-SHA256 signed token (Web Crypto — edge + node safe)
 * - Cookie: HttpOnly, SameSite=Lax, 7 days
 * ───────────────────────────────────────────── */

export const SESSION_COOKIE = "cipher_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionPayload = { u: string; e: number };

function b64url(bytes: ArrayBuffer | Uint8Array | string): string {
  let bin: string;
  if (typeof bytes === "string") bin = bytes;
  else bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str: string): string {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return atob(str.replace(/-/g, "+").replace(/_/g, "/") + pad);
}

function toB64UrlBytes(str: string): Uint8Array<ArrayBuffer> {
  const bin = b64urlDecode(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

/** Get the session signing secret (stored in Setting table, env fallback). */
export async function getSessionSecret(): Promise<string> {
  try {
    const row = await db.setting.findUnique({ where: { key: "session_secret" } });
    if (row?.value) return row.value;
  } catch {
    /* db not ready — fall through */
  }
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  // Last resort deterministic dev secret (rotation handled by seed)
  return "cipher-dev-secret-fallback";
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Create a signed session token. */
export async function createSessionToken(username: string): Promise<string> {
  const secret = await getSessionSecret();
  const payload: SessionPayload = { u: username, e: Date.now() + SESSION_TTL_MS };
  const body = b64url(JSON.stringify(payload));
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${b64url(sig)}`;
}

/** Verify a token; returns payload or null. */
export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const secret = await getSessionSecret();
    const key = await hmacKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      toB64UrlBytes(sig),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;
    const payload = JSON.parse(b64urlDecode(body)) as SessionPayload;
    if (!payload?.u || typeof payload.e !== "number" || payload.e < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read + verify the session from request cookies (server components / route handlers). */
export async function getAdminSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Guard for API routes — returns session payload or null (caller 401s). */
export async function requireAdmin(): Promise<SessionPayload | null> {
  return getAdminSession();
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

/* ── Password hashing (scrypt) ──────────────── */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [scheme, salt, hash] = stored.split(":");
    if (scheme !== "scrypt" || !salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    return candidate.length === expected.length && timingSafeEqual(candidate, expected);
  } catch {
    return false;
  }
}

/* ── Naive in-memory login rate limit ───────── */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}
