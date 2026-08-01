"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type RevealDirection = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  direction?: RevealDirection;
  className?: string;
}

const hiddenClasses: Record<RevealDirection, string> = {
  up: "opacity-0 translate-y-14",
  left: "opacity-0 -translate-x-14",
  right: "opacity-0 translate-x-14",
  scale: "opacity-0 scale-95",
};

const visibleClasses: Record<RevealDirection, string> = {
  up: "opacity-100 translate-y-0",
  left: "opacity-100 translate-x-0",
  right: "opacity-100 translate-x-0",
  scale: "opacity-100 scale-100",
};

// Scroll-triggered reveal, IntersectionObserver-driven (same pattern as
// Header's scrollspy) so no animation library is needed. Slow (1.5s) ease-out
// for a calm, premium feel; `direction` varies the entrance per section so
// the page doesn't feel like the same animation repeating down the scroll.
export function Reveal({ children, direction = "up", className = "" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1500ms] ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        isVisible ? visibleClasses[direction] : hiddenClasses[direction]
      } ${className}`}
    >
      {children}
    </div>
  );
}
