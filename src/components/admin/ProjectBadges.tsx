"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@/lib/admin-types";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const t = useTranslations("Admin.projectStatus");

  return <Badge variant="secondary">{t(status)}</Badge>;
}
