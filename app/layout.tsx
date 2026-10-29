import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/blocks/navbar";
import { FooterWordmark } from "@/components/blocks/footer-wordmark";
import { ThemeProvider } from "@/components/utlis/theme-provider";
import LayoutContent from "@/components/utlis/layout";

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
    default: "xyzlabs",
    template: "%s | xyzlabs",
  },
  description: "Escape tutorial hell. Learn databases through hands-on labs.",
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
         <LayoutContent>
           {children}
          </LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}