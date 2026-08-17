import { setAdminLocaleAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import type { AdminLocale } from "@/lib/admin-locale";

type AdminLocaleSwitcherProps = {
  locale: AdminLocale;
  className?: string;
};

export function AdminLocaleSwitcher({
  locale,
  className,
}: AdminLocaleSwitcherProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.14em]",
        className,
      )}
    >
      <form action={setAdminLocaleAction}>
        <input type="hidden" name="locale" value="cs" />
        <button
          type="submit"
          className={cn(
            "transition-opacity",
            locale === "cs" ? "text-foreground" : "text-muted-foreground/55 hover:text-foreground",
          )}
        >
          CZ
        </button>
      </form>
      <span className="text-muted-foreground/40">/</span>
      <form action={setAdminLocaleAction}>
        <input type="hidden" name="locale" value="en" />
        <button
          type="submit"
          className={cn(
            "transition-opacity",
            locale === "en" ? "text-foreground" : "text-muted-foreground/55 hover:text-foreground",
          )}
        >
          EN
        </button>
      </form>
    </div>
  );
}
