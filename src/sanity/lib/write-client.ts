import "server-only";

import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/env";

const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

export const isSanityWriteConfigured = Boolean(projectId && token);

export const sanityWriteClient: SanityClient | null = isSanityWriteConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    })
  : null;

export function assertWriteClient() {
  if (!sanityWriteClient) {
    throw new Error(
      "Sanity write client is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN.",
    );
  }

  return sanityWriteClient;
}
