import { TRUST_BADGES } from "@/lib/constants";
import { AnimateIn } from "./ui/animate-in";

const badgeIcons: Record<string, React.ReactNode> = {
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  offline: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h6l3-9 4 18 3-9h6" />
    </svg>
  ),
  license: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="0" />
      <path d="M7 7h10M7 12h10M7 17h6" />
    </svg>
  ),
  database: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  "cloud-off": (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M18.7 13c.6-.8 1.3-2 1.3-3a5 5 0 0 0-5-5c-1.3 0-2.5.5-3.4 1.3" />
      <path d="M7 18a5 5 0 0 1-.7-10h.2" />
    </svg>
  ),
};

export function TrustBadges() {
  return (
    <section className="py-12 lg:py-16" aria-label="Trust badges">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[3px] bg-accent-yellow p-[3px]">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="bg-base-black p-4 lg:p-6 flex flex-col items-center text-center gap-3"
              >
                {badgeIcons[badge.icon]}
                <p className="text-bg-white font-bold text-xs uppercase tracking-widest">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
