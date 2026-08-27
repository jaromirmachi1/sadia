import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminLocale } from "@/lib/admin-locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const configured = isAdminAuthConfigured();
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "Admin.login" });

  return (
    <main className="flex min-h-svh items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle>{t("title")}</CardTitle>
            <AdminLocaleSwitcher locale={locale} />
          </div>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          {!configured ? (
            <p className="text-sm text-muted-foreground">
              {t.rich("missingPassword", {
                name: (chunks) => (
                  <code className="rounded bg-muted px-1 py-0.5">{chunks}</code>
                ),
              })}
            </p>
          ) : (
            <AdminLoginForm />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
