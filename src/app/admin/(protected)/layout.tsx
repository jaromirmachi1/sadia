import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminLocale } from "@/lib/admin-locale";
import { isSanityWriteConfigured } from "@/sanity/lib/write-client";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "Admin" });

  return (
    <div className="flex h-svh overflow-hidden">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        {!isSanityWriteConfigured ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900">
            {t.rich("sanityWarning", {
              projectId: (chunks) => (
                <code className="rounded bg-white/70 px-1">{chunks}</code>
              ),
              token: (chunks) => (
                <code className="rounded bg-white/70 px-1">{chunks}</code>
              ),
            })}
          </div>
        ) : null}
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
