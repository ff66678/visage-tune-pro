import { useRef, useCallback, forwardRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface SwipeBackProps {
  children: ReactNode;
  edgeWidth?: number;
  className?: string;
}

const SwipeBack = forwardRef<HTMLDivElement, SwipeBackProps>(({ children, edgeWidth = 30, className = "" }, _ref) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isSwiping = useRef(false);
  const rafId = useRef(0);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch.clientX <= edgeWidth) {
      isSwiping.current = true;
      startX.current = touch.clientX;
      currentX.current = 0;
      if (containerRef.current) {
        containerRef.current.style.transition = "none";
        containerRef.current.style.willChange = "transform, opacity";
      }
    }
  }, [edgeWidth]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const x = e.touches[0].clientX;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const deltaX = Math.max(0, x - startX.current);
      currentX.current = deltaX;
      const opacity = 1 - (deltaX / window.innerWidth) * 0.4;
      containerRef.current.style.transform = `translate3d(${deltaX}px, 0, 0)`;
      containerRef.current.style.opacity = `${Math.max(0.6, opacity)}`;
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!isSwiping.current || !containerRef.current) return;
    isSwiping.current = false;
    cancelAnimationFrame(rafId.current);
    const threshold = window.innerWidth / 3;

    if (currentX.current > threshold) {
      containerRef.current.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
      containerRef.current.style.transform = `translate3d(${window.innerWidth}px, 0, 0)`;
      containerRef.current.style.opacity = "0";
      setTimeout(() => navigate(-1), 180);
    } else {
      containerRef.current.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
      containerRef.current.style.transform = "translate3d(0, 0, 0)";
      containerRef.current.style.opacity = "1";
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.willChange = "auto";
        }
      }, 260);
    }
  }, [navigate]);

  return (
    <div
      ref={containerRef}
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {children}
    </div>
  );
};

export default SwipeBack;
