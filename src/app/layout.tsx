import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: 'Centro de Control HSCI | Monitoreo en tiempo real',
  description: 'Sistema de supervisión continua para infraestructura hídrica',
  openGraph: {
    title: 'Centro de Control HSCI | Monitoreo en tiempo real',
    description: 'Sistema de supervisión continua para infraestructura hídrica',
    url: 'https://sistema.hcsicr.com/',
    siteName: 'Centro de Control HSCI',
    images: [
      {
        url: '/og-image.jpg', // Asegúrate de tener esta imagen en la carpeta public
        width: 1200,
        height: 630,
        alt: 'Monitoreo de sistemas hídricos HSCI',
      },
    ],
    locale: 'es_CR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Centro de Control HSCI | Monitoreo en tiempo real',
    description: 'Sistema de supervisión continua para infraestructura hídrica',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
