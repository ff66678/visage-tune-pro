import { useRef, useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface SwipeBackProps {
  children: ReactNode;
  edgeWidth?: number;
  className?: string;
}

const SwipeBack = ({ children, edgeWidth = 30, className = "" }: SwipeBackProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= edgeWidth) {
      isSwiping.current = true;
      startX.current = touch.clientX;
      currentX.current = 0;
      if (containerRef.current) {
        containerRef.current.style.transition = "none";
      }
    }
  }, [edgeWidth]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current || !containerRef.current) return;
    const deltaX = Math.max(0, e.touches[0].clientX - startX.current);
    currentX.current = deltaX;
    const opacity = 1 - deltaX / window.innerWidth * 0.4;
    containerRef.current.style.transform = `translateX(${deltaX}px)`;
    containerRef.current.style.opacity = `${Math.max(0.6, opacity)}`;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isSwiping.current || !containerRef.current) return;
    isSwiping.current = false;
    const threshold = window.innerWidth / 3;

    if (currentX.current > threshold) {
      // Complete the swipe: animate off-screen then navigate
      containerRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      containerRef.current.style.transform = `translateX(${window.innerWidth}px)`;
      containerRef.current.style.opacity = "0";
      setTimeout(() => navigate(-1), 180);
    } else {
      // Snap back
      containerRef.current.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
      containerRef.current.style.transform = "translateX(0)";
      containerRef.current.style.opacity = "1";
    }
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
};

export default SwipeBack;
