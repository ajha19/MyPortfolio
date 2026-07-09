import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "./db";
import { adminUsers, sessions } from "./schema";

const SESSION_COOKIE = "session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function httpError(statusCode: number, message: string) {
  return Object.assign(new Error(message), { statusCode });
}

export const hashPassword = createServerOnlyFn((password: string): string => {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
});

export const verifyPassword = createServerOnlyFn((password: string, stored: string): boolean => {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, 64);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
});

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

const createSession = createServerOnlyFn(async (adminUserId: string): Promise<string> => {
  const token = randomBytes(32).toString("hex");
  await db.insert(sessions).values({
    id: hashToken(token),
    adminUserId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });
  return token;
});

const setSessionCookie = createServerOnlyFn((token: string) => {
  setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
});

const clearSessionCookie = createServerOnlyFn(() => {
  deleteCookie(SESSION_COOKIE, { path: "/" });
});

const readSessionToken = createServerOnlyFn(() => getCookie(SESSION_COOKIE));

/** Resolves the logged-in admin from the session cookie, or null. Server-only. */
export const getAdminFromRequest = createServerOnlyFn(async () => {
  const token = readSessionToken();
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, hashToken(token)))
    .limit(1);
  if (!session || session.expiresAt < new Date()) return null;

  const [admin] = await db
    .select({ id: adminUsers.id, email: adminUsers.email })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.adminUserId))
    .limit(1);
  return admin ?? null;
});

/** Throws a 401 unless there's a valid admin session. Server-only. */
export const requireAdmin = createServerOnlyFn(async () => {
  const admin = await getAdminFromRequest();
  if (!admin) throw httpError(401, "Authentication required");
  return admin;
});

export const getCurrentAdmin = createServerFn({ method: "GET" }).handler(async () => {
  return getAdminFromRequest();
});

export const login = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email(), password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, data.email.toLowerCase()))
      .limit(1);
    if (!admin || !verifyPassword(data.password, admin.passwordHash)) {
      throw httpError(401, "Invalid email or password");
    }
    const token = await createSession(admin.id);
    setSessionCookie(token);
    return { id: admin.id, email: admin.email };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const token = readSessionToken();
  if (token) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  clearSessionCookie();
  return { ok: true };
});
