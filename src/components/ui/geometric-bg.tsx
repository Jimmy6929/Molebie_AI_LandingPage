"use client";

import { motion, useReducedMotion } from "framer-motion";

function Shape({
  children,
  delay,
  animate,
  style,
  floatDuration,
  floatDistance = 6,
}: {
  children?: React.ReactNode;
  delay: number;
  animate: boolean;
  style?: React.CSSProperties;
  floatDuration?: number;
  floatDistance?: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={style}
      initial={animate ? { opacity: 0, scale: 0.7 } : undefined}
      whileInView={
        animate
          ? {
              opacity: 1,
              scale: 1,
              ...(floatDuration ? { y: [0, -floatDistance, 0] } : {}),
            }
          : undefined
      }
      viewport={{ once: true, amount: 0 }}
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

/* A self-contained cluster of shapes for one "zone" (one screen height) */
function ShapeZone({
  animate,
  offsetTop,
  seed,
}: {
  animate: boolean;
  offsetTop: string; // e.g. "0vh", "100vh", "200vh"
  seed: number; // varies the shapes per zone
}) {
  // Use seed to pick different shapes per zone
  const s = seed % 6;
  return (
    <div className="absolute left-0 right-0 pointer-events-none" style={{ top: offsetTop, height: "100vh" }}>

      {/* Right side shapes — every zone gets these */}
      <Shape delay={0.2} animate={animate} floatDuration={4.5 + s * 0.3} floatDistance={4}
        style={{ top: "8%", right: "0%", width: 120 + s * 10, height: 140 + s * 10 }}>
        <svg width={120 + s * 10} height={140 + s * 10} viewBox={`0 0 ${120 + s * 10} ${140 + s * 10}`}>
          <defs>
            <pattern id={`zd-${seed}`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform={`rotate(${45 + s * 10})`}>
              <rect width="6" height="12" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width={120 + s * 10} height={140 + s * 10} fill={`url(#zd-${seed})`} />
        </svg>
      </Shape>

      <Shape delay={0.3} animate={animate} floatDuration={5.2 - s * 0.2}
        style={{ top: `${15 + s * 3}%`, right: `${10 + s * 2}%`, width: 120 + s * 15, height: 120 + s * 15 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>

      <Shape delay={0.25} animate={animate} floatDuration={4.0 + s * 0.2}
        style={{ top: `${10 + s * 2}%`, right: `${32 + s * 3}%`, width: 40 + s * 5, height: 200 + s * 20 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      <Shape delay={0.35} animate={animate} floatDuration={4.8} floatDistance={3}
        style={{ top: `${50 + s * 2}%`, right: "0%", width: 150, height: 40 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      {/* Dots */}
      <Shape delay={0.4} animate={animate}
        style={{ top: `${12 + s * 4}%`, right: `${28 + s}%`, width: 50, height: 50 }}>
        <svg width="50" height="50" viewBox="0 0 50 50" fill="#FFCC00">
          <circle cx="8" cy="8" r="5" /><circle cx="25" cy="8" r="5" /><circle cx="42" cy="8" r="5" />
          <circle cx="8" cy="25" r="5" /><circle cx="25" cy="25" r="5" /><circle cx="42" cy="25" r="5" />
        </svg>
      </Shape>

      {/* Outline ring */}
      <Shape delay={0.28} animate={animate} floatDuration={5.0} floatDistance={5}
        style={{ top: `${8 + s * 5}%`, right: `${20 + s * 2}%`, width: 70, height: 70 }}>
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r="30" fill="none" stroke="#FFCC00" strokeWidth="3" />
        </svg>
      </Shape>

      {/* Arrow */}
      <Shape delay={0.45} animate={animate} floatDuration={3.8} floatDistance={5}
        style={{ top: `${55 + s * 3}%`, right: `${5 + s * 3}%`, width: 60, height: 40 }}>
        <svg width="60" height="40" viewBox="0 0 60 40" fill="#FFCC00">
          <polygon points="0,9 38,9 38,0 60,20 38,40 38,31 0,31" />
        </svg>
      </Shape>

      {/* Plus */}
      <Shape delay={0.44} animate={animate}
        style={{ top: `${58 + s}%`, right: `${30 + s * 2}%`, width: 28, height: 28 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="#FFCC00">
          <rect x="10" y="0" width="8" height="28" />
          <rect x="0" y="10" width="28" height="8" />
        </svg>
      </Shape>

      {/* Small square */}
      <Shape delay={0.48} animate={animate} floatDuration={3.2 + s * 0.3}
        style={{ top: `${65 + s * 2}%`, right: `${22 + s}%`, width: 40, height: 40 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      {/* Left side shapes */}
      <Shape delay={0.5} animate={animate}
        style={{ top: `${10 + s * 3}%`, left: "2%", width: 40, height: 40 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="#FFCC00">
          <circle cx="8" cy="8" r="4" /><circle cx="24" cy="8" r="4" />
          <circle cx="8" cy="24" r="4" /><circle cx="24" cy="24" r="4" />
        </svg>
      </Shape>

      <Shape delay={0.55} animate={animate} floatDuration={5.5}
        style={{ top: `${18 + s * 4}%`, left: "3%", width: 50, height: 50 }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="22" fill="none" stroke="#FFCC00" strokeWidth="2.5" />
        </svg>
      </Shape>

      <Shape delay={0.52} animate={animate} floatDuration={3.8}
        style={{ top: `${30 + s * 2}%`, left: "0%", width: 14, height: 100 + s * 15 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      <Shape delay={0.58} animate={animate} floatDuration={4.5} floatDistance={4}
        style={{ top: `${48 + s * 3}%`, left: "2%", width: 35, height: 25 }}>
        <svg width="35" height="25" viewBox="0 0 35 25" fill="#FFCC00">
          <polygon points="0,7 22,7 22,0 35,12 22,25 22,18 0,18" />
        </svg>
      </Shape>

      <Shape delay={0.6} animate={animate} floatDuration={4.0}
        style={{ top: `${60 + s * 2}%`, left: "4%", width: 35, height: 35 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>

      {/* Bottom corner shapes — alternate between left/right */}
      {s % 2 === 0 ? (
        <Shape delay={0.42} animate={animate} floatDuration={6.0}
          style={{ bottom: "2%", right: "0%", width: 100, height: 100 }}>
          <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "100px 0 0 0" }} />
        </Shape>
      ) : (
        <Shape delay={0.42} animate={animate} floatDuration={6.0}
          style={{ bottom: "2%", left: "0%", width: 100, height: 100 }}>
          <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "0 100px 0 0" }} />
        </Shape>
      )}

      {/* Diagonal stripes — alternate side */}
      <Shape delay={0.38} animate={animate} floatDuration={4.8}
        style={{ bottom: `${10 + s * 2}%`, [s % 2 === 0 ? "left" : "right"]: "0%", width: 70, height: 90 }}>
        <svg width="70" height="90" viewBox="0 0 70 90">
          <defs>
            <pattern id={`zds-${seed}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <rect width="5" height="10" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="70" height="90" fill={`url(#zds-${seed})`} />
        </svg>
      </Shape>

      {/* Horizontal stripes bar */}
      <Shape delay={0.36} animate={animate} floatDuration={5.5} floatDistance={4}
        style={{ bottom: `${5 + s}%`, right: `${10 + s * 3}%`, width: 140, height: 25 }}>
        <svg width="140" height="25" viewBox="0 0 140 25">
          <defs>
            <pattern id={`zhs-${seed}`} width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="5" height="10" fill="#FFCC00" />
            </pattern>
          </defs>
          <rect width="140" height="25" fill={`url(#zhs-${seed})`} />
        </svg>
      </Shape>

      {/* Center shapes */}
      <Shape delay={0.46} animate={animate} floatDuration={4.2} floatDistance={7}
        style={{ top: `${40 + s * 3}%`, left: `${45 + s}%`, width: 55, height: 55 }}>
        <div className="w-full h-full bg-accent-yellow" style={{ borderRadius: "50%" }} />
      </Shape>

      <Shape delay={0.43} animate={animate}
        style={{ top: `${25 + s * 4}%`, left: `${48 + s}%`, width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <line x1="0" y1={s % 2 === 0 ? "120" : "0"} x2="120" y2={s % 2 === 0 ? "0" : "120"} stroke="#FFCC00" strokeWidth="2.5" />
        </svg>
      </Shape>

      <Shape delay={0.47} animate={animate} floatDuration={3.5}
        style={{ top: `${35 + s * 2}%`, left: `${52 + s}%`, width: 16, height: 120 }}>
        <div className="w-full h-full bg-accent-yellow" />
      </Shape>
    </div>
  );
}

export function GeometricBackground() {
  const shouldReduceMotion = useReducedMotion();
  const a = !shouldReduceMotion;

  // 10 zones — covers all sections across the full page
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <ShapeZone animate={a} offsetTop="0vh" seed={0} />
      <ShapeZone animate={a} offsetTop="100vh" seed={1} />
      <ShapeZone animate={a} offsetTop="200vh" seed={2} />
      <ShapeZone animate={a} offsetTop="300vh" seed={3} />
      <ShapeZone animate={a} offsetTop="400vh" seed={4} />
      <ShapeZone animate={a} offsetTop="500vh" seed={5} />
      <ShapeZone animate={a} offsetTop="600vh" seed={0} />
      <ShapeZone animate={a} offsetTop="700vh" seed={1} />
      <ShapeZone animate={a} offsetTop="800vh" seed={2} />
      <ShapeZone animate={a} offsetTop="900vh" seed={3} />
    </div>
  );
}
