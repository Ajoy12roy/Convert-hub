"use client";

import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import ConversionPill from "./ConversionPill";

interface InfiniteScrollerProps {
  items: { from: string; to: string }[];
  speed?: number;
  direction?: "left-to-right" | "right-to-left";
}

export default function InfiniteScroller({ 
  items, 
  speed = 40, 
  direction = "right-to-left" 
}: InfiniteScrollerProps) {
  const duplicatedItems = [...items, ...items];
  const controls = useAnimation(); // অ্যানিমেশন কন্ট্রোল করার জন্য

  // অ্যানিমেশন শুরু করার ফাংশন
  const startAnimation = () => {
    controls.start({
      x: direction === "right-to-left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        ease: "linear",
        duration: speed,
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <div className="relative w-full overflow-hidden py-2">
      {/* Side Fades */}
      <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-slate-50/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-slate-50/50 to-transparent pointer-events-none" />

      <motion.div
        className="flex w-fit gap-4"
        animate={controls}
        // যখন মাউস উপরে আসবে তখন থেমে যাবে
        onMouseEnter={() => controls.stop()}
        // যখন মাউস সরে যাবে তখন আবার শুরু হবে
        onMouseLeave={() => startAnimation()}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="shrink-0">
            <ConversionPill from={item.from} to={item.to} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}