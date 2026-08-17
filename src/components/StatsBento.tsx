"use client";

import { animate, motion, useInView, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import type { Locale } from "@/utils/routes";

export type StatItem = {
  label: string;
  value: number;
};

type StatsBentoProps = {
  items: StatItem[];
  locale: Locale;
};

function AnimatedValue({ value, locale }: { value: number; locale: Locale }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  useEffect(() => {
    if (!inView) return;

    const controls = animate(motionValue, value, {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
    });

    return controls.stop;
  }, [inView, motionValue, value]);

  return (
    <span ref={ref}>
      {new Intl.NumberFormat(locale === "cs" ? "cs-CZ" : "en-GB").format(
        displayValue,
      )}
    </span>
  );
}

function StatCard({
  item,
  index,
  locale,
}: {
  item: StatItem;
  index: number;
  locale: Locale;
}) {
  const cardRef = useRef<HTMLElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - rect.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={cardRef}
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.055,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4 }}
      style={
        {
          "--spotlight-x": "50%",
          "--spotlight-y": "50%",
        } as CSSProperties
      }
      className="group relative isolate flex min-h-44 overflow-hidden rounded-xl border border-black/6 bg-sadia-white p-6 shadow-[0_12px_36px_rgba(18,20,46,0.035)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--spotlight-x) var(--spotlight-y), rgba(74, 144, 192, 0.14), transparent 45%)",
        }}
      />

      <div className="flex w-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-gray">
            {String(index + 1).padStart(2, "0")}
          </p>
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-[#4A90C0] transition-transform duration-500 group-hover:scale-[1.6]"
          />
        </div>

        <div>
          <p
            className="font-display text-[clamp(3rem,5vw,4.5rem)] font-medium leading-none tracking-tighter text-sadia-navy-black"
          >
            <AnimatedValue value={item.value} locale={locale} />
          </p>
          <p className="mt-4 text-body-sm font-medium uppercase tracking-[0.14em] text-sadia-gray">
            {item.label}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function StatsBento({ items, locale }: StatsBentoProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <StatCard
          key={item.label}
          item={item}
          index={index}
          locale={locale}
        />
      ))}
    </div>
  );
}
