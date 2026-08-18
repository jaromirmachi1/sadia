"use client";

import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";

import { usePathname } from "@/i18n/navigation";

import "lenis/dist/lenis.css";

const DESKTOP_BREAKPOINT = 1024;

type SmoothScrollProps = {
  children: ReactNode;
};

function scrollToTop(lenis: Lenis | null) {
  lenis?.scrollTo(0, { immediate: true });
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    history.scrollRestoration = "manual";

    const desktopQuery = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`,
    );
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let rafId = 0;

    const shouldEnable = () =>
      desktopQuery.matches && !reducedMotionQuery.matches;

    const start = () => {
      if (lenisRef.current || !shouldEnable()) return;

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        anchors: true,
      });

      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenisRef.current?.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const sync = () => {
      if (shouldEnable()) {
        start();
      } else {
        stop();
      }
    };

    sync();
    desktopQuery.addEventListener("change", sync);
    reducedMotionQuery.addEventListener("change", sync);

    return () => {
      desktopQuery.removeEventListener("change", sync);
      reducedMotionQuery.removeEventListener("change", sync);
      stop();
    };
  }, []);

  useEffect(() => {
    scrollToTop(lenisRef.current);
  }, [pathname]);

  return children;
}
