import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  setSessionCookie,
  verifyCredentials,
} from "@/lib/auth";
import { ensureBootstrapAdmin } from "@/lib/users";

export async function POST(req: NextRequest) {
  try {
    await ensureBootstrapAdmin();
    const { username, password } = await req.json();
    const user = await verifyCredentials(String(username || ""), String(password || ""));
    if (!user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }
    const token = await createSessionToken(user);
    await setSessionCookie(token);
    return NextResponse.json({
      ok: true,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Erro no login" }, { status: 500 });
  }
}
