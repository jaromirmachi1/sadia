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
  type NewsFormValues,
  type ProjectFormValues,
  type UnitFormValues,
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
  key:
    | "photoRequired"
    | "heroRequired"
    | "invalidPassword"
    | "deleteProjectHasUnits"
    | "invalidImage",
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

function parseUnitFormData(formData: FormData): UnitFormValues {
  const identifier = String(formData.get("identifier") ?? "").trim();

  return {
    projectId: String(formData.get("projectId") ?? ""),
    identifier,
    layout: String(formData.get("layout") ?? "2+kk"),
    unitType:
      formData.get("unitType") === "commercial" ? "commercial" : "apartment",
    areaM2: Number(formData.get("areaM2") ?? 0),
    floor: Number(formData.get("floor") ?? 0),
    price: optionalNumber(formData, "price"),
    currency: (formData.get("currency") as "CZK" | "EUR") ?? "CZK",
    priceOnRequest: formData.get("priceOnRequest") === "on",
    status: (formData.get("status") as UnitFormValues["status"]) ?? "available",
    dealType: (formData.get("dealType") as UnitFormValues["dealType"]) ?? "rent",
    featured: formData.get("featured") === "on",
    photoAltCs:
      String(formData.get("photoAltCs") ?? "").trim() || identifier,
    photoAltEn:
      String(formData.get("photoAltEn") ?? "").trim() || identifier,
    floorPlanAltCs:
      String(formData.get("floorPlanAltCs") ?? "").trim() ||
      `Půdorys ${identifier}`,
    floorPlanAltEn:
      String(formData.get("floorPlanAltEn") ?? "").trim() ||
      `Floor plan ${identifier}`,
    removePhotoKeys: formData
      .getAll("removePhotos")
      .map((value) => String(value))
      .filter(Boolean),
    removeFloorPlan: formData.get("removeFloorPlan") === "on",
    orientation: String(formData.get("orientation") ?? "").trim() || undefined,
    cellarM2: optionalNumber(formData, "cellarM2"),
    balconyM2: optionalNumber(formData, "balconyM2"),
    loggiaM2: optionalNumber(formData, "loggiaM2"),
    terraceM2: optionalNumber(formData, "terraceM2"),
    gardenM2: optionalNumber(formData, "gardenM2"),
    externalUrl: String(formData.get("externalUrl") ?? "").trim() || undefined,
  };
}

function setOptionalNumber(
  doc: Record<string, unknown>,
  key: string,
  value?: number,
) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    doc[key] = value;
  }
}

function buildUnitDocument(values: UnitFormValues): Record<string, unknown> {
  const slug = slugifyIdentifier(values.identifier);

  const doc: Record<string, unknown> = {
    _type: "unit",
    project: {
      _type: "reference",
      _ref: values.projectId,
    },
    identifier: values.identifier.trim(),
    slug: {
      _type: "slug",
      current: slug,
    },
    layout: values.layout,
    unitType: values.unitType,
    areaM2: values.areaM2,
    floor: values.floor,
    currency: values.currency,
    priceOnRequest: values.priceOnRequest,
    status: values.status,
    dealType: values.dealType,
    featured: values.featured,
  };

  if (values.orientation) {
    doc.orientation = values.orientation;
  }

  if (values.externalUrl) {
    doc.externalUrl = values.externalUrl;
  }

  setOptionalNumber(doc, "cellarM2", values.cellarM2);
  setOptionalNumber(doc, "balconyM2", values.balconyM2);
  setOptionalNumber(doc, "loggiaM2", values.loggiaM2);
  setOptionalNumber(doc, "terraceM2", values.terraceM2);
  setOptionalNumber(doc, "gardenM2", values.gardenM2);

  if (!values.priceOnRequest) {
    doc.price = values.price ?? 0;
  }

  return doc;
}

function unitUnsetFields(values: UnitFormValues) {
  const unset: string[] = ["outdoorM2"];

  if (!values.orientation) unset.push("orientation");
  if (typeof values.cellarM2 !== "number") unset.push("cellarM2");
  if (typeof values.balconyM2 !== "number") unset.push("balconyM2");
  if (typeof values.loggiaM2 !== "number") unset.push("loggiaM2");
  if (typeof values.terraceM2 !== "number") unset.push("terraceM2");
  if (typeof values.gardenM2 !== "number") unset.push("gardenM2");
  if (values.status !== "soldThirdParty" || !values.externalUrl) {
    unset.push("externalUrl");
  }

  return unset;
}

function unitReference(unitId: string) {
  return {
    _key: unitId.replace(/[^a-zA-Z0-9_-]/g, "").slice(-24) ||
      Math.random().toString(36).slice(2, 10),
    _type: "reference" as const,
    _ref: unitId,
  };
}

async function getProjectSlug(projectId: string) {
  const client = assertWriteClient();
  return client.fetch<string | null>(
    `*[_type == "project" && _id == $id][0].slug.current`,
    { id: projectId },
  );
}

async function attachUnitToProject(projectId: string, unitId: string) {
  if (!projectId || !unitId) return;

  const client = assertWriteClient();
  await client
    .patch(projectId)
    .setIfMissing({ units: [] })
    .unset([`units[_ref=="${unitId}"]`])
    .append("units", [unitReference(unitId)])
    .commit({ autoGenerateArrayKeys: true });
}

async function detachUnitFromProject(projectId: string, unitId: string) {
  if (!projectId || !unitId) return;

  const client = assertWriteClient();
  await client
    .patch(projectId)
    .unset([`units[_ref=="${unitId}"]`])
    .commit();
}

async function revalidateUnitPublicPaths(projectId?: string | null) {
  revalidatePath("/admin");
  revalidatePath("/admin/units");
  revalidatePath("/nabidka");
  revalidatePath("/en/availability");
  revalidatePath("/projekty");
  revalidatePath("/en/projects");

  if (!projectId) return;

  const slug = await getProjectSlug(projectId);
  if (slug) {
    revalidatePath(`/projekty/${slug}`);
    revalidatePath(`/en/projects/${slug}`);
  }
}

type ExistingUnitImages = {
  floorPlanImage?: {
    asset?: { _ref: string };
    alt?: { cs?: string; en?: string };
  } | null;
  photos?: Array<{
    _key?: string;
    asset?: { _ref: string };
    alt?: { cs?: string; en?: string };
  }> | null;
};

async function resolveUnitImages(
  formData: FormData,
  values: UnitFormValues,
  options: {
    requirePhotos?: boolean;
    existing?: ExistingUnitImages | null;
  } = {},
) {
  const client = assertWriteClient();
  const photoFiles = getFilesFromFormData(formData, "photos");
  const floorPlanFile = getFileFromFormData(formData, "floorPlanImage");

  let photos = (options.existing?.photos ?? []).filter(
    (image) => image._key && !values.removePhotoKeys.includes(image._key),
  );

  if (photoFiles.length > 0) {
    const uploaded = await Promise.all(
      photoFiles.map(async (file) => {
        const asset = await uploadAdminImage(client, file);
        return buildGalleryImage(asset._id, values.photoAltCs, values.photoAltEn);
      }),
    );
    photos = [...photos, ...uploaded];
  }

  if (options.requirePhotos && photos.length === 0) {
    throw new Error(await adminError("photoRequired"));
  }

  let floorPlanImage = options.existing?.floorPlanImage ?? undefined;

  if (values.removeFloorPlan) {
    floorPlanImage = undefined;
  }

  if (floorPlanFile) {
    const asset = await uploadAdminImage(client, floorPlanFile);
    floorPlanImage = buildAccessibleImage(
      asset._id,
      values.floorPlanAltCs,
      values.floorPlanAltEn,
    );
  } else if (floorPlanImage?.asset?._ref) {
    floorPlanImage = {
      ...floorPlanImage,
      alt: {
        cs: values.floorPlanAltCs,
        en: values.floorPlanAltEn,
      },
    };
  }

  return { photos, floorPlanImage };
}

function parseProjectFormData(formData: FormData): ProjectFormValues {
  const nameCs = String(formData.get("nameCs") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const heroAltCs = String(formData.get("heroAltCs") ?? "").trim();
  const heroAltEn = String(formData.get("heroAltEn") ?? "").trim();
  const amenityTitleCs = formData.getAll("amenityTitleCs").map((value) => String(value));
  const amenityTitleEn = formData.getAll("amenityTitleEn").map((value) => String(value));
  const amenityItemsCs = formData.getAll("amenityItemsCs").map((value) => String(value));
  const amenityItemsEn = formData.getAll("amenityItemsEn").map((value) => String(value));
  const downloadTitleCs = formData.getAll("downloadTitleCs").map((value) => String(value));
  const downloadTitleEn = formData.getAll("downloadTitleEn").map((value) => String(value));
  const downloadUrl = formData.getAll("downloadUrl").map((value) => String(value));
  const timelineDate = formData.getAll("timelineDate").map((value) => String(value));
  const timelineTitleCs = formData.getAll("timelineTitleCs").map((value) => String(value));
  const timelineTitleEn = formData.getAll("timelineTitleEn").map((value) => String(value));
  const timelineDescriptionCs = formData
    .getAll("timelineDescriptionCs")
    .map((value) => String(value));
  const timelineDescriptionEn = formData
    .getAll("timelineDescriptionEn")
    .map((value) => String(value));

  return {
    nameCs,
    nameEn: String(formData.get("nameEn") ?? "").trim(),
    slug: slugInput || slugifyIdentifier(nameCs),
    status:
      (formData.get("status") as ProjectFormValues["status"]) ?? "upcoming",
    type: (formData.get("type") as ProjectFormValues["type"]) ?? "mixed",
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
    handoverCs: String(formData.get("handoverCs") ?? "").trim() || undefined,
    handoverEn: String(formData.get("handoverEn") ?? "").trim() || undefined,
    website: String(formData.get("website") ?? "").trim() || undefined,
    salesMode:
      (formData.get("salesMode") as ProjectFormValues["salesMode"]) ?? "soldByUs",
    landmarksCs: String(formData.get("landmarksCs") ?? ""),
    landmarksEn: String(formData.get("landmarksEn") ?? ""),
    locationDescriptionCs:
      String(formData.get("locationDescriptionCs") ?? "").trim() || undefined,
    locationDescriptionEn:
      String(formData.get("locationDescriptionEn") ?? "").trim() || undefined,
    amenities: Array.from(
      { length: Math.max(amenityTitleCs.length, amenityTitleEn.length) },
      (_, index) => ({
        titleCs: amenityTitleCs[index]?.trim() ?? "",
        titleEn: amenityTitleEn[index]?.trim() ?? "",
        itemsCs: amenityItemsCs[index] ?? "",
        itemsEn: amenityItemsEn[index] ?? "",
      }),
    ).filter((item) => item.titleCs || item.titleEn),
    downloads: Array.from(
      { length: Math.max(downloadTitleCs.length, downloadUrl.length) },
      (_, index) => ({
        titleCs: downloadTitleCs[index]?.trim() ?? "",
        titleEn: downloadTitleEn[index]?.trim() ?? "",
        url: downloadUrl[index]?.trim() ?? "",
      }),
    ).filter((item) => item.url && (item.titleCs || item.titleEn)),
    timeline: Array.from(
      { length: Math.max(timelineTitleCs.length, timelineTitleEn.length) },
      (_, index) => ({
        date: timelineDate[index]?.trim() || undefined,
        titleCs: timelineTitleCs[index]?.trim() ?? "",
        titleEn: timelineTitleEn[index]?.trim() ?? "",
        descriptionCs: timelineDescriptionCs[index]?.trim() || undefined,
        descriptionEn: timelineDescriptionEn[index]?.trim() || undefined,
      }),
    ).filter((item) => item.titleCs || item.titleEn),
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
  const handover = localizedValue(values.handoverCs, values.handoverEn);
  const locationDescription = localizedValue(
    values.locationDescriptionCs,
    values.locationDescriptionEn,
  );
  const landmarks = localizedList(values.landmarksCs, values.landmarksEn);
  const amenities = values.amenities
    .map((group) => {
      const title = localizedValue(group.titleCs, group.titleEn);
      const items = localizedList(group.itemsCs, group.itemsEn);

      if (!title) return null;

      return {
        _type: "amenityGroup",
        _key: Math.random().toString(36).slice(2, 10),
        title,
        items,
      };
    })
    .filter(Boolean);
  const downloads = values.downloads.map((item) => ({
    _type: "projectDownload",
    _key: Math.random().toString(36).slice(2, 10),
    title: localizedValue(item.titleCs, item.titleEn),
    url: item.url,
  }));
  const timeline = values.timeline.map((item) => ({
    _type: "timelineItem",
    _key: Math.random().toString(36).slice(2, 10),
    date: item.date,
    title: localizedValue(item.titleCs, item.titleEn),
    description: localizedValue(item.descriptionCs, item.descriptionEn),
  }));

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
    type: values.type,
    salesMode: values.salesMode,
    location: values.location,
    address: values.address,
    description: {
      cs: textToPortableText(values.descriptionCs),
      en: textToPortableText(values.descriptionEn),
    },
    landmarks,
    amenities,
    downloads,
    timeline,
  };

  if (badge) doc.badge = badge;
  if (tagline) doc.tagline = tagline;
  if (handover) doc.handover = handover;
  if (values.website) doc.website = values.website;
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
  if (locationDescription) {
    doc.locationDescription = {
      cs: textToPortableText(values.locationDescriptionCs ?? ""),
      en: textToPortableText(values.locationDescriptionEn ?? ""),
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

export async function createUnitFormAction(formData: FormData) {
  await createUnitAction(formData);
}

export async function updateUnitFormAction(id: string, formData: FormData) {
  return updateUnitAction(id, formData);
}

export async function createUnitAction(formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseUnitFormData(formData);
  const images = await resolveUnitImages(formData, values, { requirePhotos: true });

  const doc = {
    ...buildUnitDocument(values),
    photos: images.photos,
    ...(images.floorPlanImage ? { floorPlanImage: images.floorPlanImage } : {}),
  } as unknown as { _type: string; [key: string]: unknown };

  const created = await client.create(doc);
  await attachUnitToProject(values.projectId, created._id);
  await revalidateUnitPublicPaths(values.projectId);

  redirect(`/admin/units/${created._id}`);
}

export async function updateUnitAction(id: string, formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseUnitFormData(formData);

  const existing = await client.fetch<
    (ExistingUnitImages & { projectId?: string }) | null
  >(
    `*[_type == "unit" && _id == $id][0] {
      floorPlanImage,
      photos,
      "projectId": project._ref
    }`,
    { id },
  );

  const images = await resolveUnitImages(formData, values, {
    requirePhotos: true,
    existing,
  });

  const fields = {
    ...buildUnitDocument(values),
    photos: images.photos,
  };

  const patch = client.patch(id).set(fields);
  const unsetUnit = unitUnsetFields(values);

  if (values.priceOnRequest) {
    unsetUnit.push("price");
  }

  if (unsetUnit.length > 0) {
    patch.unset(unsetUnit);
  }

  if (images.floorPlanImage) {
    patch.set({ floorPlanImage: images.floorPlanImage });
  } else {
    patch.unset(["floorPlanImage"]);
  }

  await patch.commit();

  const previousProjectId = existing?.projectId;
  if (previousProjectId && previousProjectId !== values.projectId) {
    await detachUnitFromProject(previousProjectId, id);
  }
  await attachUnitToProject(values.projectId, id);
  await revalidateUnitPublicPaths(values.projectId);
  if (previousProjectId && previousProjectId !== values.projectId) {
    await revalidateUnitPublicPaths(previousProjectId);
  }
  revalidatePath(`/admin/units/${id}`);

  return { success: true };
}

export async function deleteUnitAction(id: string) {
  await requireAdmin();
  const client = assertWriteClient();

  const existing = await client.fetch<{ projectId?: string } | null>(
    `*[_type == "unit" && _id == $id][0] { "projectId": project._ref }`,
    { id },
  );

  if (existing?.projectId) {
    await detachUnitFromProject(existing.projectId, id);
  }

  await client.delete(id);
  await revalidateUnitPublicPaths(existing?.projectId);

  redirect("/admin/units");
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
  const unset: string[] = [];

  if (values.completionDate) {
    patch.set({ completionDate: values.completionDate });
  } else {
    unset.push("completionDate");
  }

  if (!values.badgeCs && !values.badgeEn) unset.push("badge");
  if (!values.taglineCs && !values.taglineEn) unset.push("tagline");
  if (!values.handoverCs && !values.handoverEn) unset.push("handover");
  if (!values.website) unset.push("website");
  if (typeof values.mapLat !== "number" || typeof values.mapLng !== "number") {
    unset.push("geo");
  }
  if (!values.locationDescriptionCs && !values.locationDescriptionEn) {
    unset.push("locationDescription");
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

  const project = await client.fetch<{ slug: string; unitCount: number }>(
    `*[_type == "project" && _id == $id][0] {
      "slug": slug.current,
      "unitCount": count(*[_type == "unit" && references(^._id)])
    }`,
    { id },
  );

  if (project?.unitCount && project.unitCount > 0) {
    throw new Error(await adminError("deleteProjectHasUnits"));
  }

  await client.delete(id);

  revalidateProjectPaths(project?.slug);

  redirect("/admin/projects");
}

function parseNewsFormData(formData: FormData): NewsFormValues {
  const titleCs = String(formData.get("titleCs") ?? "").trim();
  const titleEn = String(formData.get("titleEn") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const heroAltCs = String(formData.get("heroAltCs") ?? "").trim();
  const heroAltEn = String(formData.get("heroAltEn") ?? "").trim();
  const publishedAtRaw = String(formData.get("publishedAt") ?? "").trim();
  const relatedProjectId =
    String(formData.get("relatedProjectId") ?? "").trim() || undefined;

  return {
    titleCs,
    titleEn,
    slug: slugInput || slugifyIdentifier(titleCs),
    excerptCs: String(formData.get("excerptCs") ?? "").trim(),
    excerptEn: String(formData.get("excerptEn") ?? "").trim(),
    bodyCs: String(formData.get("bodyCs") ?? "").trim(),
    bodyEn: String(formData.get("bodyEn") ?? "").trim(),
    publishedAt: publishedAtRaw
      ? new Date(publishedAtRaw).toISOString()
      : new Date().toISOString(),
    relatedProjectId,
    heroAltCs: heroAltCs || titleCs,
    heroAltEn: heroAltEn || titleEn || titleCs,
  };
}

type ExistingNewsHeroImage = {
  heroImage?: {
    asset?: { _ref: string };
    alt?: { cs?: string; en?: string };
  } | null;
};

async function resolveNewsHeroImage(
  formData: FormData,
  values: NewsFormValues,
  options: {
    requireHero?: boolean;
    existing?: ExistingNewsHeroImage | null;
  } = {},
) {
  const client = assertWriteClient();
  const heroFile = getFileFromFormData(formData, "heroImage");
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

  return heroImage;
}

function buildNewsFields(values: NewsFormValues): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    title: {
      cs: values.titleCs,
      en: values.titleEn,
    },
    slug: {
      _type: "slug",
      current: values.slug,
    },
    excerpt: {
      cs: values.excerptCs,
      en: values.excerptEn,
    },
    body: {
      cs: textToPortableText(values.bodyCs),
      en: textToPortableText(values.bodyEn),
    },
    publishedAt: values.publishedAt,
  };

  if (values.relatedProjectId) {
    doc.relatedProject = {
      _type: "reference",
      _ref: values.relatedProjectId,
    };
  }

  return doc;
}

function buildNewsDocument(values: NewsFormValues): Record<string, unknown> {
  return {
    _type: "newsArticle",
    ...buildNewsFields(values),
  };
}

function revalidateNewsPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/news");
  revalidatePath("/aktuality");
  revalidatePath("/en/news");

  if (slug) {
    revalidatePath(`/aktuality/${slug}`);
    revalidatePath(`/en/news/${slug}`);
  }
}

export async function createNewsFormAction(formData: FormData) {
  await createNewsAction(formData);
}

export async function updateNewsFormAction(id: string, formData: FormData) {
  return updateNewsAction(id, formData);
}

export async function createNewsAction(formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseNewsFormData(formData);
  const heroImage = await resolveNewsHeroImage(formData, values, { requireHero: true });

  const doc = {
    ...buildNewsDocument(values),
    heroImage,
  } as unknown as { _type: string; [key: string]: unknown };

  const created = await client.create(doc);

  revalidateNewsPaths(values.slug);

  redirect(`/admin/news/${created._id}`);
}

export async function updateNewsAction(id: string, formData: FormData) {
  await requireAdmin();
  const client = assertWriteClient();
  const values = parseNewsFormData(formData);

  const existing = await client.fetch<ExistingNewsHeroImage | null>(
    `*[_type == "newsArticle" && _id == $id][0] {
      heroImage
    }`,
    { id },
  );

  const heroImage = await resolveNewsHeroImage(formData, values, { existing });
  const fields = {
    ...buildNewsFields(values),
    ...(heroImage ? { heroImage } : {}),
  };

  const patch = client.patch(id).set(fields);

  if (!values.relatedProjectId) {
    patch.unset(["relatedProject"]);
  }

  await patch.commit();

  revalidateNewsPaths(values.slug);
  revalidatePath(`/admin/news/${id}`);

  return { success: true };
}

export async function deleteNewsAction(id: string) {
  await requireAdmin();
  const client = assertWriteClient();

  const article = await client.fetch<{ slug: string } | null>(
    `*[_type == "newsArticle" && _id == $id][0] {
      "slug": slug.current
    }`,
    { id },
  );

  await client.delete(id);

  revalidateNewsPaths(article?.slug);

  redirect("/admin/news");
}
