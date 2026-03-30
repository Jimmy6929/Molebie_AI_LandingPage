import Image from "next/image";
import { GITHUB_REPO } from "@/lib/constants";
import { WaitlistForm } from "./ui/waitlist-form";

export function Footer() {
  return (
    <footer className="bg-base-black" aria-label="Footer">
      <div className="h-[3px] bg-accent-yellow" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo & tagline */}
          <div>
            <Image
              src="/logo.png"
              alt="Molebie AI"
              width={160}
              height={40}
              className="h-20 w-auto"
            />
            <p className="text-bg-white/60 text-sm mt-1">
              Built for privacy-conscious developers who want to own their data.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-bg-white font-black text-xs uppercase tracking-widest mb-4">
              Links
            </p>
            <nav className="flex flex-col gap-2">
              <a href="#features" className="text-bg-white/60 hover:text-accent-yellow transition-colors text-sm">Features</a>
              <a href="#how-it-works" className="text-bg-white/60 hover:text-accent-yellow transition-colors text-sm">How It Works</a>
              <a href="/architecture" className="text-bg-white/60 hover:text-accent-yellow transition-colors text-sm">Architecture</a>
              <a href="#faq" className="text-bg-white/60 hover:text-accent-yellow transition-colors text-sm">FAQ</a>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-bg-white/60 hover:text-accent-yellow transition-colors text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </nav>
          </div>

          {/* Stay Updated */}
          <div>
            <p className="text-bg-white font-black text-xs uppercase tracking-widest mb-4">
              Stay Updated
            </p>
            <WaitlistForm source="footer" />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-bg-white/10">
          <p className="text-bg-white/40 text-sm">
            MIT License &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
