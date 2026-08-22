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

export function formatNewsDate(value: string, locale: "cs" | "en") {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale === "cs" ? "cs-CZ" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}
