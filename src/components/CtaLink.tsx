import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type CtaVariant = "primary" | "inverse" | "ghost";

type CtaClassProps = {
  variant?: CtaVariant;
  className?: string;
};

function ctaClassName({ variant = "primary", className }: CtaClassProps) {
  return cn("sadia-cta", `sadia-cta-${variant}`, className);
}

function CtaContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span className="sadia-cta-label">{children}</span>
      <span className="sadia-cta-mark" aria-hidden="true">
        ↗
      </span>
    </>
  );
}

type CtaLinkProps = CtaClassProps &
  Omit<React.ComponentProps<typeof Link>, "className">;

export function CtaLink({
  variant = "primary",
  className,
  children,
  ...props
}: CtaLinkProps) {
  return (
    <Link className={ctaClassName({ variant, className })} {...props}>
      <CtaContent>{children}</CtaContent>
    </Link>
  );
}

type CtaButtonProps = CtaClassProps &
  Omit<React.ComponentPropsWithoutRef<"button">, "className">;

export function CtaButton({
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: CtaButtonProps) {
  return (
    <button
      type={type}
      className={ctaClassName({ variant, className })}
      {...props}
    >
      <CtaContent>{children}</CtaContent>
    </button>
  );
}

type CtaAnchorProps = CtaClassProps &
  Omit<React.ComponentPropsWithoutRef<"a">, "className">;

export function CtaAnchor({
  variant = "primary",
  className,
  children,
  ...props
}: CtaAnchorProps) {
  return (
    <a className={ctaClassName({ variant, className })} {...props}>
      <CtaContent>{children}</CtaContent>
    </a>
  );
}
