import "server-only";

import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN;

export const isSanityWriteConfigured = Boolean(
  projectId && projectId !== "missing-project-id" && token,
);

export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

export function assertWriteClient() {
  if (!isSanityWriteConfigured) {
    throw new Error(
      "Sanity write client is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.",
    );
  }

  return sanityWriteClient;
}
