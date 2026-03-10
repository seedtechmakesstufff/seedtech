
"use client";

import { useEffect, useState, useRef } from 'react';

type AnimatedCounterProps = {
  value: number;
  className?: string;
  prefix?: string;
  decimals?: number;
};

const DURATION = 800; // Animation duration in ms

export function AnimatedCounter({ value, className, prefix = "", decimals = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValueRef = useRef(0);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / DURATION, 1);
      
      const newDisplayValue = startValue + (endValue - startValue) * (1 - Math.pow(1 - progress, 3)); // Ease-out cubic
      setDisplayValue(newDisplayValue);

      if (elapsedTime < DURATION) {
        animationFrameId.current = requestAnimationFrame(animation);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(animation);
    
    return () => {
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        prevValueRef.current = value;
    }

  }, [value]);

  useEffect(() => {
    setDisplayValue(value);
    prevValueRef.current = value;
  }, []);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}
