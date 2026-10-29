// apps/web/app/components/community/ImageCarousel.tsx

'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { gsap } from 'gsap';

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
  const textRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // GSAP text reveal animation on slide change
  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [activeIndex]);

  // GSAP progress bar animation
  useEffect(() => {
    if (!progressBarRef.current) return;
    if (isPaused) {
      gsap.to(progressBarRef.current, { timeScale: 0 });
      return;
    }

    gsap.fromTo(
      progressBarRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: interval / 1000, ease: 'none', transformOrigin: 'left' }
    );
  }, [activeIndex, isPaused, interval]);

  useEffect(() => {
    if (isPaused || images.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [images.length, interval, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') showPrevious();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

  const showPrevious = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % images.length);
  };

  if (!images.length) return null;

  return (
    <div
      className="group relative flex flex-col gap-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="ETHShala event highlights"
    >
      {/* Main Cinematic Panoramic Stage */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] overflow-hidden rounded-3xl border border-white/15 bg-black/60 shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, idx) => (
            <div key={image.src} className="relative min-w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                loading={idx === 0 ? "eager" : "lazy"}
                fetchPriority={idx === 0 ? "high" : "auto"}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Cinematic Vignette & Bottom Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20" />
            </div>
          ))}
        </div>

        {/* Dynamic Animated Text Overlay with GSAP Stagger */}
        <div ref={textRef} className="absolute inset-x-0 bottom-0 p-6 sm:p-12 max-w-4xl z-10 pointer-events-none">
          <p className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#ffd359] px-3 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-md">
            <span>{images[activeIndex].eyebrow}</span>
          </p>
          <h3 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.05] drop-shadow-md">
            {images[activeIndex].title}
          </h3>
        </div>

        {/* Floating Glass Navigation Controls */}
        <div className="absolute right-6 top-6 flex items-center gap-2.5 opacity-90 transition-opacity group-hover:opacity-100 z-20">
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous event image"
            className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md p-3 text-white hover:bg-[#61d9b9] hover:text-black hover:border-[#61d9b9] transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Next event image"
            className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md p-3 text-white hover:bg-[#61d9b9] hover:text-black hover:border-[#61d9b9] transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
            className="rounded-xl border border-white/20 bg-black/70 backdrop-blur-md p-3 text-white hover:bg-[#61d9b9] hover:text-black hover:border-[#61d9b9] transition-all duration-200"
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>

        {/* Slide Counter Indicator */}
        <div className="absolute left-6 top-6 z-20 hidden sm:block">
          <span className="rounded-xl border border-white/15 bg-black/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-white/90">
            {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>

        {/* Live Progress Bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
          <div ref={progressBarRef} className="h-full w-full bg-[#61d9b9] origin-left" />
        </div>
      </div>

      {/* Interactive Thumbnail Previews Strip with GSAP hover scale */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group/thumb relative aspect-[16/10] overflow-hidden rounded-xl border transition-all duration-300 ${
              activeIndex === index
                ? 'border-[#61d9b9] ring-2 ring-[#61d9b9]/50 shadow-lg scale-100'
                : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-1.5 left-2 right-2 truncate text-[10px] font-bold text-white drop-shadow">
              {image.eyebrow.split('·')[0]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}