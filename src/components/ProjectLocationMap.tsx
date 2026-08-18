import { buildGoogleMapsEmbedUrl } from "@/utils/maps";

type ProjectLocationMapProps = {
  title: string;
  address: string;
  label?: string;
  geo?: { lat: number; lng: number };
};

export function ProjectLocationMap({
  title,
  address,
  label,
  geo,
}: ProjectLocationMapProps) {
  const embedUrl = buildGoogleMapsEmbedUrl({
    geo,
    address,
    label,
    zoom: geo ? 16 : 15,
  });

  if (!embedUrl) {
    return null;
  }

  return (
    <div className="w-full bg-sadia-gray-light/40">
      <iframe
        title={title}
        src={embedUrl}
        className="block h-[min(72vh,44rem)] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
