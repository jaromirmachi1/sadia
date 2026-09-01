"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
} from "@/lib/admin-auth";
import { ADMIN_LOCALE_COOKIE, getAdminLocale } from "@/lib/admin-locale";
import {
  localizedList,
  localizedValue,
  slugifyIdentifier,
  textToPortableText,
  type ProjectFormValues,
} from "@/lib/admin-types";
import { assertWriteClient } from "@/sanity/lib/write-client";
import {
  buildAccessibleImage,
  buildGalleryImage,
  getFileFromFormData,
  getFilesFromFormData,
  InvalidAdminImageError,
  uploadImageAsset,
} from "@/sanity/lib/admin-images";

async function adminError(
  key: "heroRequired" | "invalidPassword" | "invalidImage",
) {
  const locale = await getAdminLocale();
  const t = await getTranslations({ locale, namespace: "Admin.errors" });
  return t(key);
}

async function uploadAdminImage(client: Parameters<typeof uploadImageAsset>[0], file: File) {
  try {
    return await uploadImageAsset(client, file);
  } catch (error) {
    if (error instanceof InvalidAdminImageError) {
      throw new Error(await adminError("invalidImage"));
    }
    throw error;
  }
}

export async function setAdminLocaleAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "") === "en" ? "en" : "cs";
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_LOCALE_COOKIE, locale, {
    path: "/admin",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/admin", "layout");
}

function optionalNumber(formData: FormData, key: string) {
  const raw = String(formData.get(key) ?? "").trim();
  if (!raw) return undefined;
  const value = Number(raw);
  return Number.isNaN(value) ? undefined : value;
}

function parseProjectFormData(formData: FormData): ProjectFormValues {
  const nameCs = String(formData.get("nameCs") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const heroAltCs = String(formData.get("heroAltCs") ?? "").trim();
  const heroAltEn = String(formData.get("heroAltEn") ?? "").trim();

  return {
    nameCs,
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    slug: slugInput || slugifyIdentifier(nameCs),
    status:
      (formData.get("status") as ProjectFormValues["status"]) ?? "upcoming",
    location: String(formData.get("location") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    mapLat: optionalNumber(formData, "mapLat"),
    mapLng: optionalNumber(formData, "mapLng"),
    descriptionCs: String(formData.get("descriptionCs") ?? "").trim(),
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim(),
    completionDate: String(formData.get("completionDate") ?? "").trim() || undefined,
    badgeCs: String(formData.get("badgeCs") ?? "").trim() || undefined,
    badgeEn: String(formData.get("badgeEn") ?? "").trim() || undefined,
    taglineCs: String(formData.get("taglineCs") ?? "").trim() || undefined,
    taglineEn: String(formData.get("taglineEn") ?? "").trim() || undefined,
    website: String(formData.get("website") ?? "").trim() || undefined,
    unitCount: optionalNumber(formData, "unitCount"),
    showOnHomepage: formData.get("showOnHomepage") === "on",
    salesMode:
      (formData.get("salesMode") as ProjectFormValues["salesMode"]) ?? "soldByUs",
    heroAltCs: heroAltCs || nameCs,
    heroAltEn: heroAltEn || String(formData.get("nameEn") ?? "").trim() || nameCs,
    removeGalleryKeys: formData
      .getAll("removeGallery")
      .map((value) => String(value))
      .filter(Boolean),
  };
}

type ExistingProjectImages = {
  heroImage?: {
    asset?: { _ref: string };
    alt?: { cs?: string; en?: string };
  } | null;
  gallery?: Array<{
    _key?: string;
    asset?: { _ref: string };
    alt?: { cs?: string; en?: string };
  }> | null;
};

async function resolveProjectImages(
  formData: FormData,
  values: ProjectFormValues,
  options: {
    requireHero?: boolean;
    existing?: ExistingProjectImages | null;
  } = {},
) {
  const client = assertWriteClient();
  const heroFile = getFileFromFormData(formData, "heroImage");
  const galleryFiles = getFilesFromFormData(formData, "gallery");
  const galleryAltCs = String(formData.get("galleryAltCs") ?? "").trim() || values.heroAltCs;
  const galleryAltEn = String(formData.get("galleryAltEn") ?? "").trim() || values.heroAltEn;

  let heroImage = options.existing?.heroImage ?? undefined;

  if (heroFile) {
    const asset = await uploadAdminImage(client, heroFile);
    heroImage = buildAccessibleImage(asset._id, values.heroAltCs, values.heroAltEn);
  } else if (heroImage?.asset?._ref) {
    heroImage = {
      ...heroImage,
      alt: {
        cs: values.heroAltCs,
        en: values.heroAltEn,
      },
    };
  } else if (options.requireHero) {
    throw new Error(await adminError("heroRequired"));
  }

  let gallery = (options.existing?.gallery ?? []).filter(
    (image) => image._key && !values.removeGalleryKeys.includes(image._key),
  );

  if (galleryFiles.length > 0) {
    const uploadedGallery = await Promise.all(
      galleryFiles.map(async (file) => {
        const asset = await uploadAdminImage(client, file);
        return buildGalleryImage(asset._id, galleryAltCs, galleryAltEn);
      }),
    );

    gallery = [...gallery, ...uploadedGallery];
  }

  return {
    heroImage,
    gallery,
  };
}

function buildProjectFields(values: ProjectFormValues): Record<string, unknown> {
  const badge = localizedValue(values.badgeCs, values.badgeEn);
  const tagline = localizedValue(values.taglineCs, values.taglineEn);

  const doc: Record<string, unknown> = {
    name: {
      cs: values.nameCs,
      en: values.nameEn,
    },
    slug: {
      _type: "slug",
      current: values.slug,
    },
    status: values.status,
    salesMode: values.salesMode,
    showOnHomepage: values.showOnHomepage,
    location: values.location,
    address: values.address,
    description: {
      cs: textToPortableText(values.descriptionCs),
      en: textToPortableText(values.descriptionEn),
    },
  };

  if (badge) doc.badge = badge;
  if (tagline) doc.tagline = tagline;
  if (values.website) doc.website = values.website;
  if (typeof values.unitCount === "number") {
    doc.unitCount = values.unitCount;
  }
  if (
    typeof values.mapLat === "number" &&
    typeof values.mapLng === "number"
  ) {
    doc.geo = {
      _type: "geopoint",
      lat: values.mapLat,
      lng: values.mapLng,
    };
  }
  if (values.completionDate) {
    doc.completionDate = values.completionDate;
  }

  return doc;
}

function buildProjectDocument(values: ProjectFormValues): Record<string, unknown> {
  return {
    _type: "project",
    ...buildProjectFields(values),
  };
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath("/projekty");
  revalidatePath("/en/projects");

  if (slug) {
    revalidatePath(`/projekty/${slug}`);
    revalidatePath(`/en/projects/${slug}`);
  }
}

export type AdminLoginState = {
  error?: string;
};

export async function loginAdminAction(
  _prevState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");

  if (!(await setAdminSession(password))) {
    return { error: await adminError("invalidPassword") };
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function createProjectFormAction(formData: FormData) {
  await createProjectAction(formData);
}

export async function updateProjectFormAction(id: string, formData: FormData) {
  return updateProjectAction(id, formData);
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseProjectFormData(formData);
  const images = await resolveProjectImages(formData, values, { requireHero: true });

  const doc = {
    ...buildProjectDocument(values),
    heroImage: images.heroImage,
    gallery: images.gallery,
  } as unknown as { _type: string; [key: string]: unknown };

  const created = await client.create(doc);

  revalidateProjectPaths(values.slug);

  redirect(`/admin/projects/${created._id}`);
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseProjectFormData(formData);

  const existing = await client.fetch<ExistingProjectImages | null>(
    `*[_type == "project" && _id == $id][0] {
      heroImage,
      gallery
    }`,
    { id },
  );

  const images = await resolveProjectImages(formData, values, { existing });

  const fields = {
    ...buildProjectFields(values),
    ...(images.heroImage ? { heroImage: images.heroImage } : {}),
    gallery: images.gallery,
  };

  const patch = client.patch(id).set(fields);
  const unset: string[] = [
    "type",
    "amenities",
    "downloads",
    "timeline",
    "landmarks",
    "handover",
    "locationDescription",
  ];

  if (values.completionDate) {
    patch.set({ completionDate: values.completionDate });
  } else {
    unset.push("completionDate");
  }

  if (!values.badgeCs && !values.badgeEn) unset.push("badge");
  if (!values.taglineCs && !values.taglineEn) unset.push("tagline");
  if (!values.website) unset.push("website");
  if (typeof values.unitCount !== "number") unset.push("unitCount");
  if (typeof values.mapLat !== "number" || typeof values.mapLng !== "number") {
    unset.push("geo");
  }

  if (unset.length > 0) {
    patch.unset(unset);
  }

  await patch.commit();

  revalidateProjectPaths(values.slug);
  revalidatePath(`/admin/projects/${id}`);

  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const client = assertWriteClient();

  const project = await client.fetch<{ slug: string }>(
    `*[_type == "project" && _id == $id][0] {
      "slug": slug.current
    }`,
    { id },
  );

  await client.delete(id);

  revalidateProjectPaths(project?.slug);

  redirect("/admin/projects");
}
