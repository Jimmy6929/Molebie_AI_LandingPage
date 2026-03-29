"use client";

import { motion, useReducedMotion } from "framer-motion";
import { OsTabs } from "./ui/os-tabs";

/* ------------------------------------------------------------------ */
/*  Reusable animated shape                                            */
/* ------------------------------------------------------------------ */
function Shape({
  children,
  delay,
  animate,
  className,
  style,
  floatDuration,
  floatDistance = 6,
}: {
  children?: React.ReactNode;
  delay: number;
  animate: boolean;
  className?: string;
  style?: React.CSSProperties;
  floatDuration?: number;
  floatDistance?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className ?? ""}`}
      style={style}
      initial={animate ? { opacity: 0, scale: 0.7 } : undefined}
      animate={
        animate
          ? {
              opacity: 1,
              scale: 1,
              ...(floatDuration ? { y: [0, -floatDistance, 0] } : {}),
            }
          : undefined
      }
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] },
        ...(floatDuration
          ? {
              y: {
                duration: floatDuration,
                delay: delay + 0.5,
                repeat: Infinity,
                repeatType: "mirror" as const,
                ease: "easeInOut",
              },
            }
          : {}),
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  All geometric shapes — spread across the full hero                 */
/*  Nothing above top: 12% to keep the nav bar clear                   */
/* ------------------------------------------------------------------ */
function GeometricBackground({ animate }: { animate: boolean }) {
  return (
    <div className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden">

      {/* === TOP-RIGHT cluster === */}
      {/* Diagonal stripes block */}
      <Shape delay={0.2} animate={animate} floatDuration={4.5} floatDistance={4}
        style={{ top: "12%", right: "0%", width: 150, height: 170 }}>
        <svg width="150" height="170" viewBox="0 0 150 170">
          <defs>
            <pattern id="diag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="12" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="150" height="170" fill="url(#diag)" />
        </svg>
      </Shape>
      {/* Large circle */}
      <Shape delay={0.3} animate={animate} floatDuration={5.2}
        style={{ top: "18%", right: "10%", width: 160, height: 160 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>
      {/* Tall bar */}
      <Shape delay={0.25} animate={animate} floatDuration={4.0}
        style={{ top: "14%", right: "35%", width: 50, height: 240 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Dots grid */}
      <Shape delay={0.5} animate={animate}
        style={{ top: "14%", right: "30%", width: 50, height: 50 }}>
        <svg width="50" height="50" viewBox="0 0 50 50" fill="#FFCC00">
          <circle cx="8" cy="8" r="5" /><circle cx="25" cy="8" r="5" /><circle cx="42" cy="8" r="5" />
          <circle cx="8" cy="25" r="5" /><circle cx="25" cy="25" r="5" /><circle cx="42" cy="25" r="5" />
        </svg>
      </Shape>
      {/* Outline ring */}
      <Shape delay={0.28} animate={animate} floatDuration={5.0} floatDistance={5}
        style={{ top: "12%", right: "22%", width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="#FFCC00" strokeWidth="3" />
        </svg>
      </Shape>
      {/* Thin tall bar — far right */}
      <Shape delay={0.33} animate={animate} floatDuration={4.6}
        style={{ top: "22%", right: "0%", width: 28, height: 200 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Diagonal line */}
      <Shape delay={0.32} animate={animate}
        style={{ top: "28%", right: "6%", width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <line x1="0" y1="160" x2="160" y2="0" stroke="#FFCC00" strokeWidth="3" />
        </svg>
      </Shape>

      {/* === MID-RIGHT === */}
      {/* Wide rectangle */}
      <Shape delay={0.35} animate={animate} floatDuration={4.8} floatDistance={3}
        style={{ top: "50%", right: "0%", width: 180, height: 45 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Medium circle */}
      <Shape delay={0.48} animate={animate} floatDuration={4.2} floatDistance={8}
        style={{ top: "55%", right: "18%", width: 80, height: 80 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>
      {/* Arrow pointing right */}
      <Shape delay={0.45} animate={animate} floatDuration={3.8} floatDistance={5}
        style={{ top: "60%", right: "4%", width: 70, height: 45 }}>
        <svg width="70" height="45" viewBox="0 0 70 45" fill="#FFCC00">
          <polygon points="0,10 44,10 44,0 70,22 44,45 44,35 0,35" />
        </svg>
      </Shape>
      {/* Plus/cross */}
      <Shape delay={0.44} animate={animate}
        style={{ top: "58%", right: "32%", width: 28, height: 28 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="#FFCC00">
          <rect x="10" y="0" width="8" height="28" />
          <rect x="0" y="10" width="28" height="8" />
        </svg>
      </Shape>
      {/* Small square */}
      <Shape delay={0.52} animate={animate} floatDuration={3.2}
        style={{ top: "62%", right: "26%", width: 40, height: 40 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Medium square */}
      <Shape delay={0.46} animate={animate} floatDuration={4.4}
        style={{ top: "64%", right: "14%", width: 55, height: 55 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      {/* === BOTTOM-RIGHT === */}
      {/* Quarter circle */}
      <Shape delay={0.42} animate={animate} floatDuration={6.0}
        style={{ bottom: "3%", right: "0%", width: 130, height: 130 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "130px 0 0 0" }} />
      </Shape>
      {/* Horizontal stripes */}
      <Shape delay={0.36} animate={animate} floatDuration={5.5} floatDistance={4}
        style={{ bottom: "8%", right: "10%", width: 160, height: 30 }}>
        <svg width="160" height="30" viewBox="0 0 160 30">
          <defs>
            <pattern id="hstripe" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="5" height="10" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="160" height="30" fill="url(#hstripe)" />
        </svg>
      </Shape>
      {/* Half circle */}
      <Shape delay={0.4} animate={animate} floatDuration={5.8}
        style={{ bottom: "18%", right: "30%", width: 110, height: 55 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "55px 55px 0 0" }} />
      </Shape>

      {/* === CENTER (filling the gap) === */}
      {/* Large rectangle */}
      <Shape delay={0.38} animate={animate} floatDuration={4.0} floatDistance={4}
        style={{ top: "38%", left: "48%", width: 70, height: 120 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Thin vertical bar */}
      <Shape delay={0.43} animate={animate} floatDuration={3.5}
        style={{ top: "30%", left: "55%", width: 16, height: 150 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Diagonal line — center */}
      <Shape delay={0.47} animate={animate}
        style={{ top: "18%", left: "46%", width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <line x1="0" y1="0" x2="140" y2="140" stroke="#FFCC00" strokeWidth="2.5" />
        </svg>
      </Shape>
      {/* Horizontal striped block */}
      <Shape delay={0.51} animate={animate} floatDuration={3.8}
        style={{ top: "48%", left: "44%", width: 100, height: 35 }}>
        <svg width="100" height="35" viewBox="0 0 100 35">
          <defs>
            <pattern id="cstripe" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="100" height="35" fill="url(#cstripe)" />
        </svg>
      </Shape>
      {/* Circle — center */}
      <Shape delay={0.55} animate={animate} floatDuration={5.5} floatDistance={7}
        style={{ top: "60%", left: "48%", width: 65, height: 65 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>
      {/* Dots 3x3 */}
      <Shape delay={0.53} animate={animate}
        style={{ top: "22%", left: "52%", width: 36, height: 36 }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="#FFCC00">
          <circle cx="6" cy="6" r="4" /><circle cx="18" cy="6" r="4" /><circle cx="30" cy="6" r="4" />
          <circle cx="6" cy="18" r="4" /><circle cx="18" cy="18" r="4" /><circle cx="30" cy="18" r="4" />
          <circle cx="6" cy="30" r="4" /><circle cx="18" cy="30" r="4" /><circle cx="30" cy="30" r="4" />
        </svg>
      </Shape>
      {/* Arrow down */}
      <Shape delay={0.58} animate={animate} floatDuration={4.5}
        style={{ top: "72%", left: "50%", width: 36, height: 45 }}>
        <svg width="36" height="45" viewBox="0 0 36 45" fill="#FFCC00">
          <polygon points="7,0 29,0 29,28 36,28 18,45 0,28 7,28" />
        </svg>
      </Shape>
      {/* Small square */}
      <Shape delay={0.56} animate={animate} floatDuration={4.8}
        style={{ top: "76%", left: "53%", width: 28, height: 28 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Outline ring — center */}
      <Shape delay={0.6} animate={animate} floatDuration={5.2} floatDistance={4}
        style={{ bottom: "10%", left: "46%", width: 55, height: 55 }}>
        <svg width="55" height="55" viewBox="0 0 55 55">
          <circle cx="27.5" cy="27.5" r="24" fill="none" stroke="#FFCC00" strokeWidth="2.5" />
        </svg>
      </Shape>

      {/* === CENTER-BOTTOM (filling below the content box) === */}
      {/* Wide bar */}
      <Shape delay={0.49} animate={animate} floatDuration={4.2} floatDistance={3}
        style={{ bottom: "5%", left: "20%", width: 180, height: 18 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Rectangle */}
      <Shape delay={0.54} animate={animate} floatDuration={5.0}
        style={{ bottom: "12%", left: "30%", width: 60, height: 45 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Small circle */}
      <Shape delay={0.62} animate={animate} floatDuration={4.6} floatDistance={5}
        style={{ bottom: "18%", left: "22%", width: 40, height: 40 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>
      {/* Diagonal stripes block — center bottom */}
      <Shape delay={0.57} animate={animate} floatDuration={4.3}
        style={{ bottom: "2%", left: "38%", width: 80, height: 60 }}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <defs>
            <pattern id="diag3" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="5" height="10" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="80" height="60" fill="url(#diag3)" />
        </svg>
      </Shape>

      {/* === LEFT SIDE === */}
      {/* Small dots — upper left, pushed down */}
      <Shape delay={0.62} animate={animate}
        style={{ top: "14%", left: "2%", width: 40, height: 40 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="#FFCC00">
          <circle cx="8" cy="8" r="4" /><circle cx="24" cy="8" r="4" />
          <circle cx="8" cy="24" r="4" /><circle cx="24" cy="24" r="4" />
        </svg>
      </Shape>
      {/* Outline ring — left */}
      <Shape delay={0.72} animate={animate} floatDuration={5.5}
        style={{ top: "22%", left: "3%", width: 55, height: 55 }}>
        <svg width="55" height="55" viewBox="0 0 55 55">
          <circle cx="27.5" cy="27.5" r="23" fill="none" stroke="#FFCC00" strokeWidth="2.5" />
        </svg>
      </Shape>
      {/* Thin vertical bar — left edge */}
      <Shape delay={0.58} animate={animate} floatDuration={3.8}
        style={{ top: "30%", left: "0%", width: 14, height: 120 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Arrow — left */}
      <Shape delay={0.68} animate={animate} floatDuration={4.5} floatDistance={4}
        style={{ top: "52%", left: "2%", width: 35, height: 25 }}>
        <svg width="35" height="25" viewBox="0 0 35 25" fill="#FFCC00">
          <polygon points="0,7 22,7 22,0 35,12 22,25 22,18 0,18" />
        </svg>
      </Shape>
      {/* Diagonal stripes — bottom-left */}
      <Shape delay={0.7} animate={animate} floatDuration={4.8}
        style={{ bottom: "12%", left: "0%", width: 80, height: 100 }}>
        <svg width="80" height="100" viewBox="0 0 80 100">
          <defs>
            <pattern id="diag2" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width="5" height="10" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="80" height="100" fill="url(#diag2)" />
        </svg>
      </Shape>
      {/* Bottom-left quarter circle */}
      <Shape delay={0.6} animate={animate} floatDuration={5.0}
        style={{ bottom: "0%", left: "0%", width: 100, height: 100 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "0 100px 0 0" }} />
      </Shape>
      {/* Small circle — bottom */}
      <Shape delay={0.65} animate={animate} floatDuration={4.3} floatDistance={5}
        style={{ bottom: "8%", left: "10%", width: 45, height: 45 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>
      {/* Horizontal bar — bottom left */}
      <Shape delay={0.55} animate={animate} floatDuration={5.2} floatDistance={3}
        style={{ bottom: "3%", left: "8%", width: 120, height: 18 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
      {/* Square — left mid */}
      <Shape delay={0.64} animate={animate} floatDuration={4.0}
        style={{ top: "60%", left: "5%", width: 35, height: 35 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */
export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const animate = !shouldReduceMotion;

  return (
    <section
      className="relative bg-base-black min-h-screen flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Geometric background — behind content (z-0) */}
      <div className="absolute inset-0 z-0">
        <GeometricBackground animate={animate} />
      </div>

      {/* Content — above collages (z-10) */}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
