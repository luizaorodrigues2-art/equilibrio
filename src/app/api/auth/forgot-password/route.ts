import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken, ensureBootstrapAdmin } from "@/lib/users";
import { siteConfig } from "@/lib/site";

/**
 * Gera token de recuperação. Em produção sem SMTP, o token é retornado
 * apenas em desenvolvimento para facilitar o primeiro acesso.
 */
export async function POST(req: NextRequest) {
  try {
    await ensureBootstrapAdmin();
    const { email } = await req.json();
    const result = createPasswordResetToken(String(email || ""));

    // Always same response to avoid user enumeration
    const base = {
      ok: true,
      message:
        "Se o e-mail existir, um link de recuperação foi gerado. Verifique sua caixa de entrada ou o painel local.",
    };

    if (!result) return NextResponse.json(base);

    const resetUrl = `${siteConfig.url}/admin/redefinir-senha?token=${result.token}`;

    if (process.env.NODE_ENV !== "production" || process.env.EXPOSE_RESET_TOKEN === "1") {
      return NextResponse.json({
        ...base,
        resetUrl,
        token: result.token,
        note: "Token exposto apenas em ambiente de desenvolvimento / EXPOSE_RESET_TOKEN=1",
      });
    }

    // Persist last reset for admin bootstrap when SMTP is not configured
    return NextResponse.json({
      ...base,
      hint: "Configure SMTP ou EXPOSE_RESET_TOKEN=1 para obter o link. Em Vercel logs, o token também pode ser registrado.",
    });
  } catch {
    return NextResponse.json({ error: "Erro ao solicitar recuperação" }, { status: 500 });
  }
}
