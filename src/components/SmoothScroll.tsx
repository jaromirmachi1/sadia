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

function flushScrollToTop(lenis: Lenis | null) {
  scrollToTop(lenis);
  requestAnimationFrame(() => {
    scrollToTop(lenis);
    requestAnimationFrame(() => scrollToTop(lenis));
  });
}

function isInternalNavigationLink(anchor: HTMLAnchorElement) {
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }

  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  if (anchor.dataset.noScrollTop === "true") {
    return false;
  }

  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) {
      return false;
    }

    const current = new URL(window.location.href);
    if (url.pathname === current.pathname && url.search === current.search && url.hash) {
      return false;
    }

    return (
      url.pathname !== current.pathname ||
      url.search !== current.search ||
      Boolean(url.hash)
    );
  } catch {
    return false;
  }
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
    flushScrollToTop(lenisRef.current);
    const retry = window.setTimeout(() => flushScrollToTop(lenisRef.current), 0);
    return () => window.clearTimeout(retry);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavigationLink(anchor)) return;

      flushScrollToTop(lenisRef.current);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return children;
}
