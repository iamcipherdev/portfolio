import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://lunar.build";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lunar — AI × Web Developer",
  description:
    "Lunar is an AI × Web Developer building modern digital products, web experiences and experiments.",
  keywords: [
    "Lunar",
    "AI developer",
    "web developer",
    "product developer",
    "portfolio",
    "Next.js",
    "Pakistan",
  ],
  authors: [{ name: "Lunar" }],
  creator: "Lunar",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Lunar — AI × Web Developer",
    description:
      "I build useful digital products with AI & the web. From prototype to deployment.",
    url: siteUrl,
    siteName: "Lunar — Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Lunar — AI × Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lunar — AI × Web Developer",
    description:
      "I build useful digital products with AI & the web. From prototype to deployment.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F3EE",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lunar",
  alternateName: "Cipher",
  jobTitle: "AI × Web Developer",
  url: siteUrl,
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
  },
  knowsAbout: [
    "AI product development",
    "Web development",
    "Rapid prototyping",
    "Product design",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} grain antialiased bg-background text-foreground font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
