"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { AdminUnit } from "@/lib/admin-types";

const statusVariant: Record<
  AdminUnit["status"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  reserved: "secondary",
  sold: "outline",
  soldThirdParty: "outline",
  rented: "outline",
};

export function UnitStatusBadge({ status }: { status: AdminUnit["status"] }) {
  const t = useTranslations("Admin.unitStatus");

  return <Badge variant={statusVariant[status]}>{t(status)}</Badge>;
}

export function DealTypeBadge({ dealType }: { dealType: AdminUnit["dealType"] }) {
  const t = useTranslations("Admin.dealType");

  return <Badge variant="outline">{t(dealType)}</Badge>;
}
