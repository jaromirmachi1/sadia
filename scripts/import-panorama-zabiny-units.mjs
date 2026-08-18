import fs from "node:fs/promises";

import { createClient } from "next-sanity";

const jsonPath =
  process.argv[2] ??
  "/Users/sajmikoule/ITDev/sadia/Downloads/panorama-zabiny-sadia-units.json";

const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() ?? "2026-07-23";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "production";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || projectId.length < 5) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID (or empty).",
    "Set it in .env.local or run with env vars.",
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN. Set it in .env.local (admin/editor token).",
  );
  process.exit(1);
}

const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

async function fetchProjectIdBySlug(slug) {
  const result = await sanity.fetch(
    `*[_type == "project" && slug.current == $slug][0]._id`,
    { slug },
  );
  return result ?? null;
}

function asNumberOrUndefined(value) {
  return typeof value === "number" && !Number.isNaN(value) && value !== 0
    ? value
    : undefined;
}

function maybeOmitIfNull(value) {
  return value === null || typeof value === "undefined" ? undefined : value;
}

async function uploadImageFromUrl(url, filenameHint) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image ${url} (${res.status})`);
  }

  const contentType = res.headers.get("content-type") ?? "image/webp";
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploaded = await sanity.assets.upload("image", buffer, {
    filename: filenameHint,
    contentType,
  });

  return uploaded;
}

async function getUnitIdBySlug(slug) {
  const result = await sanity.fetch(
    `*[_type == "unit" && slug.current == $slug][0]._id`,
    { slug },
  );
  return result ?? null;
}

async function importUnits({ projectSlug, units }) {
  const targetProjectId = await fetchProjectIdBySlug(projectSlug);
  if (!targetProjectId) {
    throw new Error(
      `Sanity project not found for slug "${projectSlug}". Import script expects the project to already exist.`,
    );
  }

  let created = 0;
  let updated = 0;

  for (const unit of units) {
    const unitId = await getUnitIdBySlug(unit.slug);

    const floorPlanWebpUrl = unit?.images?.floorPlanWebpUrl;
    if (!floorPlanWebpUrl) {
      console.warn(
        `Skipping ${unit.identifier}: missing images.floorPlanWebpUrl`,
      );
      continue;
    }

    const floorPlanAlt = unit?.images?.floorPlanAlt ?? unit.identifier;

    const asset = await uploadImageFromUrl(
      floorPlanWebpUrl,
      `${unit.slug}-floor-plan.webp`,
    );

    const floorPlanImage = {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
      alt: { cs: floorPlanAlt, en: floorPlanAlt },
    };

    const doc = {
      _type: "unit",
      project: { _type: "reference", _ref: targetProjectId },
      identifier: unit.identifier,
      slug: { _type: "slug", current: unit.slug },
      layout: unit.layout,
      unitType: unit.unitType,
      areaM2: unit.areaM2,
      floor: unit.floor,
      orientation: maybeOmitIfNull(unit.orientation),
      cellarM2: maybeOmitIfNull(unit.cellarM2),
      balconyM2: asNumberOrUndefined(unit.balconyM2),
      loggiaM2: asNumberOrUndefined(unit.loggiaM2),
      terraceM2: asNumberOrUndefined(unit.terraceM2),
      gardenM2: asNumberOrUndefined(unit.gardenM2),
      currency: unit.currency,
      status: unit.status === "soldThirdParty" ? "sold" : unit.status,
      dealType: unit.dealType,
      featured: false,
      priceOnRequest: Boolean(unit.priceOnRequest),
      ...(unit.priceOnRequest ? {} : { price: unit.price }),
      floorPlanImage,
    };

    if (!unitId) {
      // photos are intentionally empty (no interior images import)
      await sanity.create({ ...doc, photos: [] });
      created += 1;
    } else {
      await sanity
        .patch(unitId)
        .set({
          ...doc,
          _id: unitId, // sanity doesn't allow changing _id; keeping it explicit is safe
        })
        .commit();
      updated += 1;
    }

    // Be gentle to Sanity
    await new Promise((r) => setTimeout(r, 350));
  }

  console.log(
    `Import finished: created=${created}, updated=${updated}, totalUnits=${units.length}`,
  );
}

const raw = await fs.readFile(jsonPath, "utf8");
const data = JSON.parse(raw);

if (!data?.project?.projectSlug || !Array.isArray(data.units)) {
  throw new Error(
    "Invalid panorama export JSON. Expected { project: { projectSlug }, units: [] }",
  );
}

await importUnits({
  projectSlug:
    process.env.SADIA_PROJECT_SLUG_OVERRIDE?.trim() ||
    data.project.projectSlug,
  units: data.units,
});

