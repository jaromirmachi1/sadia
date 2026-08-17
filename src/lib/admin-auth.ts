import "server-only";

import { cookies } from "next/headers";

const ADMIN_COOKIE = "sadia_admin_session";

export function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminSecret());
}

export async function isAdminAuthenticated() {
  const secret = getAdminSecret();

  if (!secret) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === secret;
}

export async function setAdminSession(password: string) {
  const secret = getAdminSecret();

  if (!secret || password !== secret) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function requireAdmin() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    throw new Error("Unauthorized");
  }
}
