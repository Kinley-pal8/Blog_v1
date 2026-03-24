"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (!cursor || !dot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let dotX = 0;
    let dotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Animate cursor circle
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      cursor.style.left = cursorX - 8 + "px";
      cursor.style.top = cursorY - 8 + "px";

      // Animate dot (follows cursor more directly)
      dotX += (mouseX - dotX) * 0.5;
      dotY += (mouseY - dotY) * 0.5;

      dot.style.left = dotX - 4 + "px";
      dot.style.top = dotY - 4 + "px";
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor pointer-events-none hidden md:block"
      />
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none hidden md:block"
      />
    </>
  );
}
