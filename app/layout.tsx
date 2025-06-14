import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const title = "Pedro Ernesto | Desenvolvedor Full Stack";
const description = "Portfólio de Pedro Ernesto, um desenvolvedor Full Stack apaixonado por criar soluções inovadoras e eficientes.";
const url = "https://portfolio-pedro18x.vercel.app/"; // Substitua pela URL final do seu projeto
const imageUrl = "https://github.com/pedro18x.png";

export const metadata: Metadata = {
  title: {
    template: '%s | Pedro Ernesto',
    default: 'Pedro Ernesto | Desenvolvedor Full Stack',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-light dark:bg-dark`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 