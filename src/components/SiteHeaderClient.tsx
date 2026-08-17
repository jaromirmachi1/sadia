"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

import { BrandLogo } from "@/components/BrandLogo";
import { Container } from "@/components/Container";
import { SiteNavChrome } from "@/components/SiteNavChrome";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routeKeys, type Locale } from "@/utils/routes";

const SCROLL_RANGE = 140;
const LOGO_SCALE_END = 0.92;

type NavItem = {
  href: (typeof routeKeys)[keyof typeof routeKeys];
  label: string;
};

type SiteHeaderClientProps = {
  closeLabel: string;
  interestLabel: string;
  locale: Locale;
  menuLabel: string;
  mobileLabel: string;
  navigation: readonly NavItem[];
  primaryLabel: string;
  variant: "overlay" | "solid" | "light";
};

export function SiteHeaderClient({
  closeLabel,
  interestLabel,
  locale,
  menuLabel,
  mobileLabel,
  navigation,
  primaryLabel,
  variant,
}: SiteHeaderClientProps) {
  const isOverlay = variant === "overlay";
  const [overDarkSection, setOverDarkSection] = useState(isOverlay);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const scrollProgress = useTransform(
    scrollY,
    [0, SCROLL_RANGE],
    [0, 1],
    { clamp: true },
  );
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: reduceMotion ? 1000 : 90,
    damping: reduceMotion ? 100 : 28,
    mass: 0.6,
  });
  const logoScale = useTransform(
    smoothProgress,
    [0, 1],
    [1, LOGO_SCALE_END],
  );
  const headerHeight = useTransform(smoothProgress, (progress) => {
    const desktop =
      typeof window !== "undefined"
        ? window.matchMedia("(min-width: 768px)").matches
        : true;

    if (desktop) {
      return `${6.75 - progress * 0.75}rem`;
    }

    return `${5.5 - progress * 0.5}rem`;
  });
  const headerChromeOpacity = useTransform(smoothProgress, [0, 0.45, 1], [0, 0.6, 1]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const onScroll = () => {
      const probeY = media.matches ? 38 : 34;
      const overDark = Array.from(
        document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]'),
      ).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });
      setOverDarkSection(overDark);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", onScroll);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = headerHeight.on("change", (value) => {
      document.documentElement.style.setProperty("--sadia-header-height", value);
    });

    return unsubscribe;
  }, [headerHeight]);

  const useDarkChrome = isOverlay && overDarkSection;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[opacity,visibility] duration-500",
          menuOpen && "pointer-events-none invisible opacity-0",
          !useDarkChrome
            ? "text-sadia-navy-black"
            : "text-sadia-white",
        )}
      >
        {!useDarkChrome ? (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border-b border-black/6 bg-white/92 shadow-[0_8px_32px_rgba(18,20,46,0.035)] backdrop-blur-xl"
            style={{ opacity: variant === "solid" ? 1 : headerChromeOpacity }}
          />
        ) : null}

        <Container className="relative">
          <motion.div
            style={{ height: headerHeight }}
            className="flex items-center justify-between"
          >
            <Link
              href="/"
              aria-label="SADIA"
              className="relative z-51 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <motion.span
                className="inline-block origin-left"
                style={{ scale: logoScale }}
              >
                <BrandLogo
                  tone={useDarkChrome ? "white" : "navy"}
                  size="md"
                  className="w-30 md:w-36"
                  priority
                />
              </motion.span>
            </Link>

            <SiteNavChrome
            locale={locale}
            isLight={!useDarkChrome}
            navigation={navigation}
            interestLabel={interestLabel}
            menuLabel={menuLabel}
            closeLabel={closeLabel}
            primaryLabel={primaryLabel}
            mobileLabel={mobileLabel}
            onOpenChange={setMenuOpen}
            />
          </motion.div>
        </Container>
      </header>

      {/* Keeps page content below the fixed bar on solid pages */}
      {variant === "solid" ? (
        <motion.div
          aria-hidden="true"
          style={{ height: headerHeight }}
        />
      ) : null}
    </>
  );
}
