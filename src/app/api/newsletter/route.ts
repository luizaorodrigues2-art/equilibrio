import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addNewsletterLead } from "@/lib/cms";

const schema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const result = addNewsletterLead(body.email, body.source || "site");
    if (!result.ok) {
      return NextResponse.json(
        { error: "Este e-mail já está inscrito." },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
}
