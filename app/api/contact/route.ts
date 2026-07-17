import { Resend } from "resend";
import { ContactEmail } from "@/emails/contact-email";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 200, email: 320, message: 5000 } as const;

/**
 * Limite de abuso simples, por IP, em memória: 5 envios por 10 minutos.
 * Por instância (serverless pode ter várias), mas já corta o caso trivial
 * de um loop batendo direto na rota.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 1000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}

/** Valida espelhando o cliente: string, obrigatória, tamanho, formato. */
function cleanField(value: unknown, field: keyof typeof LIMITS): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!v || v.length > LIMITS[field]) return null;
  if (field === "email" && !EMAIL_RE.test(v)) return null;
  return v;
}

/**
 * POST /api/contact: valida o corpo (a validação do cliente é cortesia, a
 * de verdade mora aqui — a rota é alcançável por curl), envia via Resend
 * com replyTo no visitante e responde SEM detalhes internos (erros crus da
 * integração ficam no log do servidor, nunca no corpo da resposta).
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => null);
    const name = cleanField(body?.name, "name");
    const email = cleanField(body?.email, "email");
    const message = cleanField(body?.message, "message");

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Pedro Ernesto <onboarding@resend.dev>",
      to: ["pedroernestovogado@gmail.com"],
      // responder no Gmail responde ao visitante, não ao remetente do Resend
      replyTo: email,
      subject: `New message from ${name} via Portfolio`,
      react: ContactEmail({
        senderName: name,
        senderEmail: email,
        message,
      }),
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: "Failed to send the email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
