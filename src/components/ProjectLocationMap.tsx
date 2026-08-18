import { buildGoogleMapsEmbedUrl } from "@/utils/maps";
import { cn } from "@/lib/utils";

type ProjectLocationMapProps = {
  title: string;
  address: string;
  label?: string;
  geo?: { lat: number; lng: number };
  className?: string;
};

export function ProjectLocationMap({
  title,
  address,
  label,
  geo,
  className,
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
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-sadia-gray-light/40",
        className,
      )}
    >
      <iframe
        title={title}
        src={embedUrl}
        className="block h-[min(28rem,70vh)] w-full border-0 lg:h-full lg:min-h-[28rem]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
