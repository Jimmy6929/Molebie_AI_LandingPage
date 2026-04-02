"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
        <a href="#" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Molebie AI"
            width={160}
            height={40}
            className="h-10 sm:h-14 lg:h-20 w-auto"
          />
        </a>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://toogoodtobechu.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm font-bold uppercase tracking-wider text-bg-white hover:text-accent-yellow transition-colors"
          >
            The Founder
          </a>
          <Link
            href="/architecture"
            className="hidden sm:block text-sm font-bold uppercase tracking-wider text-bg-white hover:text-accent-yellow transition-colors"
          >
            Architecture
          </Link>
          <GitHubStarBadge />
        </div>
      </div>
    </nav>
  );
}
