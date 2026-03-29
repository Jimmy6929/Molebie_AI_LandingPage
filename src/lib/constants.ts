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
