import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Heading,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  senderName: string;
  senderEmail: string;
  message: string;
}

export const ContactEmail = ({
  senderName,
  senderEmail,
  message,
}: ContactEmailProps) => (
  <Html>
    <Head />
    <Preview>Nova mensagem do seu portfólio!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Nova Mensagem de Contato</Heading>
        <Section style={section}>
          <Text style={paragraph}>
            Você recebeu uma nova mensagem através do formulário de contato do seu portfólio.
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            <strong>De:</strong> {senderName}
          </Text>
          <Text style={paragraph}>
            <strong>Email:</strong> <a href={`mailto:${senderEmail}`}>{senderEmail}</a>
          </Text>
          <Hr style={hr} />
          <Heading as="h2" style={subHeading}>Mensagem:</Heading>
          <Text style={paragraph}>{message}</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ContactEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  border: '1px solid #f0f0f0',
  borderRadius: '4px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#484848',
};

const subHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#484848',
  marginTop: '20px',
};

const section = {
  padding: '0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#212121',
};

const hr = {
  borderColor: '#f0f0f0',
  margin: '20px 0',
}; 