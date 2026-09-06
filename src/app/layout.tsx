import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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

const siteUrl = "https://cipher.build";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Cipher — AI × Web Developer",
  description:
    "Cipher is an AI × Web Developer building modern digital products, web experiences and experiments.",
  keywords: [
    "Cipher",
    "AI developer",
    "web developer",
    "product developer",
    "portfolio",
    "Next.js",
    "Pakistan",
  ],
  authors: [{ name: "Cipher" }],
  creator: "Cipher",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Cipher — AI × Web Developer",
    description:
      "I build useful digital products with AI & the web. From prototype to deployment.",
    url: siteUrl,
    siteName: "Cipher — Portfolio",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Cipher — AI × Web Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cipher — AI × Web Developer",
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
  name: "Cipher",
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
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "999px",
              border: "1px solid #1111111f",
              background: "#111111",
              color: "#F5F3EE",
              fontSize: "12.5px",
            },
          }}
        />
      </body>
    </html>
  );
}
