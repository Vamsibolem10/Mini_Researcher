"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const bounceTransition = {
  y: {
    duration: 0.6,
    yoyo: Infinity,
    ease: "easeInOut",
  },
};

export function LoadingIndicator({ isLoading }: LoadingIndicatorProps) {
  if (!isLoading) return null;

  return (
    <div className="mt-8 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-3 w-3 rounded-full bg-primary"
              animate={{ y: ["0%", "-50%", "0%"] }}
              transition={{
                ...bounceTransition,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center font-medium">
          Researching your query... Please wait a moment
        </p>
      </div>
    </div>
  );
}
