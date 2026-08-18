import { cn } from "@/lib/utils";
import type { UnitStatus } from "@/sanity/types";

const statusStyles: Record<UnitStatus, string> = {
  available: "bg-sadia-navy-black text-sadia-white",
  reserved: "bg-sadia-gray text-sadia-white",
  sold: "bg-sadia-navy-black text-sadia-white",
  soldThirdParty: "bg-sadia-navy-black text-sadia-white",
  rented: "bg-sadia-navy-black text-sadia-white",
};

type StatusBadgeProps = {
  label: string;
  status: UnitStatus;
  className?: string;
};

export function StatusBadge({ label, status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex px-2.5 py-1 text-body-sm font-medium uppercase tracking-[0.08em]",
        statusStyles[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
