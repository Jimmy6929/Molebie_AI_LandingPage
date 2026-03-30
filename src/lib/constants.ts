export const GITHUB_REPO = "https://github.com/Jimmy6929/Molebie_AI";
export const GITHUB_API_REPO = "https://api.github.com/repos/Jimmy6929/Molebie_AI";
export const INSTALL_COMMAND_UNIX = "curl -fsSL https://molebie.ai/install.sh | bash";
export const INSTALL_COMMAND_WINDOWS = 'wsl -e bash -c "curl -fsSL https://molebie.ai/install.sh | bash"';

export const FEATURES = [
  {
    title: "Three Thinking Modes",
    description:
      "Instant answers, chain-of-thought reasoning, or extended deep thinking. Pick the depth that fits your question.",
    icon: "brain" as const,
    wide: true,
  },
  {
    title: "Voice Conversation",
    description:
      "Wake-word activation, speech-to-text via Whisper, natural text-to-speech via Kokoro, with speaker verification.",
    icon: "microphone" as const,
    wide: false,
  },
  {
    title: "Image Understanding",
    description:
      "Drop, paste, or attach images. Your AI sees and understands visual content alongside text.",
    icon: "eye" as const,
    wide: false,
  },
  {
    title: "Document Memory",
    description:
      "Upload PDFs, DOCX, TXT, and Markdown. Hybrid vector + BM25 search with cross-encoder reranking for accurate retrieval.",
    icon: "document" as const,
    wide: false,
  },
  {
    title: "Web Search",
    description:
      "Self-hosted SearXNG with LLM-powered intent classification. Get answers grounded in real-time web results with source citations.",
    icon: "globe" as const,
    wide: false,
  },
  {
    title: "Full Data Ownership",
    description:
      "Everything in SQLite on your machine. Multi-user with full isolation. No telemetry, no cloud, no exceptions.",
    icon: "shield" as const,
    wide: true,
  },
] as const;

export const STEPS = [
  {
    number: "01",
    title: "Install",
    description: "One command pulls the repo and sets up everything.",
    code: "curl -fsSL https://molebie.ai/install.sh | bash",
  },
  {
    number: "02",
    title: "Auto-Configure",
    description: "Detects your hardware, picks optimal models, generates config.",
    code: "Apple Silicon detected → MLX backend → 16GB RAM → Balanced profile",
  },
  {
    number: "03",
    title: "Chat",
    description: "Open localhost:3000 and start talking to your AI.",
    code: "molebie-ai run",
  },
] as const;

export const REQUIREMENTS = [
  { label: "Operating System", value: "macOS, Linux, or Windows (WSL2)" },
  { label: "RAM", value: "8 GB minimum, 16 GB+ recommended" },
  { label: "GPU", value: "Recommended for local inference (Apple Silicon, NVIDIA)" },
  { label: "Disk Space", value: "2\u201310 GB per model" },
  { label: "Docker", value: "Optional \u2014 only for web search and TTS" },
] as const;

export const BACKENDS = ["MLX", "Ollama", "vLLM", "llama.cpp", "OpenAI API"] as const;

export const DEMO_FEATURES = [
  {
    title: "Voice Conversation",
    description: "Wake word, speech-to-text, natural TTS response",
    icon: "microphone" as const,
  },
  {
    title: "Document Memory",
    description: "Upload and query your documents with hybrid search",
    icon: "document" as const,
  },
  {
    title: "Web Search",
    description: "Real-time search with source citations",
    icon: "globe" as const,
  },
] as const;

export const COMPARISONS = [
  { aspect: "Data Privacy", cloud: "Your data on their servers", self: "Everything stays on your machine" },
  { aspect: "Monthly Cost", cloud: "$20\u2013100+/month per user", self: "Free forever, you own the hardware" },
  { aspect: "Offline Access", cloud: "Requires internet connection", self: "Works completely offline" },
  { aspect: "Customization", cloud: "Limited to what they offer", self: "Full control over models and config" },
  { aspect: "Vendor Lock-in", cloud: "Switching costs and data export pain", self: "Open source, standard formats" },
  { aspect: "Compliance", cloud: "Trust their compliance claims", self: "Verify yourself \u2014 it\u2019s your infra" },
] as const;

export const TRUST_BADGES = [
  { label: "Zero Telemetry", icon: "shield" as const },
  { label: "100% Offline Capable", icon: "offline" as const },
  { label: "MIT Licensed", icon: "license" as const },
  { label: "SQLite \u2014 Your Data", icon: "database" as const },
  { label: "No Cloud Dependencies", icon: "cloud-off" as const },
] as const;

export const FAQ_ITEMS = [
  {
    question: "What hardware do I need to run Molebie AI?",
    answer:
      "Minimum 8 GB RAM with any modern CPU. For best performance, 16 GB+ RAM with Apple Silicon or an NVIDIA GPU is recommended. The installer auto-detects your hardware and picks optimal models.",
  },
  {
    question: "Is Molebie AI truly private?",
    answer:
      "Yes. All data is stored locally in SQLite on your machine. There is no telemetry, no cloud sync, and no external API calls unless you explicitly configure an external LLM provider.",
  },
  {
    question: "Can multiple users share one installation?",
    answer:
      "Yes. Molebie AI supports multi-user with full data isolation. Each user gets their own conversation history, documents, and settings.",
  },
  {
    question: "What LLM models are supported?",
    answer:
      "Molebie AI supports multiple backends: MLX (Apple Silicon), Ollama, vLLM, llama.cpp, and OpenAI-compatible APIs. You can switch models at any time.",
  },
  {
    question: "How do I update Molebie AI?",
    answer:
      "Run the same install command again. It detects the existing installation and performs an in-place upgrade while preserving your data and configuration.",
  },
  {
    question: "Is Docker required?",
    answer:
      "Docker is optional and only needed for web search (SearXNG) and text-to-speech (Kokoro TTS). The core AI assistant runs natively without Docker.",
  },
] as const;
