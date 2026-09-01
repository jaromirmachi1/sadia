import { buildGoogleMapsEmbedUrl } from "@/utils/maps";
import { cn } from "@/lib/utils";

type ProjectLocationMapProps = {
  title: string;
  address: string;
  label?: string;
  geo?: { lat: number; lng: number };
  fill?: boolean;
  className?: string;
};

export function ProjectLocationMap({
  title,
  address,
  label,
  geo,
  fill = false,
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
        "overflow-hidden bg-sadia-gray-light/40",
        fill ? "absolute inset-0" : "rounded-2xl",
        className,
      )}
    >
      <iframe
        title={title}
        src={embedUrl}
        className={cn(
          "block w-full border-0",
          fill
            ? "h-full min-h-[min(78svh,40rem)]"
            : "h-[min(28rem,70vh)] lg:h-full lg:min-h-[28rem]",
        )}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
