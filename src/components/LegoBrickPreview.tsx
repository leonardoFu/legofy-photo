"use client";

import { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface LegoBrickPreviewProps {
  brickWidth: number;
  brickHeight: number;
  className?: string;
}

export function LegoBrickPreview({
  brickWidth,
  brickHeight,
  className,
}: LegoBrickPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate semi-random but visually appealing pattern
  const brickColors = useMemo(() => {
    const colors = [
      'bg-red-300', 'bg-blue-300', 'bg-green-300', 
      'bg-yellow-200', 'bg-purple-300', 'bg-pink-300',
      'bg-orange-200', 'bg-teal-300', 'bg-cyan-300'
    ];
    
    const pattern = [];
    const total = brickWidth * brickHeight;
    
    // Create a more pleasing pattern rather than pure randomness
    for (let i = 0; i < total; i++) {
      // Use position to influence color selection for a more consistent pattern
      const row = Math.floor(i / brickWidth);
      const col = i % brickWidth;
      
      // Create clusters of similar colors
      const clusterSize = 3;
      const clusterX = Math.floor(col / clusterSize);
      const clusterY = Math.floor(row / clusterSize);
      const clusterIndex = (clusterY * Math.ceil(brickWidth / clusterSize) + clusterX) % colors.length;
      
      // Add some variation
      const variation = (row + col) % 3;
      const colorIndex = (clusterIndex + variation) % colors.length;
      
      pattern.push(colors[colorIndex]);
    }
    
    return pattern;
  }, [brickWidth, brickHeight]);
  
  return (
    <div 
      ref={containerRef}
      className={cn("w-full", className)}
    >
      <div className="mt-2 mb-1 text-xs text-gray-500 text-center">
        Preview: {brickWidth}×{brickHeight} bricks
      </div>
      
      <div 
        className="w-full max-w-[240px] mx-auto border border-gray-300 rounded shadow-sm overflow-hidden bg-gray-100"
        style={{
          // Overall container aspect ratio matches the grid dimensions
          aspectRatio: (brickWidth / brickHeight).toString(),
          display: 'grid',
          gridTemplateColumns: `repeat(${brickWidth}, 1fr)`,
          gridTemplateRows: `repeat(${brickHeight}, 1fr)`,
          gap: '1px'
        }}
      >
        {brickWidth > 0 && brickHeight > 0 && 
          Array(brickHeight * brickWidth).fill(0).map((_, i) => {
            const row = Math.floor(i / brickWidth);
            const col = i % brickWidth;
            
            return (
              <div
                key={i}
                className={cn(
                  'relative',
                  brickColors[i]
                )}
                style={{
                  // Each brick is a perfect 1:1 square
                  aspectRatio: '1/1',
                  gridRow: `${row + 1} / span 1`,
                  gridColumn: `${col + 1} / span 1`,
                }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full bg-white/40"></div>
              </div>
            );
          })
        }
      </div>
      <div className="mt-2 text-xs italic text-gray-400 text-center">
        Brick size: {brickWidth}×{brickHeight}px
        {" • "}
        {brickWidth <= 20 ? "High detail" : brickWidth >= 40 ? "Low detail" : "Medium detail"}
      </div>
    </div>
  );
} 