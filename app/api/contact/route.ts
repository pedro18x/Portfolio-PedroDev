import { Resend } from 'resend';
import { ContactEmail } from '@/emails/contact-email';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <contato@contatopedro.on.resend.email>', // PRECISA SER UM DOMÍNIO VERIFICADO
      to: ['pedroernestovogado@gmail.com'], // O email que RECEBERÁ a mensagem
      subject: `Nova mensagem de ${name} via Portfólio`,
      react: ContactEmail({
        senderName: name,
        senderEmail: email,
        message: message,
      }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Email enviado com sucesso!', data });
  } catch (error) {
    let errorMessage = 'Ocorreu um erro desconhecido.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 