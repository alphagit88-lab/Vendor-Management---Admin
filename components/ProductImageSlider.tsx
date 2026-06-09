"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/MediaImage";

type ProductImageSliderProps = {
  images: string[];
  alt: string;
};

export function ProductImageSlider({ images, alt }: ProductImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    setCurrent((index + images.length) % images.length);
  };

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] bg-white shadow-[0_24px_64px_rgba(17,32,51,0.08)]">
      <div className="relative aspect-square overflow-hidden">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="relative h-full min-w-full shrink-0">
              <MediaImage
                src={src}
                alt={`${alt} — view ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(current - 1)}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--landing-brand-strong)] shadow-[0_8px_24px_rgba(17,32,51,0.12)] transition hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(current + 1)}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--landing-brand-strong)] shadow-[0_8px_24px_rgba(17,32,51,0.12)] transition hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === current
                      ? "w-6 bg-[var(--landing-accent)]"
                      : "w-2 bg-white/70 hover:bg-white"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
