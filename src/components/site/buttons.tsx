import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60";

export const btnStyles = {
  primary: cn(base, "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-[var(--shadow-lift)]"),
  gold: cn(base, "bg-gold text-primary-foreground hover:opacity-90 hover:shadow-[var(--shadow-lift)]"),
  outline: cn(base, "border border-border bg-transparent text-foreground hover:bg-secondary"),
  light: cn(base, "bg-card text-foreground hover:bg-sand"),
  whatsapp: cn(base, "bg-whatsapp text-primary-foreground hover:opacity-90"),
  ghost: cn(base, "px-0 text-foreground underline-offset-4 hover:text-gold"),
};

type Variant = keyof typeof btnStyles;

export function A({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  return (
    <a className={cn(btnStyles[variant], className)} {...props}>
      {children}
    </a>
  );
}

export function L({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(btnStyles[variant], className)} {...props} />;
}

export function B({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(btnStyles[variant], className)} {...props} />;
}
