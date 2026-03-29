"use client";

import { motion, useReducedMotion } from "framer-motion";
import { OsTabs } from "./ui/os-tabs";

function SwissGrid() {
  return (
    <div className="hidden lg:block bg-accent-yellow p-[3px] h-full min-h-[480px]">
      <div className="grid grid-cols-3 grid-rows-5 gap-[3px] h-full">
        <div className="bg-base-black col-span-2 row-span-2" />
        <div className="bg-base-black row-span-3" />
        <div className="bg-base-black" />
        <div className="bg-base-black" />
        <div className="bg-base-black col-span-2 row-span-2" />
        <div className="bg-base-black" />
      </div>
    </div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;

  return (
    <section
      className="relative bg-base-black min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="relative max-w-7xl mx-auto px-6 w-full py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column — content */}
          <div className="lg:col-span-7">
            <motion.div
              className="h-[3px] w-24 bg-accent-yellow mb-8"
              initial={animate ? { opacity: 0, scaleX: 0 } : undefined}
              animate={animate ? { opacity: 1, scaleX: 1 } : undefined}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformOrigin: "left" }}
            />

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] mb-8"
              initial={animate ? { opacity: 0, y: 12 } : undefined}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="text-bg-white">Your AI. Self-hosted. </span>
              <span className="text-accent-yellow">Private.</span>
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg md:text-xl text-bg-white/60 leading-relaxed mb-12"
              initial={animate ? { opacity: 0, y: 12 } : undefined}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.4,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Voice conversation, vision, document memory, and web search
              &mdash; running on your hardware. No cloud. No data leaves your
              machine.
            </motion.p>

            <motion.div
              initial={animate ? { opacity: 0, y: 12 } : undefined}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <OsTabs />
            </motion.div>
          </div>

          {/* Right column — Swiss geometric pattern */}
          <div className="lg:col-span-5">
            <motion.div
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <SwissGrid />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
