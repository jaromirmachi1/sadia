"use client";

import { useTranslations } from "next-intl";

import { CtaButton } from "@/components/CtaLink";
import { useInquiryForm } from "@/hooks/useInquiryForm";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { routeKeys } from "@/utils/routes";

const fieldClassName =
  "min-h-12 w-full border-0 border-b border-sadia-gray-light bg-transparent px-0 text-body-base text-sadia-navy-black outline-none transition-colors placeholder:text-sadia-gray/70 focus-visible:border-sadia-navy-black";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const inquiry = useTranslations("Inquiry");
  const { submitted, pending, error, onSubmit, reset } = useInquiryForm(
    inquiry("failed"),
  );

  if (submitted) {
    return (
      <div>
        <p className="sadia-eyebrow">{t("successEyebrow")}</p>
        <h3 className="mt-4 font-display text-heading-md font-medium uppercase tracking-tight text-sadia-navy-black">
          {t("successTitle")}
        </h3>
        <p className="mt-4 max-w-md text-body-lg leading-relaxed text-sadia-gray">
          {t("successDescription")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="sadia-underline-link mt-8 pb-1 text-body-sm font-semibold uppercase tracking-[0.14em] text-sadia-navy-black"
        >
          {t("successBack")}
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <input type="hidden" name="kind" value="contact" />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
          {t("name")}
        </span>
        <input name="name" required autoComplete="name" className={fieldClassName} />
      </label>
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
          {t("email")}
        </span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClassName}
        />
      </label>
      <label className="block space-y-2">
        <span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
          {t("message")}
        </span>
        <textarea
          name="message"
          required
          className={cn(fieldClassName, "min-h-28 resize-y py-3")}
        />
      </label>
      <p className="text-body-sm leading-relaxed text-sadia-gray">
        {t.rich("privacyNotice", {
          privacy: (chunks) => (
            <Link
              href={routeKeys.privacy}
              className="text-sadia-navy-black underline-offset-2 hover:underline"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
      {error ? (
        <p role="alert" className="text-body-sm text-sadia-navy-black">
          {error}
        </p>
      ) : null}
      <CtaButton type="submit" disabled={pending}>
        {pending ? inquiry("submitting") : t("submit")}
      </CtaButton>
    </form>
  );
}
