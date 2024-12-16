// src/app/layout.tsx

import type { Metadata } from "next";
import { Providers } from './providers';
import { AuthProvider } from './contexts/AuthContext';
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
  title: "ValueVerse",
  description: "Access a curated collection of detailed discounted cash flow models for value investing.",
  keywords: ["DCF", "Financial Models", "Value Investing", "Stock Analysis"],
  authors: [{ name: "ValueVerse" }],
  icons: {
    icon: [
      { url: "/favicon.svg" },
      // Also provide PNG fallback for older browsers
      { url: "/favicon.ico" }
    ],
    // For iOS devices
    apple: [
      { url: "/apple-touch-icon.png" }
    ]
  },
  openGraph: {
    title: "ValueVerse | Professional DCF Models",
    description: "Access a curated collection of detailed discounted cash flow models.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}