export const legalEntity = {
  name: "Sadia s.r.o.",
  brand: "SADIA",
  ico: "29202027",
  dic: "CZ29202027",
  address: "Radnická 376/11, 602 00 Brno",
  court: "Krajský soud v Brně",
  fileRef: "C 65298",
  email: "adam@sadiaestate.cz",
  privacyEmail: "adam@sadiaestate.cz",
  formEmail: "adam@sadiaestate.cz",
  phone: "+420 607 100 886",
  dataBox: "54nkgi4",
} as const;

export function withPublicContact<T extends { email?: string; phone?: string }>(
  settings: T,
): T {
  const email = settings.email?.trim() ?? "";
  const phone = settings.phone?.trim() ?? "";
  const placeholderEmail =
    !email || email.toLowerCase() === "info@sadia.cz";
  const placeholderPhone =
    !phone || /000[\s]?000[\s]?000/.test(phone);

  return {
    ...settings,
    email: placeholderEmail ? legalEntity.email : email,
    phone: placeholderPhone ? legalEntity.phone : phone,
  };
}

export const legalUpdatedAt = {
  iso: "2026-08-18",
  cs: "18. 8. 2026",
  en: "18 August 2026",
} as const;
