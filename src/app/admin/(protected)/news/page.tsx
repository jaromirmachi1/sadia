import Link from "next/link";
import { Plus } from "lucide-react";

import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminT } from "@/lib/admin-locale";
import { getAdminNewsArticles } from "@/sanity/lib/admin-fetch";

function formatPublishedAt(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "cs-CZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminNewsPage() {
  const [{ t, locale }, articles] = await Promise.all([
    getAdminT(),
    getAdminNewsArticles(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("newsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("newsPage.title")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("newsPage.description")}
          </p>
        </div>
        <Link href="/admin/news/new" className={buttonVariants()}>
          <Plus className="size-4" />
          {t("nav.addNews")}
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("newsPage.columns.title")}</TableHead>
              <TableHead>{t("newsPage.columns.publishedAt")}</TableHead>
              <TableHead>{t("newsPage.columns.project")}</TableHead>
              <TableHead>{t("newsPage.columns.slug")}</TableHead>
              <TableHead className="text-right">{t("newsPage.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {t("newsPage.empty")}
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article._id}>
                  <TableCell className="max-w-xs">
                    <p className="font-medium">{article.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>
                  </TableCell>
                  <TableCell>{formatPublishedAt(article.publishedAt, locale)}</TableCell>
                  <TableCell>{article.relatedProjectName ?? "—"}</TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                      {article.slug}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/news/${article._id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        {t("actions.edit")}
                      </Link>
                      <DeleteNewsButton articleId={article._id} label={article.title} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
