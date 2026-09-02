import type { Metadata, Viewport } from "next";
import React from "react";
import {
  Inter,
  Protest_Revolution,
  Cinzel,
  Cinzel_Decorative,
} from "next/font/google";
import { Preloader, SiteHeader } from "@/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
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
  description:
    "I build full-stack web and mobile products using React.js, Next.js, and React Native up front, with Express, NestJS, MongoDB, and Postgres underneath.",
  applicationName: "M. Ahmer · Software Engineer",
  authors: [{ name: "ahmersdev" }],
  referrer: "origin-when-cross-origin",
  creator: "ahmer",
  publisher: "ahmersdev",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://ahmersdev.com/"),
  openGraph: {
    title: "M. Ahmer · Software Engineer",
    description:
      "I build full-stack web and mobile products using React.js, Next.js, and React Native up front, with Express, NestJS, MongoDB, and Postgres underneath.",
    url: "https://ahmersdev.com/",
    siteName: "M. Ahmer · Software Engineer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "M. Ahmer · Software Engineer",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "M. Ahmer · Software Engineer",
    description:
      "I build full-stack web and mobile products using React.js, Next.js, and React Native up front, with Express, NestJS, MongoDB, and Postgres underneath.",
    creator: "@ahmersdev",
    images: {
      url: "/og-image.png",
      alt: "M. Ahmer · Software Engineer",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark",
  themeColor: "#150b0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${protestRevolution.variable} ${cinzelDecorative.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Preloader />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
