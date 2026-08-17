export function formatPrice(
  price: number | undefined,
  currency: string,
  locale: "cs" | "en",
) {
  if (typeof price !== "number") {
    return "—";
  }

  return new Intl.NumberFormat(locale === "cs" ? "cs-CZ" : "en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}
