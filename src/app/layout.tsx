import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e293b",
};

export const metadata: Metadata = {
  title:
    "Extension Image Converter — Chrome & Microsoft Edge Extension Assets | Himanshu Kumar Dutt",
  description:
    "Professional tool for creating Chrome and Microsoft Edge extension store images. Convert and resize to exact specifications: Small promotional tile (440x280px), Large promotional tile (1400x560px), Screenshots (1280x800px or 640x400px). Instant PNG export.",
  keywords: [
    "Chrome Web Store",
    "Microsoft Edge Add-ons",
    "Chrome extension images",
    "Edge extension images",
    "extension promotional tiles",
    "Chrome store screenshots",
    "Edge store screenshots",
    "440x280 promotional tile",
    "1400x560 large tile",
    "1280x800 screenshot",
    "640x400 screenshot",
    "Chrome extension assets",
    "Edge extension assets",
    "browser extension images",
    "PNG converter",
  ],
  authors: [{ name: "Himanshu Kumar Dutt" }],
  creator: "Himanshu Kumar Dutt",
  publisher: "Himanshu Kumar Dutt",
  robots: "index, follow",
  openGraph: {
    title:
      "Extension Image Converter — Chrome & Microsoft Edge Extension Assets",
    description:
      "Create perfect Chrome and Microsoft Edge extension store images with exact specifications for promotional tiles and screenshots. Instant PNG export.",
    type: "website",
    locale: "en_US",
    siteName: "Extension Image Converter by Himanshu Kumar Dutt",
    url: "https://extension-image-converter.vercel.app",
    images: [
      {
        url: "https://extension-image-converter.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Extension Image Converter - Chrome & Microsoft Edge Extension Assets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Extension Image Converter — Chrome & Microsoft Edge Extension Assets",
    description:
      "Create perfect Chrome and Microsoft Edge extension store images with exact specifications for promotional tiles and screenshots. Instant PNG export.",
    creator: "@himanshukumardutt",
    images: ["https://extension-image-converter.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://extension-image-converter.vercel.app",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
  manifest: "/manifest.json",
  category: "developer tools",

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Extension Image Converter",
      description:
        "Professional tool for creating Chrome and Microsoft Edge extension store images with exact specifications",
      url: "https://extension-image-converter.vercel.app",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      author: {
        "@type": "Person",
        name: "Himanshu Kumar Dutt",
        url: "https://github.com/HimanshuKumarDutt094",
      },
      publisher: {
        "@type": "Person",
        name: "Himanshu Kumar Dutt",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Convert images to Chrome Web Store and Microsoft Edge Add-ons specifications",
        "Small promotional tile (440x280px)",
        "Large promotional tile (1400x560px)",
        "Screenshots (1280x800px and 640x400px)",
        "Instant PNG export",
        "Local processing - no server upload",
      ],
    }),
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
