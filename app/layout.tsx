import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const title = "Pedro Ernesto | Desenvolvedor Full Stack";
const description = "Portfólio de Pedro Ernesto, um desenvolvedor Full Stack apaixonado por criar soluções inovadoras e eficientes.";
const url = "https://pedro-dev.vercel.app/";
const imageUrl = "https://github.com/pedro18x.png";

/**
 * Metadados para SEO e compartilhamento em redes sociais.
 * A propriedade `title.template` permite que páginas filhas personalizem o título,
 * inserindo seu próprio valor no lugar de `%s`.
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Pedro Ernesto',
    default: title,
  },
  description,
  openGraph: {
    title,
    description,
    url,
    siteName: "Portfólio Pedro Ernesto",
    images: [
      {
        url: imageUrl,
        width: 800,
        height: 800,
        alt: "Foto de Pedro Ernesto",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [imageUrl],
  },
};

/**
 * Layout raiz da aplicação.
 * Envolve todo o conteúdo com os provedores de contexto necessários e define a estrutura HTML base.
 * @param {object} props - As propriedades do componentes. 
 * @param {React.ReactNode} props.children - As páginas e outros layouts a serem renderizados.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
} 