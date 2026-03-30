"use client";

import { useRef, useEffect, useState } from "react";

export function DemoVideo({
  src,
  poster,
  caption,
  width = 1280,
  height = 720,
  placeholder = false,
}: {
  src?: string;
  poster?: string;
  caption?: string;
  width?: number;
  height?: number;
  placeholder?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [visible]);

  const aspectRatio = `${width} / ${height}`;

  return (
    <div ref={containerRef}>
      <div className="bg-accent-yellow p-[3px]">
        <div className="bg-base-black">
          {placeholder || !src ? (
            <div
              className="w-full flex items-center justify-center"
              style={{ aspectRatio }}
            >
              <div className="text-center">
                <svg
                  className="mx-auto mb-3 text-accent-yellow"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="8,5 19,12 8,19" />
                </svg>
                <p className="text-bg-white/40 font-mono text-sm uppercase tracking-widest">
                  Demo Coming Soon
                </p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={visible ? src : undefined}
              poster={poster}
              width={width}
              height={height}
              muted
              loop
              playsInline
              preload="none"
              className="w-full h-auto block"
            />
          )}
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-bg-white/60 font-mono text-xs uppercase tracking-widest">
          {caption}
        </p>
      )}
    </div>
  );
}
