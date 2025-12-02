import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@/lib/analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FlatWP - Modern Headless WordPress Starter Kit",
    template: "%s | FlatWP",
  },
  description:
    "Build blazing-fast WordPress sites with Next.js 14, TypeScript, and GraphQL. Production-ready headless WordPress starter with ISR, static generation, and optimal performance.",
  keywords: [
    "headless wordpress",
    "nextjs wordpress",
    "wordpress graphql",
    "headless cms",
    "typescript wordpress",
    "wordpress starter",
    "modern wordpress",
    "wordpress nextjs",
  ],
  authors: [{ name: "FlatWP" }],
  creator: "FlatWP",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://flatwp.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "FlatWP - Modern Headless WordPress Starter Kit",
    description:
      "Build blazing-fast WordPress sites with Next.js 14, TypeScript, and GraphQL.",
    siteName: "FlatWP",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlatWP - Modern Headless WordPress Starter Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlatWP - Modern Headless WordPress Starter Kit",
    description:
      "Build blazing-fast WordPress sites with Next.js 14, TypeScript, and GraphQL.",
    images: ["/og-image.png"],
    creator: "@flatwp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
