import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "hello-sunny-dev/lab",
  description:
    "A collection of weekend-sized creative frontend experiments — interactive experiences, motion, WebGL, and spatial UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
