"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GitHubStarBadge } from "./ui/github-star-badge";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-base-black border-b-[3px] border-accent-yellow"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a
          href="#"
          className="text-2xl font-black text-accent-yellow uppercase tracking-widest"
        >
          Molebie AI
        </a>
        <div className="flex items-center gap-4">
          <Link
            href="/architecture"
            className="hidden sm:block text-sm font-bold uppercase tracking-wider text-bg-white/60 hover:text-accent-yellow transition-colors"
          >
            Architecture
          </Link>
          <GitHubStarBadge />
        </div>
      </div>
    </nav>
  );
}
