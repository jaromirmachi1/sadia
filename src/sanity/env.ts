export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-23";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "missing-project-id";

export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
