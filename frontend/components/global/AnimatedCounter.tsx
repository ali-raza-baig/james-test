"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / (duration * 1000),
        1
      );

      setCount(Math.floor(progress * value));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="text-ivory!"
    >
      {count}
      {suffix}
    </motion.span>
  );
};

export default AnimatedCounter;