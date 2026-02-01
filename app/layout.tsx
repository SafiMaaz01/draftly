import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "@/components/web/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_CONVEX_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "Draftly - Your Space for Ideas",
    template: "%s | Draftly",
  },
  description:
    "Discover insightful articles, share your thoughts, and join a community of passionate writers and readers.",
  keywords: ["blog", "articles", "writing", "community", "draftly", "ideas"],
  authors: [{ name: "Draftly Team", url: baseUrl }],
  creator: "Draftly",
  publisher: "Draftly",
  applicationName: "Draftly",
  referrer: "origin-when-cross-origin",
  metadataBase: new URL(baseUrl),
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Draftly",
    title: "Draftly - Your Space for Ideas",
    description:
      "Discover insightful articles, share your thoughts, and join a community of passionate writers and readers.",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftly - Your Space for Ideas",
    description:
      "Discover insightful articles, share your thoughts, and join a community of passionate writers.",
    creator: "@draftly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "blog",
  classification: "blogging platform",
};

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8">
            <Suspense>
              <ConvexClientProvider>{children}</ConvexClientProvider>
            </Suspense>
          </main>
          <Toaster closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
