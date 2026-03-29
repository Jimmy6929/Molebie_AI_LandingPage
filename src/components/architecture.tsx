import { SectionHeading } from "./ui/section-heading";
import { AnimateIn } from "./ui/animate-in";

function LayerBox({
  label,
  title,
  items,
  accent = false,
}: {
  label: string;
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="flex gap-4 items-start">
      <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-accent-yellow min-w-[100px] pt-4 text-right">
        {label}
      </span>
      <div
        className={`flex-1 border-2 p-5 ${
          accent
            ? "border-accent-yellow bg-accent-yellow text-base-black"
            : "border-accent-yellow bg-base-black"
        }`}
      >
        <span className="md:hidden text-xs font-mono uppercase tracking-widest text-accent-yellow mb-2 block">
          {label}
        </span>
        <h4
          className={`font-bold mb-2 ${
            accent ? "text-base-black" : "text-bg-white"
          }`}
        >
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className={`text-xs font-mono px-2 py-1 border ${
                accent
                  ? "border-base-black text-base-black bg-accent-yellow"
                  : "border-accent-yellow text-accent-yellow bg-base-black"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex gap-4 items-center">
      <span className="hidden md:block min-w-[100px]" />
      <div className="flex-1 flex justify-center py-1">
        <div className="w-[3px] h-8 bg-accent-yellow" />
      </div>
    </div>
  );
}

export function Architecture() {
  return (
    <section
      className="bg-base-black min-h-screen flex items-center py-24 lg:py-32"
      aria-label="Architecture"
    >
      <div className="max-w-5xl mx-auto px-6 w-full">
        <AnimateIn>
          <SectionHeading>Architecture</SectionHeading>
        </AnimateIn>

        <div className="flex flex-col gap-1">
          <AnimateIn delay={0.1}>
            <LayerBox
              label="User"
              title="Web App (Next.js)"
              items={["Chat UI", "Voice", "Vision", "Document Brain", "Auth"]}
              accent
            />
          </AnimateIn>

          <AnimateIn delay={0.15}>
            <Connector />
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <LayerBox
              label="Control"
              title="Gateway API (FastAPI)"
              items={[
                "JWT Auth",
                "SSE Streaming",
                "RAG Pipeline",
                "Web Search",
                "Voice",
              ]}
            />
          </AnimateIn>

          <AnimateIn delay={0.25}>
            <Connector />
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="flex gap-4 items-start">
              <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-accent-yellow min-w-[100px] pt-4 text-right">
                Services
              </span>
              <div className="flex-1 bg-accent-yellow p-[3px]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px]">
                  {[
                    { name: "Thinking LLM", port: ":8080" },
                    { name: "Instant LLM", port: ":8081" },
                    { name: "SearXNG", port: ":8888" },
                    { name: "Kokoro TTS", port: ":8880" },
                  ].map((svc) => (
                    <div
                      key={svc.name}
                      className="bg-base-black p-3 text-left"
                    >
                      <span className="block text-sm font-bold text-bg-white">
                        {svc.name}
                      </span>
                      <span className="block text-xs font-mono text-accent-yellow mt-1">
                        {svc.port}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.35}>
            <Connector />
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <LayerBox
              label="Data"
              title="SQLite + Local Storage"
              items={["Auth", "User Data", "Embeddings", "Files", "FTS5"]}
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
