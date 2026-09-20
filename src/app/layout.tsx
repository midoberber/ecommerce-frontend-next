import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/session-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSession } from "@/lib/server-api";
import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-sans",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "متجري",
    template: "%s | متجري",
  },
  description: "متجر إلكتروني تعليمي مبني بـ NestJS و Next.js",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <DirectionProvider dir="rtl">
          <SessionProvider user={user}>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster position="top-center" />
          </SessionProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}
