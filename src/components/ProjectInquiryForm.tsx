"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

const fieldClassName =
  "min-h-12 w-full rounded-xl border border-transparent bg-sadia-white px-4 text-body-base text-sadia-navy-black outline-none transition-colors placeholder:text-sadia-gray/80 focus-visible:border-sadia-gray-light focus-visible:ring-2 focus-visible:ring-[#4A90C0]/20";

type ProjectInquiryFormProps = {
  projectName: string;
};

export function ProjectInquiryForm({ projectName }: ProjectInquiryFormProps) {
  const t = useTranslations("ProjectDetail.form");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-2xl bg-muted/60 px-8 py-10">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#4A90C0]">
          {t("successEyebrow")}
        </p>
        <h3 className="mt-4 font-display text-heading-md font-medium text-sadia-navy-black">
          {t("successTitle")}
        </h3>
        <p className="mt-4 max-w-md text-body-lg leading-relaxed text-sadia-gray">
          {t("successDescription")}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-8 text-body-sm font-semibold text-sadia-navy-black underline-offset-4 hover:underline"
        >
          {t("successBack")}
        </button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <input type="hidden" name="project" value={projectName} />
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-sadia-gray">
          {t("name")}
        </span>
        <input name="name" required className={fieldClassName} />
      </label>
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-sadia-gray">
          {t("email")}
        </span>
        <input name="email" type="email" required className={fieldClassName} />
      </label>
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-sadia-gray">
          {t("phone")}
        </span>
        <input name="phone" type="tel" className={fieldClassName} />
      </label>
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-sadia-gray">
          {t("message")}
        </span>
        <textarea
          name="message"
          required
          className={cn(fieldClassName, "min-h-32 resize-y py-3")}
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex min-h-12 items-center justify-center bg-sadia-navy-black px-7 text-body-sm font-semibold text-sadia-white transition-opacity hover:opacity-90"
      >
        {t("submit")}
      </button>
    </form>
  );
}
