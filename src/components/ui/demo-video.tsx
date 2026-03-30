"use client";

import { useRef, useEffect, useState, useCallback } from "react";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ExpandedPlayer({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }, []);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const v = videoRef.current;
      const bar = progressRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      v.currentTime = ratio * v.duration;
    },
    []
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[10000] bg-base-black/95 flex flex-col">
      {/* Close button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-base-black transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Video */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4 cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          className="max-w-full max-h-full"
          playsInline
          muted
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={() => {
            if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) setDuration(videoRef.current.duration);
          }}
        />

        {/* Pause overlay */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-accent-yellow flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#0A0A0A">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="px-4 pb-6">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-3 bg-bg-white/10 cursor-pointer mb-3"
          onClick={handleProgressClick}
        >
          <div className="h-full bg-accent-yellow" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="text-accent-yellow hover:text-bg-white transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            )}
          </button>

          <span className="text-bg-white/60 font-mono text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            onClick={onClose}
            className="text-bg-white/40 hover:text-accent-yellow transition-colors font-mono text-xs uppercase tracking-widest"
          >
            Esc to close
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoVideo({
  src,
  poster,
  caption,
  width = 1280,
  height = 720,
  placeholder = false,
  loopOnly = false,
}: {
  src?: string;
  poster?: string;
  caption?: string;
  width?: number;
  height?: number;
  placeholder?: boolean;
  loopOnly?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  // Derive poster path from src if not provided (e.g. /videos/foo.mp4 -> /videos/foo-poster.jpg)
  const derivedPoster =
    poster || (src ? src.replace(/\.mp4$/, "-poster.jpg") : undefined);

  // Lazy load on scroll
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

  // Autoplay muted when visible — wait for video data to be ready
  useEffect(() => {
    const video = videoRef.current;
    if (!visible || !video) return;

    const attemptPlay = () => {
      video.play().catch((err) => {
        if (err.name === "NotAllowedError" || err.name === "AbortError") {
          setNeedsTap(true);
        }
      });
    };

    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener("loadeddata", attemptPlay, { once: true });
      return () => video.removeEventListener("loadeddata", attemptPlay);
    }
  }, [visible]);

  const handleTapToPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    setNeedsTap(false);
  };

  const aspectRatio = `${width} / ${height}`;

  return (
    <div ref={containerRef}>
      <div className="bg-accent-yellow p-[3px]">
        <div className="bg-base-black relative">
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
          ) : loopOnly ? (
            <div className="relative">
              <video
                ref={videoRef}
                src={visible ? src : undefined}
                poster={derivedPoster}
                width={width}
                height={height}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-auto block"
              />
              {needsTap && (
                <button
                  onClick={handleTapToPlay}
                  className="absolute inset-0 flex items-center justify-center bg-base-black/40"
                  aria-label="Tap to play"
                >
                  <div className="w-16 h-16 bg-accent-yellow flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A0A0A">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </div>
                </button>
              )}
            </div>
          ) : (
            <div
              className="relative cursor-pointer group"
              onClick={() => {
                if (needsTap) {
                  handleTapToPlay();
                } else {
                  setExpanded(true);
                }
              }}
            >
              <video
                ref={videoRef}
                src={visible ? src : undefined}
                poster={derivedPoster}
                width={width}
                height={height}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-auto block"
              />

              {needsTap ? (
                <div className="absolute inset-0 flex items-center justify-center bg-base-black/40">
                  <div className="w-16 h-16 bg-accent-yellow flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#0A0A0A">
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-base-black/0 group-hover:bg-base-black/30 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-accent-yellow px-4 py-2 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5">
                      <polyline points="15 3 21 3 21 9" />
                      <polyline points="9 21 3 21 3 15" />
                      <line x1="21" y1="3" x2="14" y2="10" />
                      <line x1="3" y1="21" x2="10" y2="14" />
                    </svg>
                    <span className="text-base-black font-bold text-xs uppercase tracking-widest">
                      Click to expand
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {caption && (
        <p className="mt-2 text-bg-white/60 font-mono text-xs uppercase tracking-widest">
          {caption}
        </p>
      )}

      {/* Expanded fullscreen player */}
      {expanded && src && (
        <ExpandedPlayer src={src} onClose={() => setExpanded(false)} />
      )}
    </div>
  );
}
