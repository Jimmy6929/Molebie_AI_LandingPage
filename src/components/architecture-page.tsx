"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ARCHITECTURE_SECTIONS, SERVICE_TABLE } from "@/lib/architecture-data";
import { MermaidDiagram } from "./ui/mermaid-diagram";
import { AnimateIn } from "./ui/animate-in";

function SidebarNav({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="space-y-1">
      {ARCHITECTURE_SECTIONS.map((section) => (
        <button
          key={section.id}
          onClick={() => onNavigate(section.id)}
          className={`block w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
            activeId === section.id
              ? "bg-accent-yellow text-base-black font-bold"
              : "text-bg-white/60 hover:text-bg-white hover:bg-bg-white/5"
          }`}
        >
          <span className="text-accent-yellow mr-2">
            {activeId === section.id ? "" : section.number}
          </span>
          {activeId === section.id && (
            <span className="mr-2">{section.number}</span>
          )}
          {section.title}
        </button>
      ))}
      <button
        onClick={() => onNavigate("service-table")}
        className={`block w-full text-left px-4 py-2 text-sm font-mono transition-colors ${
          activeId === "service-table"
            ? "bg-accent-yellow text-base-black font-bold"
            : "text-bg-white/60 hover:text-bg-white hover:bg-bg-white/5"
        }`}
      >
        <span
          className={
            activeId === "service-table" ? "mr-2" : "text-accent-yellow mr-2"
          }
        >
          --
        </span>
        Service Summary
      </button>
    </nav>
  );
}

function MobileNav({
  activeId,
  onNavigate,
}: {
  activeId: string;
  onNavigate: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = ARCHITECTURE_SECTIONS.find((s) => s.id === activeId);

  return (
    <div className="lg:hidden sticky top-20 z-40 bg-base-black border-b-[3px] border-accent-yellow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-3 flex items-center justify-between text-left"
      >
        <span className="font-mono text-sm text-accent-yellow">
          {current ? `${current.number} — ${current.title}` : "Service Summary"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FFCC00"
          strokeWidth="2"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-accent-yellow/20 max-h-[50vh] overflow-y-auto">
          {ARCHITECTURE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onNavigate(section.id);
                setOpen(false);
              }}
              className={`block w-full text-left px-6 py-2 text-sm font-mono ${
                activeId === section.id
                  ? "bg-accent-yellow text-base-black font-bold"
                  : "text-bg-white/60"
              }`}
            >
              {section.number} — {section.title}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate("service-table");
              setOpen(false);
            }}
            className={`block w-full text-left px-6 py-2 text-sm font-mono ${
              activeId === "service-table"
                ? "bg-accent-yellow text-base-black font-bold"
                : "text-bg-white/60"
            }`}
          >
            Service Summary
          </button>
        </div>
      )}
    </div>
  );
}

function DiagramSectionBlock({ section }: { section: (typeof ARCHITECTURE_SECTIONS)[0] }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <AnimateIn>
        <div className="mb-8">
          <div className="h-[3px] w-full bg-accent-yellow mb-6" />
          <div className="flex items-baseline gap-4">
            <span className="text-5xl md:text-6xl lg:text-7xl font-black text-accent-yellow leading-none">
              {section.number}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-bg-white">
              {section.title}
            </h2>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.05}>
        <p className="text-bg-white/60 text-lg leading-relaxed mb-8 max-w-3xl">
          {section.description}
        </p>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <MermaidDiagram chart={section.diagram} id={section.id} />
      </AnimateIn>

      {section.details.length > 0 && (
        <AnimateIn delay={0.15}>
          <div className="mt-8 border-2 border-accent-yellow/30 bg-base-black p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-accent-yellow mb-4">
              Key Details
            </h3>
            <ul className="space-y-2">
              {section.details.map((detail, i) => (
                <li key={i} className="flex gap-3 text-bg-white/70 text-sm">
                  <span className="w-2 h-2 bg-accent-yellow flex-shrink-0 mt-1.5" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimateIn>
      )}
    </section>
  );
}

function ServiceTable() {
  return (
    <section id="service-table" className="scroll-mt-24">
      <AnimateIn>
        <div className="mb-8">
          <div className="h-[3px] w-full bg-accent-yellow mb-6" />
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-bg-white">
            Service Summary
          </h2>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="border-2 border-accent-yellow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent-yellow text-base-black">
                <th className="px-4 py-3 font-black text-sm uppercase tracking-widest">
                  Service
                </th>
                <th className="px-4 py-3 font-black text-sm uppercase tracking-widest">
                  Port
                </th>
                <th className="px-4 py-3 font-black text-sm uppercase tracking-widest hidden md:table-cell">
                  Framework
                </th>
                <th className="px-4 py-3 font-black text-sm uppercase tracking-widest">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {SERVICE_TABLE.map((row, i) => (
                <tr
                  key={row.service}
                  className={`border-t border-accent-yellow/20 ${
                    i % 2 === 0 ? "bg-base-black" : "bg-surface-dark"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-accent-yellow text-sm">
                    {row.service}
                  </td>
                  <td className="px-4 py-3 font-mono text-bg-white/80 text-sm">
                    {row.port}
                  </td>
                  <td className="px-4 py-3 font-mono text-bg-white/60 text-sm hidden md:table-cell">
                    {row.framework}
                  </td>
                  <td className="px-4 py-3 text-bg-white/70 text-sm">
                    {row.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <p className="mt-8 text-bg-white/50 text-sm max-w-3xl leading-relaxed">
          The gateway is the central orchestrator: it authenticates every request,
          manages sessions in SQLite, routes to inference tiers, enriches context
          with web search and RAG results, retrieves cross-session memories,
          handles voice transcription and synthesis, manages image attachments,
          and applies cost controls.
        </p>
      </AnimateIn>
    </section>
  );
}

export function ArchitecturePage() {
  const [activeId, setActiveId] = useState(ARCHITECTURE_SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-base-black min-h-screen">
      {/* Top nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-black border-b-[3px] border-accent-yellow">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black text-accent-yellow uppercase tracking-widest"
          >
            Molebie AI
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:block text-sm font-mono text-bg-white/40 uppercase tracking-widest">
              Architecture
            </span>
            <Link
              href="/"
              className="px-4 py-2 border-2 border-accent-yellow text-accent-yellow text-sm font-bold uppercase tracking-wider hover:bg-accent-yellow hover:text-base-black transition-colors"
            >
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile nav dropdown */}
      <MobileNav activeId={activeId} onNavigate={handleNavigate} />

      {/* Hero header */}
      <header className="pt-32 pb-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <AnimateIn>
            <div className="h-[3px] w-24 bg-accent-yellow mb-8" />
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] text-bg-white mb-6">
              System
              <br />
              <span className="text-accent-yellow">Architecture</span>
            </h1>
            <p className="max-w-2xl text-lg text-bg-white/60 leading-relaxed">
              Complete infrastructure and architecture of Molebie AI — covering
              all services, data flows, authentication, database schema, and
              deployment topology across 13 detailed diagrams.
            </p>
          </AnimateIn>
        </div>
      </header>

      <div className="h-[3px] bg-accent-yellow" />

      {/* Main content with sidebar */}
      <div className="max-w-[1400px] mx-auto px-6 py-16">
        <div className="flex gap-12">
          {/* Sticky sidebar — desktop only */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28 border-2 border-accent-yellow bg-base-black overflow-hidden">
              <div className="bg-accent-yellow px-4 py-2">
                <span className="font-black text-sm uppercase tracking-widest text-base-black">
                  Diagrams
                </span>
              </div>
              <SidebarNav activeId={activeId} onNavigate={handleNavigate} />
            </div>
          </aside>

          {/* Diagram sections */}
          <main className="flex-1 min-w-0 space-y-24">
            {ARCHITECTURE_SECTIONS.map((section) => (
              <DiagramSectionBlock key={section.id} section={section} />
            ))}
            <ServiceTable />
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="h-[3px] bg-accent-yellow" />
      <footer className="bg-base-black px-6 py-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <span className="text-2xl font-black text-accent-yellow uppercase tracking-widest">
              Molebie AI
            </span>
            <p className="text-bg-white/40 text-sm mt-1">
              Full system architecture documentation
            </p>
          </div>
          <Link
            href="/"
            className="text-bg-white/60 hover:text-accent-yellow transition-colors text-sm"
          >
            Back to landing page
          </Link>
        </div>
      </footer>
    </div>
  );
}
