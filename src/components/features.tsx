import { FEATURES } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { FeatureCard } from "./ui/feature-card";
import { AnimateIn } from "./ui/animate-in";

export function Features() {
  return (
    <section id="features" className="min-h-screen flex items-center py-24 lg:py-32" aria-label="Features">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        <AnimateIn>
          <SectionHeading>What You Get</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="bg-accent-yellow p-[3px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[3px]">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className={feature.wide ? "md:col-span-2" : ""}
                >
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    icon={feature.icon}
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
