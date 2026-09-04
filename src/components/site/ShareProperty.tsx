import { useEffect, useRef, useState } from "react";
import { Check, Copy, Facebook, Linkedin, Mail, MessageCircle, Send, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ShareTarget = { label: string; href: string; icon: typeof MessageCircle };

function shareText(title: string, detail?: string) {
  return detail ? `${title} — ${detail}` : title;
}

export function shareTargets(url: string, title: string, detail?: string): ShareTarget[] {
  const text = encodeURIComponent(`${shareText(title, detail)}\n${url}`);
  const encodedUrl = encodeURIComponent(url);
  return [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}`, icon: MessageCircle },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${text}`, icon: X },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, icon: Linkedin },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareText(title, detail))}`, icon: Send },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${text}`, icon: Mail },
  ];
}

export function ShareMenu({
  url,
  title,
  detail,
  open,
  onClose,
}: {
  url: string;
  title: string;
  detail?: string | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText(title, detail)}\n${url}`);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`Share ${title}`}
      className="absolute z-40 w-64 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
    >
      <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Share this property
      </p>
      <ul className="grid gap-1">
        {shareTargets(url, title, detail).map((t) => (
          <li key={t.label}>
            <a
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <t.icon className="size-4 text-gold" /> Share on {t.label}
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={copy}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-secondary"
          >
            {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4 text-gold" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </li>
      </ul>
    </div>
  );
}

export function ShareButton({
  url,
  title,
  detail,
  variant = "pill",
  className,
}: {
  url: string;
  title: string;
  detail?: string;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const onClick = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText(title, detail), url });
        return;
      } catch {
        /* user cancelled or unavailable — fall through to menu */
        return;
      }
    }
    setOpen((v) => !v);
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Share ${title}`}
        className={
          variant === "icon"
            ? "inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-secondary"
            : "inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        }
      >
        <Share2 className="size-4" />
        {variant === "pill" ? "Share" : null}
      </button>
      <div className="absolute bottom-full right-0 mb-2">
        <ShareMenu url={url} title={title} detail={detail} open={open} onClose={() => setOpen(false)} />
      </div>
    </span>
  );
}
