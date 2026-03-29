"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import mermaid from "mermaid";

const SWISS_THEME = {
  theme: "base" as const,
  themeVariables: {
    primaryColor: "#0A0A0A",
    primaryBorderColor: "#FFCC00",
    primaryTextColor: "#FFFFFF",
    secondaryColor: "#111111",
    secondaryBorderColor: "#FFCC00",
    secondaryTextColor: "#FFFFFF",
    tertiaryColor: "#0A0A0A",
    tertiaryBorderColor: "#FFCC00",
    tertiaryTextColor: "#FFFFFF",
    lineColor: "#FFCC00",
    textColor: "#FFFFFF",
    mainBkg: "#0A0A0A",
    nodeBorder: "#FFCC00",
    clusterBkg: "#111111",
    clusterBorder: "#FFCC00",
    titleColor: "#FFFFFF",
    edgeLabelBackground: "#0A0A0A",
    nodeTextColor: "#FFFFFF",
    actorBkg: "#0A0A0A",
    actorBorder: "#FFCC00",
    actorTextColor: "#FFFFFF",
    actorLineColor: "#FFCC00",
    signalColor: "#FFFFFF",
    signalTextColor: "#FFFFFF",
    labelBoxBkgColor: "#0A0A0A",
    labelBoxBorderColor: "#FFCC00",
    labelTextColor: "#FFFFFF",
    loopTextColor: "#FFCC00",
    noteBkgColor: "#111111",
    noteBorderColor: "#FFCC00",
    noteTextColor: "#FFFFFF",
    activationBkgColor: "#111111",
    activationBorderColor: "#FFCC00",
    sequenceNumberColor: "#0A0A0A",
    entityBkg: "#0A0A0A",
    entityBorder: "#FFCC00",
    entityTextColor: "#FFFFFF",
    relationColor: "#FFCC00",
    attributeBackgroundColorEven: "#0A0A0A",
    attributeBackgroundColorOdd: "#111111",
    cScale0: "#FFCC00",
    cScale1: "#FFFFFF",
  },
  flowchart: {
    curve: "basis" as const,
    htmlLabels: true,
    nodeSpacing: 50,
    rankSpacing: 60,
  },
  sequence: {
    mirrorActors: false,
    actorMargin: 80,
    messageMargin: 40,
  },
  er: {
    useMaxWidth: true,
  },
};

let initialized = false;

const MIN_SCALE = 0.3;
const MAX_SCALE = 4;
const ZOOM_STEP = 0.15;

function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  onExpand,
  expanded,
}: {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onExpand: () => void;
  expanded: boolean;
}) {
  return (
    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
      <span className="text-xs font-mono text-bg-white/40 mr-2">
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={onZoomOut}
        className="w-8 h-8 flex items-center justify-center border border-accent-yellow/40 bg-base-black text-accent-yellow hover:bg-accent-yellow hover:text-base-black transition-colors"
        aria-label="Zoom out"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={onReset}
        className="h-8 px-2 flex items-center justify-center border border-accent-yellow/40 bg-base-black text-accent-yellow hover:bg-accent-yellow hover:text-base-black transition-colors text-xs font-mono"
        aria-label="Reset zoom"
      >
        Fit
      </button>
      <button
        onClick={onZoomIn}
        className="w-8 h-8 flex items-center justify-center border border-accent-yellow/40 bg-base-black text-accent-yellow hover:bg-accent-yellow hover:text-base-black transition-colors"
        aria-label="Zoom in"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <button
        onClick={onExpand}
        className="w-8 h-8 flex items-center justify-center border border-accent-yellow/40 bg-base-black text-accent-yellow hover:bg-accent-yellow hover:text-base-black transition-colors ml-1"
        aria-label={expanded ? "Close fullscreen" : "Expand fullscreen"}
      >
        {expanded ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="4 14 10 14 10 20" />
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" y1="10" x2="21" y2="3" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>
    </div>
  );
}

function DiagramViewer({
  svg,
  expanded,
  onToggleExpand,
}: {
  svg: string;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ active: false, startX: 0, startY: 0, startTx: 0, startTy: 0 });

  // Reset transform when toggling expand
  useEffect(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, [expanded]);

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const handleZoomIn = useCallback(() => {
    setScale((prev) => clampScale(prev + ZOOM_STEP));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => clampScale(prev - ZOOM_STEP));
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  // Wheel zoom — zoom toward cursor position
  const handleWheel = useCallback(
    (e: ReactWheelEvent) => {
      e.preventDefault();
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      const newScale = clampScale(scale + delta);
      const ratio = newScale / scale;

      setTranslate((prev) => ({
        x: cursorX - ratio * (cursorX - prev.x),
        y: cursorY - ratio * (cursorY - prev.y),
      }));
      setScale(newScale);
    },
    [scale]
  );

  // Pointer drag for panning
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (e.button !== 0) return;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startTx: translate.x,
        startTy: translate.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [translate]
  );

  const handlePointerMove = useCallback((e: ReactPointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setTranslate({
      x: dragRef.current.startTx + dx,
      y: dragRef.current.startTy + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  const containerClass = expanded
    ? "fixed inset-0 z-[100] bg-base-black border-0"
    : "border-2 border-accent-yellow bg-base-black relative";

  const viewportHeight = expanded ? "h-full" : "h-[500px]";

  return (
    <div className={containerClass}>
      <ZoomControls
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onExpand={onToggleExpand}
        expanded={expanded}
      />

      {/* Hint text */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
        <span className="text-xs font-mono text-bg-white/30">
          Scroll to zoom / Drag to pan
        </span>
      </div>

      {expanded && (
        <div className="absolute top-3 left-3 z-10">
          <span className="text-sm font-black uppercase tracking-widest text-accent-yellow">
            Fullscreen
          </span>
        </div>
      )}

      <div
        ref={viewportRef}
        className={`${viewportHeight} overflow-hidden cursor-grab active:cursor-grabbing select-none`}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={contentRef}
          className="origin-top-left [&_svg]:max-w-none [&_svg]:h-auto p-6"
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            willChange: "transform",
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}

export function MermaidDiagram({
  chart,
  id,
}: {
  chart: string;
  id: string;
}) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        ...SWISS_THEME,
      });
      initialized = true;
    }

    const renderDiagram = async () => {
      try {
        const uniqueId = `mermaid-${id}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
        setSvg(renderedSvg);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart, id]);

  // Close fullscreen on Escape key
  useEffect(() => {
    if (!expanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll when expanded
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [expanded]);

  if (error) {
    return (
      <div className="border-2 border-accent-yellow bg-base-black p-6">
        <p className="text-bg-white/60 font-mono text-sm">
          Diagram rendering error: {error}
        </p>
        <pre className="mt-4 text-accent-yellow text-xs overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="border-2 border-accent-yellow bg-base-black p-6 h-[200px] flex items-center justify-center">
        <span className="text-bg-white/40 font-mono text-sm">Loading diagram...</span>
      </div>
    );
  }

  return (
    <DiagramViewer
      svg={svg}
      expanded={expanded}
      onToggleExpand={() => setExpanded(!expanded)}
    />
  );
}
