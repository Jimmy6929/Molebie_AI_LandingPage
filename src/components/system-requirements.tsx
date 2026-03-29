import { REQUIREMENTS, BACKENDS } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

export function SystemRequirements() {
  return (
    <section
      className="bg-accent-yellow min-h-screen flex items-center py-24 lg:py-32"
      aria-label="System requirements"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading light>System Requirements</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="max-w-2xl">
            {REQUIREMENTS.map((req) => (
              <div
                key={req.label}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-4 border-b-2 border-base-black/20"
              >
                <span className="flex items-center gap-3 text-base-black font-bold min-w-[160px]">
                  <span className="w-2 h-2 bg-base-black flex-shrink-0" />
                  {req.label}
                </span>
                <span className="text-base-black/70">{req.value}</span>
              </div>
            ))}
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="mt-12">
            <h3 className="text-sm font-black uppercase tracking-widest text-base-black mb-4">
              Supported Backends
            </h3>
            <div className="flex flex-wrap gap-2">
              {BACKENDS.map((backend) => (
                <span
                  key={backend}
                  className="bg-base-black text-bg-white border-2 border-base-black px-4 py-1.5 text-sm font-mono"
                >
                  {backend}
                </span>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
