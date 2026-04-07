"use client";

import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

function DeviceBox({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="border-2 border-accent-yellow bg-base-black p-3 sm:p-4 text-center min-w-0">
      <span className="block text-sm sm:text-base font-bold text-bg-white">
        {name}
      </span>
      <span className="block text-[10px] sm:text-xs font-mono text-bg-white/50 mt-1">
        {detail}
      </span>
    </div>
  );
}

function ServiceBox({
  name,
  port,
}: {
  name: string;
  port?: string;
}) {
  return (
    <div className="border border-accent-yellow/40 bg-base-black px-3 py-2">
      <span className="block text-xs sm:text-sm font-bold text-bg-white">
        {name}
      </span>
      {port && (
        <span className="block text-[10px] font-mono text-accent-yellow mt-0.5">
          {port}
        </span>
      )}
    </div>
  );
}

function VerticalLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="w-[3px] h-8 sm:h-12 bg-accent-yellow" />
    </div>
  );
}

export function DeploymentOverview() {
  return (
    <section
      id="deployment-overview"
      className="min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Deployment overview"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 w-full">
        <AnimateIn>
          <SectionHeading>How It Works</SectionHeading>
        </AnimateIn>

        {/* ── Devices row ── */}
        <AnimateIn delay={0.1}>
          <p className="text-accent-yellow font-black text-sm uppercase tracking-widest mb-4">
            Your Devices
            <span className="font-normal text-bg-white/40 ml-2 normal-case tracking-normal">
              — anywhere on your network
            </span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] bg-accent-yellow p-[3px]">
            <DeviceBox name="Phone" detail="Safari / Chrome" />
            <DeviceBox name="Laptop" detail="Any browser" />
            <DeviceBox name="iPad / Tablet" detail="Safari" />
            <DeviceBox name="Other PC" detail="Any browser" />
          </div>
        </AnimateIn>

        {/* ── Connector lines ── */}
        <AnimateIn delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] px-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <VerticalLine key={i} />
            ))}
          </div>

          {/* merge into one line */}
          <div className="flex justify-center">
            <div className="w-[calc(100%-6px)] md:w-full h-[3px] bg-accent-yellow relative">
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-0 w-[3px] h-6 bg-accent-yellow" />
            </div>
          </div>
        </AnimateIn>

        {/* ── Tailscale tunnel ── */}
        <AnimateIn delay={0.2}>
          <div className="flex justify-center mt-6">
            <div className="border-[3px] border-accent-yellow px-6 sm:px-10 py-4 text-center bg-base-black">
              <span className="block text-base sm:text-lg font-black text-accent-yellow">
                Tailscale Tunnel
              </span>
              <span className="block text-xs font-mono text-bg-white/50 mt-1">
                encrypted &middot; 100.x.x.x:3000
              </span>
            </div>
          </div>
        </AnimateIn>

        {/* ── Connector ── */}
        <AnimateIn delay={0.25}>
          <VerticalLine className="my-0" />
          <div className="flex justify-center">
            <div className="w-1/2 h-[3px] bg-accent-yellow relative">
              {/* left branch */}
              <div className="absolute left-0 w-[3px] h-6 bg-accent-yellow" />
              {/* right branch */}
              <div className="absolute right-0 w-[3px] h-6 bg-accent-yellow" />
            </div>
          </div>
        </AnimateIn>

        {/* ── Two deployment options ── */}
        <AnimateIn delay={0.3}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[3px] mt-6 bg-accent-yellow p-[3px]">
            {/* Option A */}
            <div className="bg-base-black p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl sm:text-3xl font-black text-accent-yellow leading-none">
                  A
                </span>
                <div>
                  <h4 className="text-bg-white font-black text-sm uppercase tracking-widest">
                    One Machine
                  </h4>
                  <p className="text-bg-white/40 text-xs font-mono">
                    Everything on a single box
                  </p>
                </div>
              </div>
              <div className="border-2 border-accent-yellow/30 p-4">
                <span className="block text-xs font-mono uppercase tracking-widest text-accent-yellow mb-3">
                  Your Machine
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <ServiceBox name="Web App" port=":3000" />
                  <ServiceBox name="Gateway API" port=":8000" />
                  <ServiceBox name="LLM Inference" port=":8080 / :8081" />
                  <ServiceBox name="SQLite DB" />
                  <ServiceBox name="SearXNG Search" port=":8888" />
                  <ServiceBox name="Kokoro TTS" port=":8880" />
                </div>
              </div>
            </div>

            {/* Option B */}
            <div className="bg-base-black p-5 sm:p-6 relative">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl sm:text-3xl font-black text-accent-yellow leading-none">
                  B
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-bg-white font-black text-sm uppercase tracking-widest">
                      Split Across Machines
                    </h4>
                    <span className="inline-block border border-accent-yellow text-accent-yellow text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-bg-white/40 text-xs font-mono">
                    Distribute the workload
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 opacity-40 pointer-events-none">
                <div className="border-2 border-accent-yellow/30 p-4">
                  <span className="block text-xs font-mono uppercase tracking-widest text-accent-yellow mb-3">
                    Machine 1
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <ServiceBox name="Web App" port=":3000" />
                    <ServiceBox name="Gateway API" port=":8000" />
                    <ServiceBox name="SQLite DB" />
                  </div>
                </div>
                <div className="border-2 border-accent-yellow/30 p-4">
                  <span className="block text-xs font-mono uppercase tracking-widest text-accent-yellow mb-3">
                    Machine 2 — GPU
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <ServiceBox name="LLM Inference" port=":8080 / :8081" />
                  </div>
                </div>
                <div className="border-2 border-accent-yellow/30 p-4">
                  <span className="block text-xs font-mono uppercase tracking-widest text-bg-white/30 mb-3">
                    Machine 3 — Optional
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <ServiceBox name="SearXNG" port=":8888" />
                    <ServiceBox name="Kokoro TTS" port=":8880" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* ── Tagline ── */}
        <AnimateIn delay={0.35}>
          <p className="mt-8 text-bg-white/60 text-sm sm:text-base font-mono text-center max-w-2xl mx-auto leading-relaxed">
            You decide what runs where based on your hardware.
            <br className="hidden sm:block" />{" "}
            Got one powerful PC? Run everything there.
            <br className="hidden sm:block" />{" "}
            Got an old laptop + a GPU tower? Split the workload.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
