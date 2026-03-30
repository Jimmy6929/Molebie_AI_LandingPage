import { COMPARISONS } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

export function Comparison() {
  return (
    <section
      className="bg-base-black min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Comparison"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading>Why Self-Host?</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="bg-accent-yellow p-[3px]">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1.5fr_1fr_1fr] gap-[3px] mb-[3px]">
              <div className="bg-base-black p-4" />
              <div className="bg-base-black p-4">
                <p className="text-bg-white/40 font-black text-xs uppercase tracking-widest">
                  Cloud AI
                </p>
              </div>
              <div className="bg-base-black p-4">
                <p className="text-accent-yellow font-black text-xs uppercase tracking-widest">
                  Molebie AI
                </p>
              </div>
            </div>

            {/* Comparison rows */}
            {COMPARISONS.map((row) => (
              <div
                key={row.aspect}
                className="grid grid-cols-[1fr_1fr_1fr] md:grid-cols-[1.5fr_1fr_1fr] gap-[3px] mb-[3px] last:mb-0"
              >
                <div className="bg-base-black p-4">
                  <p className="text-bg-white font-bold text-sm">
                    {row.aspect}
                  </p>
                </div>
                <div className="bg-base-black p-4 flex items-start gap-2">
                  <span className="text-red-400 font-black text-sm flex-shrink-0">
                    &#x2717;
                  </span>
                  <p className="text-bg-white/50 text-sm">{row.cloud}</p>
                </div>
                <div className="bg-base-black p-4 flex items-start gap-2">
                  <span className="text-accent-yellow font-black text-sm flex-shrink-0">
                    &#x2713;
                  </span>
                  <p className="text-bg-white text-sm">{row.self}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
