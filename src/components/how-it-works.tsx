import { STEPS } from "@/lib/constants";
import { SectionHeading } from "./ui/section-heading";
import { StepCard } from "./ui/step-card";
import { AnimateIn } from "./ui/animate-in";

export function HowItWorks() {
  return (
    <section className="bg-base-black min-h-screen flex items-center py-24 lg:py-32" aria-label="How it works">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading>Up and Running in 60 Seconds</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="bg-accent-yellow p-[3px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[3px]">
              {STEPS.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  code={step.code}
                />
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
