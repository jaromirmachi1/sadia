"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import {
  loginAdminAction,
  type AdminLoginState,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const t = useTranslations("Admin.login");
  const [state, action, isPending] = useActionState<AdminLoginState, FormData>(
    loginAdminAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {state.error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(state.error)}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
