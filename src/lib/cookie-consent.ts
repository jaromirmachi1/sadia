export const CONSENT_COOKIE_NAME = "sadia_cookie_consent";
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
export const CONSENT_UPDATED_EVENT = "sadia-consent-updated";
export const CONSENT_OPEN_EVENT = "sadia-open-cookie-settings";

export type CookieConsentValue = "all" | "necessary";

export function readConsentCookie(): CookieConsentValue | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE_NAME}=`));

  if (!match) {
    return null;
  }

  const value = match.split("=")[1];
  return value === "all" || value === "necessary" ? value : null;
}

export function writeConsentCookie(value: CookieConsentValue) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
}

export function openCookieSettings() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
