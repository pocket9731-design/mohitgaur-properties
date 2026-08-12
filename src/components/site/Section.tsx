import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "sand" | "ink";
}) {
  return (
    <section
      id={id}
      className={cn(
        "px-5 py-16 sm:px-8 md:py-24",
        tone === "sand" && "bg-sand",
        tone === "ink" && "bg-ink text-primary-foreground",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className="mt-3 text-3xl leading-tight sm:text-4xl md:text-[2.6rem]">{title}</Tag>
      <span className={cn("gold-rule mt-5", center && "mx-auto")} />
      {subtitle ? <p className="mt-5 text-base leading-relaxed text-muted-foreground">{subtitle}</p> : null}
    </div>
  );
}
