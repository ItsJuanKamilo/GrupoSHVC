import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DynamicHeader from "./components/DynamicHeader";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grupo SHVC",
  description: "Grupo SHVC es una constructora líder especializada en proyectos residenciales y comerciales. Ofrecemos servicios de construcción de alta calidad con atención personalizada a cada cliente.",
  keywords: "constructora, construcción, proyectos residenciales, obras comerciales, Grupo SHVC",
  authors: [{ name: "Grupo SHVC" }],
  icons: {
    icon: "/Logo2.png",
    shortcut: "/Logo2.png",
    apple: "/Logo2.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/Logo2.png" type="image/png" />
        <link rel="shortcut icon" href="/Logo2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Logo2.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DynamicHeader />

        {children}
        <Footer />
      </body>
    </html>
  );
}
