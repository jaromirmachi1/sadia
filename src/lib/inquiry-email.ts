import { Resend } from "resend";

import { legalEntity } from "@/legal/entity";

const MAX_TEXT = 4000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

const recentSubmissions = new Map<string, number[]>();

export type InquiryKind = "contact" | "project" | "we-buy";

export type InquiryPayload =
  | {
      kind: "contact";
      name: string;
      email: string;
      message: string;
    }
  | {
      kind: "project";
      name: string;
      email: string;
      message: string;
      project: string;
    }
  | {
      kind: "we-buy";
      firstName: string;
      lastName: string;
      email: string;
      propertyType: string;
      address: string;
      city: string;
      area?: string;
      expectedPrice?: string;
      message?: string;
    };

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  residential: "Rezidenční nebo smíšený dům",
  admin: "Administrativní nebo polyfunkční objekt",
  land: "Pozemek",
  shares: "Vlastnický podíl",
  project: "Developerský projekt",
  other: "Jiné",
};

const KIND_LABELS: Record<InquiryKind, string> = {
  contact: "Kontakt",
  project: "Dotaz k projektu",
  "we-buy": "Nabídka nemovitosti",
};

export function cleanField(value: FormDataEntryValue | null, max = MAX_TEXT) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, max);
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function isHoneypotFilled(formData: FormData) {
  return cleanField(formData.get("company"), 80).length > 0;
}

export function isRateLimited(ip: string) {
  const now = Date.now();
  const stamps = (recentSubmissions.get(ip) ?? []).filter(
    (stamp) => now - stamp < RATE_WINDOW_MS,
  );

  if (stamps.length >= RATE_LIMIT) {
    recentSubmissions.set(ip, stamps);
    return true;
  }

  stamps.push(now);
  recentSubmissions.set(ip, stamps);
  return false;
}

export function parseInquiryFormData(
  formData: FormData,
): InquiryPayload | null {
  const kind = cleanField(formData.get("kind"), 20);

  if (kind === "contact" || kind === "project") {
    const name = cleanField(formData.get("name"), 120);
    const email = cleanField(formData.get("email"), 254).toLowerCase();
    const message = cleanField(formData.get("message"));
    const project = cleanField(formData.get("project"), 160);

    if (!name || !isValidEmail(email) || !message) {
      return null;
    }

    if (kind === "project") {
      if (!project) return null;
      return { kind, name, email, message, project };
    }

    return { kind, name, email, message };
  }

  if (kind === "we-buy") {
    const firstName = cleanField(formData.get("firstName"), 80);
    const lastName = cleanField(formData.get("lastName"), 80);
    const email = cleanField(formData.get("email"), 254).toLowerCase();
    const propertyType = cleanField(formData.get("propertyType"), 40);
    const address = cleanField(formData.get("address"), 200);
    const city = cleanField(formData.get("city"), 120);
    const area = cleanField(formData.get("area"), 80);
    const expectedPrice = cleanField(formData.get("expectedPrice"), 80);
    const message = cleanField(formData.get("message"));
    const consent = formData.get("consent");

    if (
      !firstName ||
      !lastName ||
      !isValidEmail(email) ||
      !PROPERTY_TYPE_LABELS[propertyType] ||
      !address ||
      !city ||
      consent !== "on"
    ) {
      return null;
    }

    return {
      kind,
      firstName,
      lastName,
      email,
      propertyType,
      address,
      city,
      ...(area ? { area } : {}),
      ...(expectedPrice ? { expectedPrice } : {}),
      ...(message ? { message } : {}),
    };
  }

  return null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;vertical-align:top;width:160px;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#12142e;font-size:15px;white-space:pre-wrap;">${escapeHtml(value)}</td>
  </tr>`;
}

function textLine(label: string, value: string) {
  return `${label}: ${value}`;
}

function buildEmail(payload: InquiryPayload) {
  const kindLabel = KIND_LABELS[payload.kind];
  const replyTo = payload.email;
  const fromName =
    payload.kind === "we-buy"
      ? `${payload.firstName} ${payload.lastName}`.trim()
      : payload.name;

  const fields: Array<[string, string]> = [["Typ", kindLabel]];

  if (payload.kind === "project") {
    fields.push(["Projekt", payload.project]);
  }

  if (payload.kind === "we-buy") {
    fields.push(
      ["Jméno", payload.firstName],
      ["Příjmení", payload.lastName],
      ["E-mail", payload.email],
      ["Typ nemovitosti", PROPERTY_TYPE_LABELS[payload.propertyType] ?? payload.propertyType],
      ["Adresa", payload.address],
      ["Město / lokalita", payload.city],
    );
    if (payload.area) fields.push(["Výměra", payload.area]);
    if (payload.expectedPrice) fields.push(["Očekávaná cena", payload.expectedPrice]);
    if (payload.message) fields.push(["Popis", payload.message]);
  } else {
    fields.push(
      ["Jméno", payload.name],
      ["E-mail", payload.email],
      ["Zpráva", payload.message],
    );
  }

  const subject =
    payload.kind === "project"
      ? `SADIA web — dotaz k projektu ${payload.project}`
      : payload.kind === "we-buy"
        ? `SADIA web — nabídka nemovitosti od ${fromName}`
        : `SADIA web — zpráva od ${fromName}`;

  const text = ["Nová zpráva z webu SADIA", "", ...fields.map(([label, value]) => textLine(label, value))].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;background:#f6f5f2;padding:24px;font-family:Georgia,serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;padding:32px;">
      <tr>
        <td style="color:#12142e;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;">SADIA</td>
      </tr>
      <tr>
        <td style="padding-top:12px;padding-bottom:24px;color:#12142e;font-size:22px;">${escapeHtml(kindLabel)}</td>
      </tr>
      <tr>
        <td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${fields.map(([label, value]) => row(label, value)).join("")}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html, replyTo };
}

function envValue(value: string | undefined, fallback: string) {
  const cleaned = value?.trim().replace(/^['"]|['"]$/g, "").trim();
  return cleaned || fallback;
}

export async function sendInquiryEmail(payload: InquiryPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim().replace(/^['"]|['"]$/g, "");

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const { subject, text, html, replyTo } = buildEmail(payload);
  const resend = new Resend(apiKey);
  const from = envValue(
    process.env.INQUIRY_FROM_EMAIL,
    "SADIA <beth.t@example.com>",
  );
  const to = envValue(process.env.INQUIRY_TO_EMAIL, legalEntity.formEmail);

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("Resend inquiry email failed:", error.message);
    throw new Error(error.message);
  }
}
