import type { Metadata } from "next";
import React from "react";
import {
  Bebas_Neue,
  Inter,
  Protest_Revolution,
  Cinzel,
  Cinzel_Decorative,
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
  variable: "--font-protest-revolution",
  weight: "400",
  subsets: ["latin"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  weight: "400",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
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
      className={`${inter.variable} ${bebasNeue.variable} ${protestRevolution.variable} ${cinzelDecorative.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
