"use client";

import { useRef, useEffect, useState, Children } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Carousel({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const initialCheckDone = useRef(false);

  // Intersection Observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Skip observer if IntersectionObserver is not supported
    if (typeof IntersectionObserver === "undefined") {
      // Defer setState to avoid sync call in effect
      setTimeout(() => setRevealed(true), 0);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initial check for already-visible section (deferred to avoid sync setState)
  useEffect(() => {
    const el = sectionRef.current;
    if (el && !initialCheckDone.current) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        setRevealed(true);
      }
      initialCheckDone.current = true;
    }
  }, []);

  // Scroll arrow logic
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    const scrollAmount = current.clientWidth * 0.8;
    current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div ref={sectionRef} className="py-6 lg:py-10">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 flex items-end justify-between gap-6 mb-4">
        <h2 className="font-display text-2xl leading-tight tracking-tight lg:text-4xl">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <Link
            href={href}
            className="hidden sm:inline-flex text-sm font-medium underline-offset-4 hover:underline"
          >
            View all
          </Link>
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mn-border-strong hover:bg-mn-blush transition-colors"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-mn-border-strong hover:bg-mn-blush transition-colors"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 lg:scroll-px-12 px-5 sm:px-8 lg:px-12 pb-4"
      >
        {Children.map(children, (child, index) => (
          <div
            className={cn(
              "shrink-0 snap-start w-[75vw] sm:w-[45vw] md:w-[30vw] lg:w-[22vw] xl:w-[18vw]",
              revealed ? "animate-carousel-item" : "opacity-0"
            )}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}