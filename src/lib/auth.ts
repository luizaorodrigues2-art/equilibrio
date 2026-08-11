import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { adminConfig } from "./site";
import {
  ensureBootstrapAdmin,
  type CmsUser,
  type UserRole,
  verifyUserCredentials,
} from "./users";

const encoder = new TextEncoder();

export type SessionPayload = {
  role: UserRole;
  sub: string;
  uid: string;
  mcp: boolean;
};

function getSecret() {
  return encoder.encode(adminConfig.sessionSecret);
}

export async function verifyCredentials(username: string, password: string) {
  await ensureBootstrapAdmin();
  return verifyUserCredentials(username, password);
}

export async function createSessionToken(user: CmsUser) {
  const payload: SessionPayload = {
    role: user.role,
    sub: user.username,
    uid: user.id,
    mcp: user.mustChangePassword,
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${adminConfig.sessionDays}d`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const role = payload.role as UserRole | undefined;
    if (!role || !["admin", "editor", "author"].includes(role)) return null;
    return {
      role,
      sub: String(payload.sub || ""),
      uid: String(payload.uid || ""),
      mcp: Boolean(payload.mcp),
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(adminConfig.sessionCookie)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function isAuthenticated() {
  const session = await getSession();
  return Boolean(session);
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(adminConfig.sessionCookie, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: adminConfig.sessionDays * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(adminConfig.sessionCookie);
}

export function canManageUsers(role: UserRole) {
  return role === "admin";
}

export function canPublish(role: UserRole) {
  return role === "admin" || role === "editor";
}
