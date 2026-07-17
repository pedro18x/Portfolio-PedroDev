import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { site } from "@/lib/content";
import { cn } from "@/lib/utils";

const title = `${site.name} | ${site.role}`;

/**
 * Metadados para SEO e compartilhamento em redes sociais.
 * O favicon vem de `app/icon.svg` (convenção do App Router).
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    template: `%s | ${site.name}`,
    default: title,
  },
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: `${site.name} Portfolio`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${site.name}, ${site.role}`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og-image.png"],
  },
};

/**
 * Layout raiz da aplicação.
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - As páginas a serem renderizadas.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", GeistSans.variable)}>
      <body className="text-base leading-[1.6]">
        {/* Sem JS os reveals do motion nasceriam com opacity:0 inline e a
            página ficaria em branco abaixo do rail; aqui eles falham
            visíveis (o hook data-reveal já existe para o print) */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
