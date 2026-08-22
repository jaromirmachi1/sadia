import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SmoothScroll } from "@/components/SmoothScroll";
import { routing } from "@/i18n/routing";
import { getMetadataBase, siteName } from "@/seo/site";

import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#12142e",
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: getMetadataBase(),
    applicationName: siteName,
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider>
          <GoogleAnalytics />
          <SmoothScroll>{children}</SmoothScroll>
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
