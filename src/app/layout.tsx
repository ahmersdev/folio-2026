import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import { Header, Preloader } from "@/layout";
import "./globals.css";
import { ReactNode } from "react";
import CustomCursor from "@/components/custom-cursor";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmer Dock | Full Stack Developer, React & Next.js",
  description:
    "Full stack developer helping founders turn ideas into fast, reliable web and mobile products, built end to end with React, Next.js, and Node.js.",
  applicationName: "Ahmer Dock | Full Stack Developer, React & Next.js",
  authors: [{ name: "ahmerdock" }],
  referrer: "origin-when-cross-origin",
  creator: "ahmer",
  publisher: "ahmerdock",
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
  metadataBase: new URL("https://ahmerdock.com/"),
  openGraph: {
    title: "Ahmer Dock | Full Stack Developer, React & Next.js",
    description:
      "Full stack developer helping founders turn ideas into fast, reliable web and mobile products, built end to end with React, Next.js, and Node.js.",
    url: "https://ahmerdock.com/",
    siteName: "Ahmer Dock | Full Stack Developer, React & Next.js",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ahmer Dock | Full Stack Developer, React & Next.js",
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmer Dock | Full Stack Developer, React & Next.js",
    description:
      "Full stack developer helping founders turn ideas into fast, reliable web and mobile products, built end to end with React, Next.js, and Node.js.",
    creator: "@ahmerdock",
    images: {
      url: "/og-image.png",
      alt: "Ahmer Dock | Full Stack Developer, React & Next.js",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark",
  themeColor: "#B63331",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CustomCursor />
        <Preloader />
        <Header />
        {children}
      </body>
    </html>
  );
}
