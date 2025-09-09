import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title:
    "Extension Image Converter — Microsoft Edge Add-ons Assets | Himanshu Kumar Dutt",
  description:
    "Professional tool for creating Microsoft Edge Add-ons store images. Convert and resize to exact specifications: Small promotional tile (440x280px), Large promotional tile (1400x560px), Screenshots (1280x800px or 640x400px). Instant PNG export.",
  keywords: [
    "Microsoft Edge Add-ons",
    "Edge extension images",
    "extension promotional tiles",
    "Edge store screenshots",
    "440x280 promotional tile",
    "1400x560 large tile",
    "1280x800 screenshot",
    "640x400 screenshot",
    "Edge extension assets",
    "browser extension images",
    "PNG converter",
  ],
  authors: [{ name: "Himanshu Kumar Dutt" }],
  creator: "Himanshu Kumar Dutt",
  publisher: "Himanshu Kumar Dutt",
  robots: "index, follow",
  openGraph: {
    title: "Extension Image Converter — Microsoft Edge Add-ons Assets",
    description:
      "Create perfect Microsoft Edge Add-ons store images with exact specifications for promotional tiles and screenshots. Instant PNG export.",
    type: "website",
    locale: "en_US",
    siteName: "Extension Image Converter by Himanshu Kumar Dutt",
  },
  twitter: {
    card: "summary_large_image",
    title: "Extension Image Converter — Microsoft Edge Add-ons Assets",
    description:
      "Create perfect Microsoft Edge Add-ons store images with exact specifications for promotional tiles and screenshots. Instant PNG export.",
    creator: "@himanshukumardutt",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1e293b",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/favicon.ico" },
  ],
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
      <body>
        <>{children}</>
      </body>
    </html>
  );
}
