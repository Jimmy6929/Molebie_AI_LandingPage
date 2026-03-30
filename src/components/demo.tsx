import { DEMO_FEATURES } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";
import { DemoVideo } from "./ui/demo-video";
import { FeatureIcon } from "./ui/feature-icon";

export function Demo() {
  return (
    <section
      className="bg-surface-dark min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Demo"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading>See It in Action</SectionHeading>
        </AnimateIn>

        {/* Main demo video placeholder */}
        <AnimateIn delay={0.1}>
          <DemoVideo
            placeholder
            width={1280}
            height={720}
            caption="Full product walkthrough"
          />
        </AnimateIn>

        {/* Feature clips grid */}
        <AnimateIn delay={0.2}>
          <div className="mt-8 bg-accent-yellow p-[3px]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[3px]">
              {DEMO_FEATURES.map((feature) => (
                <div key={feature.title} className="bg-base-black p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <FeatureIcon name={feature.icon} />
                    <h3 className="text-bg-white font-black text-sm uppercase tracking-widest">
                      {feature.title}
                    </h3>
                  </div>
                  <div
                    className="w-full bg-surface-dark flex items-center justify-center mb-4"
                    style={{ aspectRatio: "16 / 9" }}
                  >
                    <svg
                      className="text-accent-yellow/40"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="8,5 19,12 8,19" />
                    </svg>
                  </div>
                  <p className="text-bg-white/60 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
