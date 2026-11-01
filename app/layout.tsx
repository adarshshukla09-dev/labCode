import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutContent from "@/components/utlis/layout";
import { seoConfig } from "@/lib/seo";
import { SiteJsonLd } from "@/components/seo/site-json-ld";

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: "%s | Labs",
  },
  description: seoConfig.description,
  ...(seoConfig.siteUrl ? { metadataBase: new URL(seoConfig.siteUrl) } : {}),
  applicationName: seoConfig.name,
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: seoConfig.name,
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.description,
    images: ["/opengraph-image"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon" }],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
   <html
  lang="en"
  suppressHydrationWarning
  className={cn(
    "h-full",
    "antialiased",
    geistSans.variable,
    geistMono.variable,
    "font-sans",
    ibmPlexSans.variable,
    spaceGroteskHeading.variable
  )}
>
      <body className="min-h-full flex flex-col">
        <SiteJsonLd />
        <LayoutContent>
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
