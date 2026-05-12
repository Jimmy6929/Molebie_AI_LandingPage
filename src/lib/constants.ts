export const GITHUB_REPO = "https://github.com/Jimmy6929/Molebie_AI";
export const GITHUB_API_REPO = "https://api.github.com/repos/Jimmy6929/Molebie_AI";
export const INSTALL_COMMAND_UNIX = "curl -fsSL https://molebieai.com/install.sh | bash";
export const INSTALL_COMMAND_WINDOWS = 'wsl -e bash -c "curl -fsSL https://molebieai.com/install.sh | bash"';

export const FEATURES = [
  {
    title: "Three Thinking Modes",
    description:
      "Instant answers, chain-of-thought reasoning, or extended deep thinking with an 8K token budget. Opt in to a verification stack — Chain-of-Verification, Grounding Judge, SelfCheckGPT, Self-Consistency voting — when correctness matters more than speed.",
    icon: "brain" as const,
    wide: true,
  },
  {
    title: "Voice Conversation",
    description:
      "Wake-word activation, faster-whisper speech-to-text, streaming Kokoro TTS with 12 voices, and speaker verification. Hands-free from the first word.",
    icon: "microphone" as const,
    wide: false,
  },
  {
    title: "Image Understanding",
    description:
      "Drop, paste, or attach images mid-conversation. Your AI sees and reasons about visual content alongside text.",
    icon: "eye" as const,
    wide: false,
  },
  {
    title: "Document Memory & Vault Sync",
    description:
      "PDF, DOCX, TXT, and Markdown with hybrid vector + BM25, cross-encoder rerank, and Anthropic contextual retrieval (+35–49% quality). Folder ingest up to 5,000 files with live progress; hash-diff sync for your Obsidian vault.",
    icon: "document" as const,
    wide: false,
  },
  {
    title: "Web Search",
    description:
      "Self-hosted SearXNG with LLM intent classification, trafilatura page fetch, source trust scoring, and inline citations. Real-time answers without giving up your queries.",
    icon: "globe" as const,
    wide: false,
  },
  {
    title: "Full Data Ownership & Observability",
    description:
      "SQLite (WAL + FTS5 + sqlite-vec) on your machine. Multi-user with full isolation. No telemetry by default. Watch every request live from `molebie-ai monitor` — a 7-panel terminal dashboard polling at 2Hz.",
    icon: "shield" as const,
    wide: true,
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Install",
    description: "One-line bash install on macOS, Linux, or Windows WSL. Single-binary CLI, no config files.",
    code: "curl -fsSL https://molebieai.com/install.sh | bash",
  },
  {
    number: "02",
    title: "Auto-Configure",
    description: "Picks the right backend (MLX on Apple Silicon, Ollama elsewhere) and pulls Qwen 3.5 — 4B for Instant, 9B for Thinking.",
    code: "Apple Silicon detected → MLX backend → 16GB RAM → Balanced profile",
  },
  {
    number: "03",
    title: "Chat",
    description: "Talk, type, drop in files, sync a vault. Watch it run from `molebie-ai monitor`.",
    code: "molebie-ai run",
  },
] as const;

export const REQUIREMENTS = [
  { label: "Operating System", value: "macOS, Linux, or Windows (WSL2)" },
  { label: "RAM", value: "8 GB min (Qwen 3.5 4B Instant), 16 GB+ recommended (Qwen 3.5 9B Thinking)" },
  { label: "GPU", value: "Apple Silicon (MLX), NVIDIA (vLLM / llama.cpp CUDA), or CPU fallback" },
  { label: "Disk Space", value: "~10 GB for default Qwen 3.5 4B + 9B" },
  { label: "Docker", value: "Optional \u2014 only for SearXNG search and Kokoro TTS sidecars" },
] as const;

export const BACKENDS = ["MLX", "Ollama", "vLLM", "llama.cpp", "OpenAI-compatible"] as const;

export const DEMO_FEATURES = [
  {
    title: "Voice Conversation",
    description: "Wake word, faster-whisper STT, streaming Kokoro TTS response",
    icon: "microphone" as const,
  },
  {
    title: "Document Memory & Vault Sync",
    description: "Folder ingest with hybrid search, rerank, and contextual retrieval",
    icon: "document" as const,
  },
  {
    title: "Web Search",
    description: "Self-hosted SearXNG with inline source citations",
    icon: "globe" as const,
  },
] as const;

export const COMPARISONS = [
  { aspect: "Data Privacy", cloud: "Your data on their servers", self: "Everything stays on your machine, no telemetry" },
  { aspect: "Monthly Cost", cloud: "$20\u2013100+/month per user", self: "Free forever, you own the hardware" },
  { aspect: "Offline Access", cloud: "Requires internet connection", self: "Works fully offline \u2014 search via self-hosted SearXNG" },
  { aspect: "Customization", cloud: "Limited to what they offer", self: "Swap backends (MLX / Ollama / vLLM / llama.cpp) any time" },
  { aspect: "Observability", cloud: "Closed dashboard, if any", self: "`molebie-ai monitor` \u2014 7-panel live terminal dashboard" },
  { aspect: "Hallucination Control", cloud: "Trust the model", self: "Opt-in CoVe, Grounding Judge, SelfCheckGPT, Self-Consistency" },
] as const;

export const TRUST_BADGES = [
  { label: "No Telemetry by Default", icon: "shield" as const },
  { label: "Runs Fully Offline", icon: "offline" as const },
  { label: "MIT Licensed", icon: "license" as const },
  { label: "SQLite \u2014 You Own the DB", icon: "database" as const },
  { label: "Multi-User Isolation", icon: "cloud-off" as const },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Can it really run on 8 GB of RAM?",
    answer:
      "Yes. Qwen 3.5 4B (Instant) fits comfortably in 8 GB. Molebie routes easy questions to the 4B and only escalates to Qwen 3.5 9B (Thinking) when reasoning is needed — like knowing when to use electric vs fuel in an F1 car. 16 GB+ unlocks Thinking mode full-time.",
  },
  {
    question: "Does Molebie AI phone home?",
    answer:
      "No. There is no telemetry by default, no cloud sync, and no external API calls unless you explicitly configure an OpenAI-compatible provider. Metrics are loopback-only — visible to you via `molebie-ai monitor`, not to anyone else.",
  },
  {
    question: "How do I bring in my own documents?",
    answer:
      "Drop a folder of up to 5,000 PDF, DOCX, TXT, or Markdown files — you'll see live ingest progress over SSE. Obsidian users get hash-diff vault sync: edit a note, re-run sync, only the changed chunks are re-indexed.",
  },
  {
    question: "How accurate is the RAG retrieval?",
    answer:
      "Hybrid vector + BM25 search, cross-encoder reranking, and Anthropic-style contextual retrieval combine for a +35–49% quality lift over plain vector RAG. Defaults: 512-char chunks, 64-char overlap, 30 candidates, 12K context window.",
  },
  {
    question: "What about hallucinations?",
    answer:
      "Optional quality gates: Chain-of-Verification (CoVe), Grounding Judge (DeBERTa-v3-MNLI), SelfCheckGPT, and Self-Consistency voting. Most are off by default — turn them on per-conversation when you need correctness guarantees.",
  },
  {
    question: "Is there a hosted version?",
    answer:
      "Not yet — self-host is the product. Molebie AI supports multiple backends (MLX, Ollama, vLLM, llama.cpp, OpenAI-compatible) with multi-user isolation, so one install can serve a household or small team over Tailscale.",
  },
] as const;
