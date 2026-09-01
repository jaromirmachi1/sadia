import Link from "next/link";
import { Building2, LayoutDashboard, LogOut, Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { logoutAdminAction } from "@/app/admin/actions";
import { AdminLocaleSwitcher } from "@/components/admin/AdminLocaleSwitcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdminLocale } from "@/lib/admin-locale";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  className?: string;
};

export async function AdminSidebar({ className }: AdminSidebarProps) {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "Admin" });

  const navItems = [
    { href: "/admin", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/admin/projects", label: t("nav.projects"), icon: Building2 },
  ] as const;

  return (
    <aside
      className={cn(
        "flex h-svh w-64 shrink-0 flex-col border-r border-border bg-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 px-6 py-6">
        <Link href="/admin" className="block">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            SADIA
          </p>
          <p className="mt-1 font-display text-xl font-medium text-foreground">
            {t("nav.brand")}
          </p>
        </Link>
        <AdminLocaleSwitcher locale={locale} className="pt-1" />
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="space-y-3 border-t border-border p-4">
        <Link href="/admin/projects/new" className={buttonVariants({ className: "w-full" })}>
          <Plus className="size-4" />
          {t("nav.addProject")}
        </Link>

        <form action={logoutAdminAction}>
          <Button type="submit" variant="outline" className="w-full">
            <LogOut className="size-4" />
            {t("nav.signOut")}
          </Button>
        </form>

        <Link
          href="/studio"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({ variant: "ghost", className: "w-full" })}
        >
          {t("nav.studio")}
        </Link>
      </div>
    </aside>
  );
}
