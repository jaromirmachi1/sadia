"use client";

import { NextStudio } from "next-sanity/studio";
import { useEffect, useState } from "react";
import type { Config } from "sanity";

import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  const [config, setConfig] = useState<Config | null>(null);

  useEffect(() => {
    if (!isSanityConfigured) return;

    void import("../../../../sanity.config").then((mod) => {
      setConfig(mod.default);
    });
  }, []);

  if (!isSanityConfigured) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="max-w-xl space-y-3">
          <h1 className="text-2xl font-semibold">
            Sanity Studio is not configured
          </h1>
          <p className="text-muted-foreground">
            Copy the variables from .env.example into .env.local, add the
            Sanity project ID, and restart the development server.
          </p>
        </div>
      </main>
    );
  }

  if (!config) {
    return null;
  }

  return <NextStudio config={config} />;
}
