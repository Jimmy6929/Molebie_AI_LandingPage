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
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 w-full py-20 sm:py-28 lg:py-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <motion.div
            className="lg:col-span-6 xl:col-span-5 bg-accent-yellow p-4 sm:p-6 md:p-10 lg:p-12"
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

            {/* Product Hunt badge + card — mobile/tablet only, inside the card */}
            <motion.a
              href="https://www.producthunt.com/products/molebie-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-molebie-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Featured on Product Hunt"
              className="lg:hidden block w-fit mt-8"
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.55 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1117694&theme=light&t=1775560392081"
                alt="Molebie AI - Self-hosted AI assistant with voice, vision, RAG, and search | Product Hunt"
                width={320}
                height={69}
                className="w-[260px] sm:w-[300px] md:w-[320px] h-auto"
              />
            </motion.a>

            <motion.div
              className="lg:hidden mt-4 bg-white border border-gray-200 rounded-[2rem] p-5 w-full max-w-[400px] shadow-sm"
              initial={animate ? { opacity: 0 } : undefined}
              animate={animate ? { opacity: 1 } : undefined}
              transition={{ duration: 0.4, delay: 0.65 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://ph-files.imgix.net/f65401e9-1d9b-4e07-a4f0-d99d4438d7ec.png?auto=format&fit=crop&w=80&h=80"
                  alt="Molebie AI"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="m-0 text-lg font-semibold text-[#1a1a1a] leading-tight truncate">
                    Molebie AI
                  </h3>
                  <p className="mt-1 text-sm text-[#666] leading-snug line-clamp-2">
                    Self-hosted AI assistant with voice, vision, RAG, and
                    search
                  </p>
                </div>
              </div>
              <a
                href="https://www.producthunt.com/products/molebie-ai?embed=true&utm_source=embed&utm_medium=post_embed"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-[#FF6154] hover:bg-[#e85544] text-white no-underline rounded-lg text-sm font-semibold transition-colors"
              >
                Check it out on Product Hunt →
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Product Hunt badge + card — floating on the right over the background */}
        <div className="hidden lg:block absolute right-8 xl:right-16 top-1/2 -translate-y-1/2 z-10">
          <motion.div
            className="flex flex-col items-end gap-5"
            initial={animate ? { opacity: 0, x: 30 } : undefined}
            animate={
              animate
                ? { opacity: 1, x: 0, y: [0, -10, 0] }
                : undefined
            }
            transition={
              animate
                ? {
                    opacity: { duration: 0.5, delay: 0.6 },
                    x: { duration: 0.5, delay: 0.6 },
                    y: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.1,
                    },
                  }
                : undefined
            }
          >
            <motion.a
              href="https://www.producthunt.com/products/molebie-ai?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-molebie-ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Featured on Product Hunt"
              className="block"
              whileHover={{ scale: 1.05 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1117694&theme=light&t=1775560392081"
                alt="Molebie AI - Self-hosted AI assistant with voice, vision, RAG, and search | Product Hunt"
                width={440}
                height={95}
                className="w-[340px] xl:w-[400px] 2xl:w-[440px] h-auto drop-shadow-2xl"
              />
            </motion.a>

            <motion.div
              className="bg-white border border-gray-200 rounded-[2rem] p-5 w-[340px] xl:w-[400px] 2xl:w-[440px] shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://ph-files.imgix.net/f65401e9-1d9b-4e07-a4f0-d99d4438d7ec.png?auto=format&fit=crop&w=80&h=80"
                  alt="Molebie AI"
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="m-0 text-lg font-semibold text-[#1a1a1a] leading-tight truncate">
                    Molebie AI
                  </h3>
                  <p className="mt-1 text-sm text-[#666] leading-snug line-clamp-2">
                    Self-hosted AI assistant with voice, vision, RAG, and
                    search
                  </p>
                </div>
              </div>
              <a
                href="https://www.producthunt.com/products/molebie-ai?embed=true&utm_source=embed&utm_medium=post_embed"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 px-4 py-2 bg-[#FF6154] hover:bg-[#e85544] text-white no-underline rounded-lg text-sm font-semibold transition-colors"
              >
                Check it out on Product Hunt →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
