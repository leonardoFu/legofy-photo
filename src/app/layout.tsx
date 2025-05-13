import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import "./[lang]/globals.css";
import { generateStaticParams } from "./[lang]/config";

export { generateStaticParams };

const geistSans = Geist({
  variable: "--font-geist-sans",
  weight: "variable",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: "variable",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Legofy Photo",
  description: "Transform your photos into LEGO-style artwork",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {children}
        <Toaster position="top-center" />
        <Analytics mode="auto" />
      </body>
    </html>
  );
} 