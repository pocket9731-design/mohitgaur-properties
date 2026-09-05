import { useEffect, useRef, useState } from "react";
import { Share2, MessageCircle, Facebook, Linkedin, Send, Mail, Link2, X } from "lucide-react";
import { toast } from "sonner";

type ShareTarget = {
  name: string;
  icon: typeof Share2;
  href: string;
};

export function shareTargets(url: string, title: string, detail?: string | undefined): ShareTarget[] {
  const text = detail ? `${title} — ${detail}` : title;
  const full = `${text}\n${url}`;
  const enc = encodeURIComponent;
  return [
    { name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(full)}` },
    { name: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { name: "X", icon: Send, href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { name: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "Telegram", icon: Send, href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
    { name: "Email", icon: Mail, href: `mailto:?subject=${enc(title)}&body=${enc(full)}` },
  ];
}

export function ShareMenu({
  url,
  title,
  detail,
  onClose,
}: {
  url: string;
  title: string;
  detail?: string | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, [onClose]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy link");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share property"
    >
      <div ref={ref} className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="font-display text-lg">Share this property</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share menu"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{title}</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {shareTargets(url, title, detail).map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 rounded-2xl border border-border px-3 py-4 text-xs font-medium transition-colors hover:border-gold hover:text-gold"
            >
              <t.icon className="size-5" /> {t.name}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border px-3 py-4 text-xs font-medium transition-colors hover:border-gold hover:text-gold"
          >
            <Link2 className="size-5" /> Copy link
          </button>
        </div>
      </div>
    </div>
  );
}

export function ShareButton({
  url,
  title,
  detail,
  variant = "pill",
}: {
  url: string;
  title: string;
  detail?: string | undefined;
  variant?: "pill" | "icon";
}) {
  const [open, setOpen] = useState(false);

  const onShare = async () => {
    const text = detail ? `${title} — ${detail}` : title;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // user cancelled or unsupported — fall through to menu
      }
    }
    setOpen(true);
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={onShare}
          aria-label={`Share ${title}`}
          className="absolute right-4 top-4 rounded-full bg-background/90 p-2 text-foreground shadow-sm transition-colors hover:text-gold"
        >
          <Share2 className="size-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
        >
          <Share2 className="size-4" /> Share
        </button>
      )}
      {open ? <ShareMenu url={url} title={title} detail={detail} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
