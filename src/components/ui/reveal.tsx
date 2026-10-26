"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  threshold = 0.1,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [observerSupported, setObserverSupported] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasBeenVisibleRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      return;
    }

    setObserverSupported(true);

    if (!window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
              hasBeenVisibleRef.current = true;
            }
          } else if (!once && !hasBeenVisibleRef.current) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [threshold, rootMargin, once]);

  // Server render and initial client render: show content if no observer support or reduced motion
  const shouldShowContent = !observerSupported || isVisible;

  return (
    <div
      ref={elementRef}
      className={`reveal-target ${isVisible ? "is-visible" : ""} ${className ?? ""}`}
      style={{
        opacity: shouldShowContent ? 1 : 0,
        transform: shouldShowContent ? "translateY(0)" : "translateY(24px)",
      }}
    >
      {children}
    </div>
  );
}