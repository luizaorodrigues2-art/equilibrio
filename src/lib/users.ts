import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { adminConfig } from "./site";

export type UserRole = "admin" | "editor" | "author";

export type CmsUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  mustChangePassword: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  resetToken?: string;
  resetTokenExpiresAt?: string;
};

const USERS_PATH = path.join(process.cwd(), "content", "data", "users.json");

function ensure() {
  fs.mkdirSync(path.dirname(USERS_PATH), { recursive: true });
}

function readUsers(): CmsUser[] {
  ensure();
  if (!fs.existsSync(USERS_PATH)) return [];
  const raw = fs.readFileSync(USERS_PATH, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as CmsUser[];
}

function writeUsers(users: CmsUser[]) {
  ensure();
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export function publicUser(user: CmsUser) {
  const { passwordHash: _, resetToken: __, resetTokenExpiresAt: ___, ...safe } = user;
  return safe;
}

export async function ensureBootstrapAdmin(): Promise<CmsUser> {
  const users = readUsers();
  if (users.length > 0) {
    return users.find((u) => u.role === "admin") || users[0];
  }

  const password = adminConfig.password || "Admin@123456";
  const passwordHash = adminConfig.passwordHash || (await bcrypt.hash(password, 10));
  const now = new Date().toISOString();
  const admin: CmsUser = {
    id: "user-admin-1",
    username: adminConfig.username || "admin",
    email: "admin@equilibriointegral.com.br",
    name: "Administrador",
    role: "admin",
    passwordHash,
    mustChangePassword: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  writeUsers([admin]);
  return admin;
}

export function listUsers() {
  ensureBootstrapAdmin();
  return readUsers().map(publicUser);
}

export function getUserByUsername(username: string) {
  ensureBootstrapAdmin();
  return readUsers().find((u) => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export function getUserById(id: string) {
  ensureBootstrapAdmin();
  return readUsers().find((u) => u.id === id) || null;
}

export function getUserByEmail(email: string) {
  ensureBootstrapAdmin();
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function verifyUserCredentials(username: string, password: string) {
  await ensureBootstrapAdmin();
  const user = getUserByUsername(username);
  if (!user || !user.active) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function createUser(input: {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  mustChangePassword?: boolean;
}) {
  await ensureBootstrapAdmin();
  const users = readUsers();
  if (users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) {
    throw new Error("Usuário já existe");
  }
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("E-mail já cadastrado");
  }
  const now = new Date().toISOString();
  const user: CmsUser = {
    id: `user-${Date.now()}`,
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    role: input.role,
    passwordHash: await bcrypt.hash(input.password, 10),
    mustChangePassword: input.mustChangePassword !== false,
    active: true,
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  writeUsers(users);
  return publicUser(user);
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<CmsUser, "email" | "name" | "role" | "active" | "mustChangePassword">>
) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("Usuário não encontrado");
  users[idx] = { ...users[idx], ...patch, updatedAt: new Date().toISOString() };
  writeUsers(users);
  return publicUser(users[idx]);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) throw new Error("Usuário não encontrado");
  const ok = await bcrypt.compare(currentPassword, users[idx].passwordHash);
  if (!ok) throw new Error("Senha atual incorreta");
  if (newPassword.length < 10) throw new Error("A nova senha deve ter ao menos 10 caracteres");
  users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
  users[idx].mustChangePassword = false;
  users[idx].updatedAt = new Date().toISOString();
  writeUsers(users);
  return publicUser(users[idx]);
}

export async function forceSetPassword(userId: string, newPassword: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) throw new Error("Usuário não encontrado");
  if (newPassword.length < 10) throw new Error("A nova senha deve ter ao menos 10 caracteres");
  users[idx].passwordHash = await bcrypt.hash(newPassword, 10);
  users[idx].mustChangePassword = false;
  users[idx].resetToken = undefined;
  users[idx].resetTokenExpiresAt = undefined;
  users[idx].updatedAt = new Date().toISOString();
  writeUsers(users);
  return publicUser(users[idx]);
}

export function createPasswordResetToken(email: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx < 0) return null;
  const token = randomBytes(24).toString("hex");
  users[idx].resetToken = token;
  users[idx].resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  users[idx].updatedAt = new Date().toISOString();
  writeUsers(users);
  return { user: publicUser(users[idx]), token };
}

export function getUserByResetToken(token: string) {
  const users = readUsers();
  const user = users.find((u) => u.resetToken === token);
  if (!user || !user.resetTokenExpiresAt) return null;
  if (new Date(user.resetTokenExpiresAt).getTime() < Date.now()) return null;
  return user;
}

export function deleteUser(id: string) {
  const users = readUsers();
  const admins = users.filter((u) => u.role === "admin" && u.active);
  const target = users.find((u) => u.id === id);
  if (!target) throw new Error("Usuário não encontrado");
  if (target.role === "admin" && admins.length <= 1) {
    throw new Error("Não é possível remover o único administrador");
  }
  writeUsers(users.filter((u) => u.id !== id));
}
