"use client";

import { useRef, useEffect, ReactNode } from "react";

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "up" | "left" | "right" | "fade";
}

export function ScrollRevealSection({
  children,
  className = "",
  animation = "up",
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "left":
        return "scroll-reveal-left";
      case "right":
        return "scroll-reveal-right";
      case "fade":
        return "scroll-reveal-fade";
      default:
        return "scroll-reveal";
    }
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}
