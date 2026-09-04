"use client";

import { useTranslations } from "next-intl";

import { CtaButton } from "@/components/CtaLink";
import { useInquiryForm } from "@/hooks/useInquiryForm";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { routeKeys } from "@/utils/routes";

const fieldClassName =
  "min-h-12 w-full rounded-xl border border-transparent bg-sadia-white px-4 text-body-base text-sadia-navy-black outline-none transition-colors placeholder:text-sadia-gray/80 focus-visible:border-sadia-gray-light focus-visible:ring-2 focus-visible:ring-[#4A90C0]/20";

const textareaClassName = cn(fieldClassName, "min-h-36 resize-y py-3");

const propertyTypes = [
  "residential",
  "admin",
  "land",
  "shares",
  "project",
  "other",
] as const;

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <span className="text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-sadia-gray">
      {htmlFor ? <label htmlFor={htmlFor}>{children}</label> : children}
    </span>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <h3 className="border-b border-sadia-gray-light/80 pb-4 text-body-sm font-semibold uppercase tracking-[0.12em] text-sadia-navy-black">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function WeBuyForm() {
  const t = useTranslations("WeBuy.form");
  const inquiry = useTranslations("Inquiry");
  const { submitted, pending, error, onSubmit, reset } = useInquiryForm(
    inquiry("failed"),
  );

  if (submitted) {
    return (
      <div className="rounded-2xl bg-muted/60 px-8 py-10 md:px-10">
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
          onClick={reset}
          className="mt-8 text-body-sm font-semibold text-sadia-navy-black underline-offset-4 hover:underline"
        >
          {t("successBack")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl bg-muted/60 p-6 md:p-8"
    >
      <input type="hidden" name="kind" value="we-buy" />

      <div className="space-y-10">
        <FormSection title={t("sections.contact")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="firstName">{t("fields.firstName")}</FieldLabel>
              <input
                id="firstName"
                name="firstName"
                required
                autoComplete="given-name"
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="lastName">{t("fields.lastName")}</FieldLabel>
              <input
                id="lastName"
                name="lastName"
                required
                autoComplete="family-name"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="email">{t("fields.email")}</FieldLabel>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={fieldClassName}
            />
          </div>
        </FormSection>

        <FormSection title={t("sections.property")}>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="propertyType">
              {t("fields.propertyType")}
            </FieldLabel>
            <select
              id="propertyType"
              name="propertyType"
              required
              className={fieldClassName}
              defaultValue=""
            >
              <option value="" disabled>
                {t("fields.propertyTypePlaceholder")}
              </option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`propertyTypes.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="address">{t("fields.address")}</FieldLabel>
            <input
              id="address"
              name="address"
              required
              placeholder={t("fields.addressPlaceholder")}
              className={fieldClassName}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="city">{t("fields.city")}</FieldLabel>
              <input
                id="city"
                name="city"
                required
                placeholder={t("fields.cityPlaceholder")}
                className={fieldClassName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="area">{t("fields.area")}</FieldLabel>
              <input
                id="area"
                name="area"
                type="text"
                inputMode="decimal"
                placeholder={t("fields.areaPlaceholder")}
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="expectedPrice">
              {t("fields.expectedPrice")}
            </FieldLabel>
            <input
              id="expectedPrice"
              name="expectedPrice"
              type="text"
              placeholder={t("fields.expectedPricePlaceholder")}
              className={fieldClassName}
            />
          </div>
        </FormSection>

        <FormSection title={t("sections.additional")}>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="message">{t("fields.message")}</FieldLabel>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder={t("fields.messagePlaceholder")}
              className={textareaClassName}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-sadia-white/70 px-4 py-4 text-body-sm leading-relaxed text-sadia-gray">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 size-4 shrink-0 rounded border border-sadia-gray-light accent-[#4A90C0]"
            />
            <span>
              {t.rich("fields.consent", {
                privacy: (chunks) => (
                  <Link
                    href={routeKeys.privacy}
                    className="text-sadia-navy-black underline-offset-2 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </label>
        </FormSection>
      </div>

      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {error ? (
        <p role="alert" className="mt-8 text-body-sm text-sadia-navy-black">
          {error}
        </p>
      ) : null}

      <CtaButton type="submit" disabled={pending} className="mt-10">
        {pending ? inquiry("submitting") : t("submit")}
      </CtaButton>
    </form>
  );
}
