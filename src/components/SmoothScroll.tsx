"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import "lenis/dist/lenis.css";

const DESKTOP_BREAKPOINT = 1024;

type SmoothScrollProps = {
  children: ReactNode;
};

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const desktopQuery = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`,
    );
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let lenis: Lenis | null = null;
    let rafId = 0;

    const shouldEnable = () =>
      desktopQuery.matches && !reducedMotionQuery.matches;

    const start = () => {
      if (lenis || !shouldEnable()) return;

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        anchors: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
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

  return children;
}
