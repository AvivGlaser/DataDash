import { useEffect, useRef, useState } from 'react';

const ANIMATION_MS = 700;

/** Returns a number that glides toward `value` whenever it changes. */
export function useAnimatedNumber(value: number | null): number | null {
  const [displayedValue, setDisplayedValue] = useState(value);
  const previousValueRef = useRef(value === null ? null : 0);

  useEffect(() => {
    const prefersNoMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (value === null || previousValueRef.current === null || prefersNoMotion) {
      previousValueRef.current = value;
      setDisplayedValue(value);
      return;
    }

    const startTime = performance.now();
    const startValue = previousValueRef.current;
    let animationFrame = 0;

    const animate = (currentTime: number) => {
      const progress = Math.min(1, (currentTime - startTime) / ANIMATION_MS);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = startValue + (value - startValue) * easedProgress;
      previousValueRef.current = nextValue;
      setDisplayedValue(progress === 1 ? value : nextValue);
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return displayedValue;
}
