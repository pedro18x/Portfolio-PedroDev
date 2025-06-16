import { Resend } from 'resend';
import { ContactEmail } from '@/emails/contact-email';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Lida com requisições POST para enviar um email de contato.
 * Espera um corpo de requisição com `name`, `email` e `message`.
 * Valida os dados, envia o email usando Resend e retorna uma resposta JSON.
 *
 * @param {Request} request - O objeto da requisição Next.js.
 * @returns {Promise<NextResponse>} Uma resposta JSON indicando sucesso ou erro.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { name, email, message } = await request.json();

    // Validação simples dos campos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    // Envia o email usando a instância do Resend
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['pedroernestovogado@gmail.com'],
      subject: `Nova mensagem de ${name} via Portfólio`,
      react: ContactEmail({
        senderName: name,
        senderEmail: email,
        message: message,
      }),
    });

    // Se o Resend retornar um erro, encaminha-o
    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { error: 'Erro ao enviar o email.', details: error.message },
        { status: 500 }
      );
    }

    // Retorna uma resposta de sucesso
    return NextResponse.json({ message: 'Email enviado com sucesso!', data });

  } catch (error) {
    console.error('Internal Server Error:', error);
    // Captura erros gerais, como falhas no parsing do JSON
    let errorMessage = 'Ocorreu um erro desconhecido no servidor.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: 'Erro interno do servidor.', details: errorMessage },
      { status: 500 }
    );
  }
} 