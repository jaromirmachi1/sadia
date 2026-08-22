import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";
import { NewsForm } from "@/components/admin/NewsForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminT } from "@/lib/admin-locale";
import { getAdminNewsArticle, getAdminProjects } from "@/sanity/lib/admin-fetch";

type AdminEditNewsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditNewsPage({ params }: AdminEditNewsPageProps) {
  const { id } = await params;
  const [{ t }, article, projects] = await Promise.all([
    getAdminT(),
    getAdminNewsArticle(id),
    getAdminProjects(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("newsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("newsForm.editTitle", { name: article.title })}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/news" className={buttonVariants({ variant: "outline" })}>
            {t("actions.back")}
          </Link>
          <DeleteNewsButton articleId={article._id} label={article.title} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("newsForm.details")}</CardTitle>
          <CardDescription>
            {t("newsForm.editDescription", { slug: article.slug })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewsForm
            mode="edit"
            articleId={article._id}
            projects={projects}
            heroImage={article.heroImage}
            defaultValues={{
              titleCs: article.titleCs,
              titleEn: article.titleEn,
              slug: article.slug,
              excerptCs: article.excerptCs,
              excerptEn: article.excerptEn,
              bodyCs: article.bodyCs,
              bodyEn: article.bodyEn,
              publishedAt: article.publishedAt,
              relatedProjectId: article.relatedProjectId,
              heroAltCs: article.heroImage?.altCs,
              heroAltEn: article.heroImage?.altEn,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
