import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAdminT } from "@/lib/admin-locale";
import { getAdminProject } from "@/sanity/lib/admin-fetch";

type AdminEditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;
  const [{ t }, project] = await Promise.all([getAdminT(), getAdminProject(id)]);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">
            {t("projectsPage.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium">
            {t("projectForm.editTitle", { name: project.name })}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/projects" className={buttonVariants({ variant: "outline" })}>
            {t("actions.back")}
          </Link>
          <DeleteProjectButton projectId={project._id} label={project.name} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("projectForm.details")}</CardTitle>
          <CardDescription>
            {t("projectForm.editDescription", { slug: project.slug })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectForm
            mode="edit"
            projectId={project._id}
            heroImage={project.heroImage}
            gallery={project.gallery}
            defaultValues={{
              nameCs: project.nameCs,
              nameEn: project.nameEn,
              slug: project.slug,
              status: project.status,
              salesMode: project.salesMode,
              location: project.location,
              address: project.address,
              mapLat: project.geo?.lat,
              mapLng: project.geo?.lng,
              completionDate: project.completionDate,
              badgeCs: project.badgeCs,
              badgeEn: project.badgeEn,
              taglineCs: project.taglineCs,
              taglineEn: project.taglineEn,
              website: project.website,
              showOnHomepage: project.showOnHomepage,
              heroAltCs: project.heroImage?.altCs,
              heroAltEn: project.heroImage?.altEn,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
