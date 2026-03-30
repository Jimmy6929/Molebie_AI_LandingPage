"use client";

import { motion, useReducedMotion } from "framer-motion";
import { OsTabs } from "./ui/os-tabs";
import { WaitlistForm } from "./ui/waitlist-form";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Content — above global geometric background */}
      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 w-full py-28 lg:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <motion.div
            className="lg:col-span-6 xl:col-span-5 bg-accent-yellow p-6 md:p-10 lg:p-12"
            initial={animate ? { opacity: 0, x: -30 } : undefined}
            animate={animate ? { opacity: 1, x: 0 } : undefined}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.9] mb-6 text-base-black"
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              Your AI.
              <br />
              Self-hosted.
              <br />
              Private.
            </motion.h1>

            <motion.p
              className="max-w-md text-base md:text-lg text-base-black/60 leading-relaxed mb-8"
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              Voice conversation, vision, document memory, and web search
              &mdash; running on your hardware. No cloud. No data leaves your
              machine.
            </motion.p>

            <motion.div
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <OsTabs inverted />
            </motion.div>

            <motion.div
              id="updates"
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.45 }}
              className="mt-8 pt-6 border-t-2 border-base-black/20"
            >
              <p className="text-base-black/60 text-sm font-bold uppercase tracking-widest mb-3">
                Get the latest updates
              </p>
              <WaitlistForm source="hero" inverted />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
