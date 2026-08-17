import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAdminMessages } from "@/lib/admin-locale";

import "@/app/globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { messages } = await getAdminMessages();
  const admin = messages.Admin as { metaTitle: string };

  return {
    title: admin.metaTitle,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { locale, messages } = await getAdminMessages();

  return (
    <html lang={locale}>
      <body className="min-h-svh bg-background font-body text-foreground antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TooltipProvider>
            {children}
            <Toaster richColors closeButton />
          </TooltipProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
