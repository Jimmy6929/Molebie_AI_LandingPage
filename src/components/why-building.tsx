import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

const CONSTRAINTS = [
  {
    question: "Can&rsquo;t add more RAM?",
    answer:
      "Use a small fast model for easy tasks and only call the big reasoning model when it matters &mdash; like knowing when to use electric vs fuel in an F1 car.",
  },
  {
    question: "One machine isn&rsquo;t enough?",
    answer:
      "Split inference across multiple devices over Tailscale &mdash; like having a pit crew ready when you need them.",
  },
  {
    question: "Heavy databases eat resources?",
    answer:
      "Use SQLite instead of Postgres &mdash; strip out the luxury interior so more power goes to the engine.",
  },
  {
    question: "Context windows are limited?",
    answer:
      "Smart RAG, summarization, and memory keep prompts lean and effective &mdash; that&rsquo;s aerodynamics, less drag, more speed.",
  },
] as const;

export function WhyBuilding() {
  return (
    <section
      id="why-building"
      className="min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Why I'm building it"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full">
        <AnimateIn>
          <SectionHeading>Why I&rsquo;m Building It</SectionHeading>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="bg-accent-yellow p-[3px] mb-[3px]">
            <div className="bg-base-black p-8 md:p-12">
              <p className="text-accent-yellow font-black text-xs uppercase tracking-widest mb-4">
                Mission
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-bg-white">
                Build infrastructure and architecture that maximises the
                performance of LLMs running locally on resource-constrained
                hardware.
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="bg-accent-yellow p-[3px] mb-[3px]">
            <div className="bg-base-black p-8 md:p-12">
              <p className="text-bg-white/70 leading-relaxed text-base md:text-lg">
                Most local AI tools assume you have a powerful machine and just
                slap a UI on top. Molebie AI takes the opposite approach &mdash;
                it obsesses over efficiency and optimisation so that even a
                laptop with 8&ndash;16GB of RAM can deliver a genuinely good AI
                experience. v0.2.0 is out today, shipping voice, vision, RAG,
                web search, quality gates, and a terminal observability
                dashboard &mdash; all running locally.
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="bg-accent-yellow p-[3px] mb-[3px]">
            <div className="bg-base-black p-8 md:p-12">
              <p className="text-accent-yellow font-black text-xs uppercase tracking-widest mb-4">
                The Car Analogy
              </p>
              <p className="text-bg-white/70 leading-relaxed text-base md:text-lg mb-4">
                Imagine you want to build the fastest car, but you can&rsquo;t
                afford a bigger engine. So what do you do? You strip out the
                unnecessary weight, redesign the frame for aerodynamics, and
                engineer every system around the constraint. That&rsquo;s the
                Lotus philosophy &mdash;{" "}
                <span className="text-accent-yellow font-bold italic">
                  &ldquo;Simplify, then add lightness.&rdquo;
                </span>{" "}
                Molebie AI applies the same thinking to local AI:
              </p>
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.4}>
          <div className="bg-accent-yellow p-[3px] mb-[3px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
              {CONSTRAINTS.map((item) => (
                <div key={item.question} className="bg-base-black p-8 h-full">
                  <h3
                    className="text-lg md:text-xl font-black text-accent-yellow mb-3 leading-tight"
                    dangerouslySetInnerHTML={{ __html: item.question }}
                  />
                  <p
                    className="text-bg-white/70 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.5}>
          <div className="bg-accent-yellow p-[3px]">
            <div className="bg-base-black p-8 md:p-12">
              <p className="text-accent-yellow font-black text-xs uppercase tracking-widest mb-4">
                The Result
              </p>
              <p className="text-bg-white text-lg md:text-xl leading-relaxed">
                Privacy comes for free (everything stays local), but the real
                goal is making local AI{" "}
                <span className="text-accent-yellow font-bold">
                  perform its best on hardware that shouldn&rsquo;t be able to
                  run it well.
                </span>
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
