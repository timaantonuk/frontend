'use client';

import type React from 'react';
import { useState, useCallback, type ReactNode } from 'react';

type SwipeDetectorProps = {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
  disabled?: boolean;
};

export function SwipeDetector({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disabled = false,
}: SwipeDetectorProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    },
    [disabled]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || touchStart === null) return;
      setTouchEnd(e.targetTouches[0].clientX);
    },
    [disabled, touchStart]
  );

  const handleTouchEnd = useCallback(() => {
    if (disabled || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > threshold) {
      if (distance > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [disabled, touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight]);

  // Mouse handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      setMouseStart(e.clientX);
      setIsDragging(true);
    },
    [disabled]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !isDragging || mouseStart === null) return;

      const distance = mouseStart - e.clientX;

      // Trigger swipe if threshold is met during movement
      if (Math.abs(distance) > threshold * 1.5) {
        if (distance > 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }

        // Reset to prevent multiple triggers
        setIsDragging(false);
        setMouseStart(null);
      }
    },
    [disabled, isDragging, mouseStart, threshold, onSwipeLeft, onSwipeRight]
  );

  const handleMouseUp = useCallback(() => {
    if (disabled) return;
    setIsDragging(false);
    setMouseStart(null);
  }, [disabled]);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}
