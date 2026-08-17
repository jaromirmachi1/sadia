import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn: true,
    })
  : null;
