type MapLocation = {
  geo?: { lat: number; lng: number };
  address?: string;
  label?: string;
  zoom?: number;
};

function mapQuery({ geo, address, label }: MapLocation) {
  if (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)) {
    return `${geo.lat},${geo.lng}`;
  }

  const query = label?.trim() || address?.trim();
  return query || null;
}

export function buildGoogleMapsEmbedUrl(location: MapLocation) {
  const query = mapQuery(location);
  if (!query) {
    return null;
  }

  const params = new URLSearchParams({
    q: query,
    z: String(location.zoom ?? 15),
    output: "embed",
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}

export function buildGoogleMapsLinkUrl(location: MapLocation) {
  const query = mapQuery(location);
  if (!query) {
    return null;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
