import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sunny's Lab",
  description:
    "An ongoing side practice — motion, material and the browser. Seven frontend experiments, each about one idea, all of them live.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
