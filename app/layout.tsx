import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pedro Ernesto | Desenvolvedor Full Stack",
  description: "Portfólio de Pedro Ernesto, um desenvolvedor Full Stack apaixonado por criar soluções inovadoras e eficientes.",
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