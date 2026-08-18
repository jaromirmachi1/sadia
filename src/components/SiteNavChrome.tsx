"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { BrandLogo } from "@/components/BrandLogo";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { routeKeys, type Locale } from "@/utils/routes";

const MENU_CURTAIN_EASE = [0.46, 0.69, 0.71, 1] as const;
const MENU_ITEM_EASE = [0.16, 0.01, 0.77, 1] as const;
const MENU_FOOTER_EASE = [0.16, 1, 0.3, 1] as const;

type NavItem = {
  href: (typeof routeKeys)[keyof typeof routeKeys];
  label: string;
};

type SiteNavChromeProps = {
  closeLabel: string;
  interestLabel: string;
  isLight: boolean;
  locale: Locale;
  menuLabel: string;
  mobileLabel: string;
  navigation: readonly NavItem[];
  onOpenChange?: (open: boolean) => void;
  primaryLabel: string;
};

type BurgerButtonProps = {
  label: string;
  open: boolean;
  isLight: boolean;
  onClick: () => void;
  controls?: string;
};

function BurgerButton({
  label,
  open,
  isLight,
  onClick,
  controls,
}: BurgerButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "group relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4",
        isLight
          ? "text-sadia-navy-black hover:bg-sadia-navy-black/5"
          : "text-sadia-white hover:bg-white/10",
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="relative block h-3 w-[clamp(2.25rem,2.5vw,3.5rem)]"
      >
        <span
          className={cn(
            "absolute left-0 top-0 h-[1.5px] w-full overflow-hidden bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 -translate-x-[105%] transition-transform duration-[420ms] ease-out group-hover:translate-x-[110%]",
              isLight ? "bg-sadia-white" : "bg-sadia-gray-light",
            )}
          />
        </span>
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[1.5px] w-full overflow-hidden bg-current transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 -translate-x-[105%] transition-transform duration-[420ms] ease-out delay-100 group-hover:translate-x-[110%]",
              isLight ? "bg-sadia-white" : "bg-sadia-gray-light",
            )}
          />
        </span>
      </span>
    </button>
  );
}

export function SiteNavChrome({
  closeLabel,
  interestLabel,
  isLight,
  locale,
  menuLabel,
  mobileLabel,
  navigation,
  onOpenChange,
  primaryLabel,
}: SiteNavChromeProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const reduceMotion = useReducedMotion();

  const setMenuOpen = useCallback(
    (next: boolean) => {
      setOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.documentElement.dataset.menuOpen = "true";
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = "";
      delete document.documentElement.dataset.menuOpen;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open, setMenuOpen]);

  const curtainDuration = reduceMotion ? 0 : 1;
  const exitDuration = reduceMotion ? 0 : 1 / 1.32;

  const menuPanel = (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="sadia-menu"
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={primaryLabel}
          className="fixed inset-0 z-[120]"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 origin-top bg-sadia-sky"
            variants={{
              open: {
                scaleY: 1,
                transition: {
                  duration: curtainDuration,
                  ease: MENU_CURTAIN_EASE,
                },
              },
              closed: {
                scaleY: 0,
                transition: {
                  duration: exitDuration,
                  ease: MENU_CURTAIN_EASE,
                  when: "afterChildren",
                },
              },
            }}
          />

          <motion.div
            className="relative mx-auto flex h-full w-full max-w-[100vw] flex-col px-gutter pb-10"
            variants={{
              open: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.01 } },
              closed: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.01 } },
            }}
          >
            <motion.div
              className="flex h-[var(--sadia-header-height)] items-center justify-between"
              variants={{
                open: {
                  opacity: 1,
                  transition: {
                    duration: reduceMotion ? 0 : 0.2,
                    delay: reduceMotion ? 0 : 0.4,
                  },
                },
                closed: {
                  opacity: 0,
                  transition: { duration: reduceMotion ? 0 : 0.15 },
                },
              }}
            >
              <Link
                href="/"
                aria-label="SADIA"
                onClick={() => setMenuOpen(false)}
                className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                <BrandLogo
                  tone="navy"
                  size="sm"
                  className="w-[5.5rem] md:w-[6.5rem]"
                />
              </Link>

              <BurgerButton
                label={closeLabel}
                open
                isLight
                onClick={() => setMenuOpen(false)}
              />
            </motion.div>

            <nav
              aria-label={mobileLabel}
              className="flex flex-1 flex-col justify-center py-8"
            >
              {navigation.map((item, index) => (
                <div
                  key={`${item.href}-${item.label}`}
                  className="overflow-hidden"
                >
                  <motion.div
                    variants={{
                      open: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: reduceMotion ? 0 : 0.8,
                          delay: reduceMotion ? 0 : 0.3 + index * 0.07,
                          ease: MENU_CURTAIN_EASE,
                        },
                      },
                      closed: {
                        opacity: 0,
                        y: reduceMotion ? 0 : "-1.5em",
                        transition: {
                          duration: reduceMotion ? 0 : 0.45,
                          delay: reduceMotion
                            ? 0
                            : (navigation.length - 1 - index) * 0.04,
                          ease: MENU_CURTAIN_EASE,
                        },
                      },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-1.5 font-display text-[clamp(2.25rem,6.4vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.02em] text-sadia-navy-black transition-colors duration-300 hover:text-sadia-white md:py-2"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div
              className="flex items-center justify-between border-t border-sadia-navy/15 pt-6"
              variants={{
                open: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: reduceMotion ? 0 : 0.8,
                    delay: reduceMotion ? 0 : 0.8,
                    ease: MENU_FOOTER_EASE,
                  },
                },
                closed: {
                  opacity: 0,
                  y: reduceMotion ? 0 : "1.5em",
                  transition: {
                    duration: reduceMotion ? 0 : 0.45,
                    ease: MENU_FOOTER_EASE,
                  },
                },
              }}
            >
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: reduceMotion ? 0 : 0.8,
                      delay: reduceMotion ? 0 : 0.7,
                      ease: MENU_ITEM_EASE,
                    },
                  },
                  closed: {
                    opacity: 0,
                    y: reduceMotion ? 0 : "-1em",
                    transition: { duration: reduceMotion ? 0 : 0.35 },
                  },
                }}
              >
                <LocaleSwitcher locale={locale} />
              </motion.div>
              <motion.div
                variants={{
                  open: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: reduceMotion ? 0 : 0.8,
                      delay: reduceMotion ? 0 : 0.76,
                      ease: MENU_ITEM_EASE,
                    },
                  },
                  closed: {
                    opacity: 0,
                    y: reduceMotion ? 0 : "-1em",
                    transition: { duration: reduceMotion ? 0 : 0.35 },
                  },
                }}
              >
                <Link
                  href={routeKeys.contact}
                  onClick={() => setMenuOpen(false)}
                  className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-sadia-navy/70 transition-colors duration-300 hover:text-sadia-navy-black"
                >
                  {interestLabel}
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <nav
        aria-label={primaryLabel}
        className="hidden items-center gap-4 md:flex lg:gap-6"
      >
        {navigation
          .filter((item) => item.href !== routeKeys.home)
          .map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            className={cn(
              "sadia-underline-link relative whitespace-nowrap pb-1 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-opacity duration-300 focus-visible:outline-2 focus-visible:outline-offset-4",
              isLight
                ? "text-sadia-navy-black hover:opacity-100"
                : "text-sadia-white/80 hover:text-sadia-white",
            )}
          >
            {item.label}
          </Link>
        ))}
        <LocaleSwitcher locale={locale} />
      </nav>

      <div className="flex items-center md:hidden">
        <BurgerButton
          label={open ? closeLabel : menuLabel}
          open={open}
          isLight={isLight}
          controls={panelId}
          onClick={() => setMenuOpen(!open)}
        />
      </div>

      {mounted ? createPortal(menuPanel, document.body) : null}
    </>
  );
}
