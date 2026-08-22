import { Reveal } from "@/components/Reveal";
import type { ProjectTimelineItem } from "@/sanity/types";

type ProjectTimelineProps = {
  heading: string;
  items: ProjectTimelineItem[];
};

function TimelinePath({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 12 80"
        preserveAspectRatio="none"
        className="absolute top-3 left-[0.7rem] h-[calc(100%+2.5rem)] w-3 text-[#4A90C0]/55"
      >
        <path
          d="M6 0 V68"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          strokeLinecap="round"
        />
        <path
          d="M2.5 64 L6 72 L9.5 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 12"
      preserveAspectRatio="none"
      className="mx-3 h-3 min-w-0 flex-1 text-[#4A90C0]/55"
    >
      <path
        d="M0 6 H148"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        strokeLinecap="round"
      />
      <path
        d="M142 2.5 L152 6 L142 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProjectTimeline({ heading, items }: ProjectTimelineProps) {
  return (
    <Reveal>
      <h2 className="sadia-heading-section">{heading}</h2>

      <ol className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-start md:gap-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`${item.title}-${index}`}
              className="relative flex flex-1 md:min-w-0"
            >
              {!isLast ? (
                <span className="md:hidden">
                  <TimelinePath vertical />
                </span>
              ) : null}

              <div className="flex min-w-0 flex-1 flex-col pl-8 md:pl-0">
                <div className="mb-6 flex items-center">
                  <span
                    aria-hidden="true"
                    className="relative z-1 size-3 shrink-0 rounded-full bg-[#4A90C0] ring-[6px] ring-sadia-white"
                  />
                  {!isLast ? (
                    <span className="hidden md:flex md:min-w-0 md:flex-1">
                      <TimelinePath />
                    </span>
                  ) : null}
                </div>

                <p className="font-display text-body-sm font-medium tracking-[0.06em] text-[#4A90C0]">
                  {item.date || String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 max-w-[16ch] font-display text-heading-md font-medium text-sadia-navy-black">
                  {item.title}
                </h3>
                {item.description ? (
                  <p className="mt-3 max-w-xs text-body-base leading-relaxed text-sadia-navy-black/65">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}
