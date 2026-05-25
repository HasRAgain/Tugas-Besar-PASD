"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecommendationCarouselProps {
  children: ReactNode;
}

export function RecommendationCarousel({ children }: RecommendationCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of container width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  // Initial check in case content doesn't overflow
  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  return (
    <div className="relative group">
      {/* Left Scroll Button */}
      <div 
        className={`absolute -left-4 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-200 ${
          showLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 rounded-full shadow-md border bg-background text-foreground hover:bg-muted" 
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Scroll Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto pb-6 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      {/* Right Scroll Button */}
      <div 
        className={`absolute -right-4 top-1/2 -translate-y-1/2 z-20 transition-opacity duration-200 ${
          showRight ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-10 w-10 rounded-full shadow-md border bg-background text-foreground hover:bg-muted" 
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
