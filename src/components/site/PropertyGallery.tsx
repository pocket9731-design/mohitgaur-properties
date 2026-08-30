import { useState } from "react";
import { X } from "lucide-react";
import fallbackImg from "@/assets/wallhaven-d5zkmm.jpg";

export function PropertyGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : [fallbackImg];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImg;
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open full screen image"
        className="block w-full overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]"
      >
        <img
          src={list[active]}
          alt={alt}
          width={1200}
          height={900}
          onError={onError}
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
        />
      </button>

      {list.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                i === active ? "border-gold" : "border-border hover:border-gold/60"
              }`}
            >
              <img
                src={src}
                alt={`${alt} — view ${i + 1}`}
                loading="lazy"
                onError={onError}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-4"
        >
          <button
            type="button"
            aria-label="Close image viewer"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-background text-foreground"
          >
            <X className="size-5" />
          </button>
          <img
            src={list[active]}
            alt={alt}
            onError={onError}
            className="max-h-[85vh] w-auto max-w-full rounded-2xl object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
