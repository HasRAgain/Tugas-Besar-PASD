"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface InteractiveBackgroundProps {
  rows?: number;
}

export function InteractiveBackground({ rows = 30 }: InteractiveBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; delay: string; size: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    
    // Jittered grid approach: Divides screen into cells.
    // We use 6 columns. Columns 0,1 (left 33%) and 4,5 (right 33%) are safe.
    // This provides a massive, wide spread without touching the center 33% text area.
    const newStars: { id: number; top: string; left: string; delay: string; size: number }[] = [];
    const numCols = 6;
    const activeCols = [0, 1, 4, 5];
    let idCounter = 0;

    for (let r = 0; r < rows; r++) {
      for (const c of activeCols) {
        // 60% chance to spawn a star in an active cell for an organic, scattered look
        if (Math.random() > 0.4) {
          const cellWidth = 100 / numCols;
          const cellHeight = 100 / rows;

          // Jitter: place star randomly inside the cell, but keep a 20% padding
          // from the cell's edges so stars in adjacent cells never touch or get too close.
          const randomX = 0.2 + Math.random() * 0.6;
          const randomY = 0.2 + Math.random() * 0.6;

          newStars.push({
            id: idCounter++,
            left: `${(c + randomX) * cellWidth}%`,
            top: `${(r + randomY) * cellHeight}%`,
            delay: `${Math.random() * 5}s`,
            size: Math.random() * 14 + 8, // 8px to 22px
          });
        }
      }
    }
    setStars(newStars);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      {/* Interactive Glowing Orb */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-100 transition-opacity duration-500 h-full w-full"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, color-mix(in srgb, var(--primary) 15%, transparent), transparent 80%)`,
        }}
      />
      
      {/* Subtle Animated Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20 dark:opacity-30 h-full w-full" 
           style={{
             backgroundImage: `linear-gradient(to right, color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--foreground) 5%, transparent) 1px, transparent 1px)`,
             backgroundSize: `40px 40px`,
             maskImage: `radial-gradient(circle at center, black, transparent 80%)`,
             WebkitMaskImage: `radial-gradient(circle at center, black, transparent 80%)`,
           }}
      />

      {/* Floating Sparkle Stars */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden h-full w-full">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute animate-pulse text-primary/40 dark:text-primary/60"
            style={{
              top: star.top,
              left: star.left,
              animationDuration: '3s',
              animationDelay: star.delay,
            }}
          >
            <Sparkles style={{ width: star.size, height: star.size }} />
          </div>
        ))}
      </div>
    </>
  );
}
