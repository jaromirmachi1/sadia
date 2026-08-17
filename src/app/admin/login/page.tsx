import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { loginAdminAction } from "@/app/admin/actions";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher";
import { isAdminAuthConfigured, isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            <form action={loginAdminAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {t("signIn")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
