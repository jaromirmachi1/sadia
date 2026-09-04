"use server";

import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";

import {
  isHoneypotFilled,
  isRateLimited,
  parseInquiryFormData,
  sendInquiryEmail,
} from "@/lib/inquiry-email";

export type InquiryActionResult =
  | { ok: true }
  | { ok: false; message: string };

async function inquiryError(key: "invalid" | "failed") {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Inquiry" });
  return t(key);
}

function clientIp(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return headerList.get("x-real-ip")?.trim() || "unknown";
}

export async function submitInquiryAction(
  formData: FormData,
): Promise<InquiryActionResult> {
  if (isHoneypotFilled(formData)) {
    return { ok: true };
  }

  const headerList = await headers();
  if (isRateLimited(clientIp(headerList))) {
    return { ok: false, message: await inquiryError("failed") };
  }

  const payload = parseInquiryFormData(formData);

  if (!payload) {
    return { ok: false, message: await inquiryError("invalid") };
  }

  try {
    await sendInquiryEmail(payload);
    return { ok: true };
  } catch {
    return { ok: false, message: await inquiryError("failed") };
  }
}
