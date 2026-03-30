import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";
import { DemoVideo } from "./ui/demo-video";

export function Demo() {
  return (
    <section
      className="min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Demo"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading>See It in Action</SectionHeading>
        </AnimateIn>

        {/* CLI install demo — main video */}
        <AnimateIn delay={0.1}>
          <DemoVideo
            src="/videos/cli-install-demo.mov"
            width={1280}
            height={720}
            caption="CLI tool — one-command install process"
            loopOnly
          />
        </AnimateIn>

        {/* Three thinking modes */}
        <AnimateIn delay={0.15}>
          <h3 className="mt-16 mb-6 text-accent-yellow font-black text-sm uppercase tracking-widest">
            Three Thinking Modes
          </h3>
          <div className="bg-accent-yellow p-[3px]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[3px]">
              <div className="bg-base-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-accent-yellow leading-none">01</span>
                  <div>
                    <h4 className="text-bg-white font-black text-sm uppercase tracking-widest">Instant</h4>
                    <p className="text-bg-white/40 text-xs font-mono">Fast, no chain-of-thought</p>
                  </div>
                </div>
                <DemoVideo
                  src="/videos/instant-demo.mov"
                  width={640}
                  height={360}
                  caption="Instant mode — sub-second responses"
                />
              </div>

              <div className="bg-base-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-accent-yellow leading-none">02</span>
                  <div>
                    <h4 className="text-bg-white font-black text-sm uppercase tracking-widest">Thinking</h4>
                    <p className="text-bg-white/40 text-xs font-mono">Chain-of-thought reasoning</p>
                  </div>
                </div>
                <DemoVideo
                  src="/videos/thinking-demo.mov"
                  width={640}
                  height={360}
                  caption="Thinking mode — 2048 token budget"
                />
              </div>

              <div className="bg-base-black p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-black text-accent-yellow leading-none">03</span>
                  <div>
                    <h4 className="text-bg-white font-black text-sm uppercase tracking-widest">Think Harder</h4>
                    <p className="text-bg-white/40 text-xs font-mono">Extended deep reasoning</p>
                  </div>
                </div>
                <DemoVideo
                  src="/videos/think-harder-demo.mov"
                  width={640}
                  height={360}
                  caption="Think harder — 8192 token budget"
                />
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Feature demos */}
        <AnimateIn delay={0.25}>
          <h3 className="mt-16 mb-6 text-accent-yellow font-black text-sm uppercase tracking-widest">
            Key Features
          </h3>
          <div className="bg-accent-yellow p-[3px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
              <div className="bg-base-black p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3" />
                    <path d="M5 10a7 7 0 0 0 14 0" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                    <line x1="8" y1="22" x2="16" y2="22" />
                  </svg>
                  <h3 className="text-bg-white font-black text-sm uppercase tracking-widest">
                    Voice Conversation
                  </h3>
                </div>
                <DemoVideo
                  src="/videos/voice-demo.mov"
                  width={640}
                  height={360}
                  caption="Wake word, speech-to-text, natural TTS response"
                />
              </div>

              <div className="bg-base-black p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <h3 className="text-bg-white font-black text-sm uppercase tracking-widest">
                    Web Search
                  </h3>
                </div>
                <DemoVideo
                  src="/videos/web-search-demo.mov"
                  width={640}
                  height={360}
                  caption="Real-time search with source citations"
                />
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
