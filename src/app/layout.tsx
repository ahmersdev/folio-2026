import type { Metadata } from "next";
import React from "react";
import {
  Bebas_Neue,
  Inter,
  Protest_Revolution,
  Water_Brush,
} from "next/font/google";
import { SiteHeader } from "@/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const protestRevolution = Protest_Revolution({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const waterBrush = Water_Brush({
  variable: "--font-brush",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "M. Ahmer · Software Engineer",
  description: "Portfolio of Ahmer, a software engineer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable} ${protestRevolution.variable} ${waterBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
