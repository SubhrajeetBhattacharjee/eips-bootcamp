'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface CarouselImage {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  interval?: number;
}

export function ImageCarousel({ images, interval = 5000 }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [images.length, interval, isPaused]);

  const showPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
  };

  if (!images.length) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-emerald-950/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="ETHShala event highlights"
    >
      <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/8]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.src} className="relative min-w-full h-full">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">{image.eyebrow}</p>
                <h3 className="max-w-lg font-grotesk text-xl font-medium text-white sm:text-3xl">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button type="button" onClick={showPrevious} aria-label="Previous event image" className="rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur hover:bg-emerald-400 hover:text-black">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={showNext} aria-label="Next event image" className="rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur hover:bg-emerald-400 hover:text-black">
            <ChevronRight size={18} />
          </button>
          <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'} className="rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur hover:bg-emerald-400 hover:text-black">
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-5 py-3 sm:px-8">
        <div className="flex gap-1.5" role="tablist" aria-label="Event images">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              role="tab"
              aria-selected={imageIndex === activeIndex}
              aria-label={`Show event image ${imageIndex + 1}`}
              onClick={() => setActiveIndex(imageIndex)}
              className={`h-1.5 rounded-full transition-all ${imageIndex === activeIndex ? 'w-8 bg-emerald-400' : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'}`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}