export interface DiagramSection {
  id: string;
  number: string;
  title: string;
  description: string;
  diagram: string;
  details: string[];
}

export const ARCHITECTURE_SECTIONS: DiagramSection[] = [
  {
    id: "high-level",
    number: "01",
    title: "High-Level Architecture",
    description:
      "Bird's-eye view of how every component connects. Flexible deployment across one or more machines, with the gateway as the central orchestrator.",
    diagram: `graph TB
    subgraph browser [Browser]
        User["User (Browser)"]
    end

    subgraph appServices ["App Services (Gateway + Webapp)"]
        WebApp["Next.js 16 Web App\\n:3000"]
        Gateway["FastAPI Gateway\\n:8000"]
        SQLiteDB["SQLite Database\\n(sqlite-vec + FTS5)\\ndata/molebie.db"]
        LocalStorage["Local File Storage\\ndata/images/ + data/documents/"]
        subgraph dockerSvc [Docker Services — Optional]
            SearXNG["SearXNG\\nWeb Search\\n:8888"]
            KokoroTTS["Kokoro TTS\\n:8880"]
        end
    end

    subgraph llmServices ["LLM Server (GPU / Apple Silicon)"]
        ThinkingLLM["Inference — Thinking Tier\\n(MLX / Ollama / vLLM / OpenAI)\\n:8080"]
        InstantLLM["Inference — Instant Tier\\n(MLX / Ollama / vLLM / OpenAI)\\n:8081"]
    end

    User -->|"HTTPS :3000"| WebApp
    WebApp -->|"REST + JWT\\n:8000"| Gateway
    Gateway -->|"aiosqlite"| SQLiteDB
    Gateway -->|"File I/O"| LocalStorage
    Gateway -->|"HTTP /v1/chat/completions\\nvia Tailscale/LAN :8080"| ThinkingLLM
    Gateway -->|"HTTP /v1/chat/completions\\nvia Tailscale/LAN :8081"| InstantLLM
    Gateway -->|"HTTP :8888"| SearXNG
    Gateway -->|"HTTP :8880"| KokoroTTS`,
    details: [
      "Flexible deployment: services can all run on one machine or be distributed freely across machines",
      "3 core services: Webapp (Next.js), Gateway (FastAPI + SQLite), LLM Server (MLX/Ollama/vLLM)",
      "Optional Docker services (SearXNG, Kokoro TTS) are co-located with Gateway",
      "No Supabase dependency — all data stored locally in SQLite with sqlite-vec for vector search and FTS5 for full-text search",
      "All inter-service communication is HTTP; no message queues or gRPC",
      "Gateway is the central orchestrator — routes to inference, RAG, web search, TTS, memory, summarization, and database",
      "molebie-ai CLI manages setup, configuration, and service lifecycle",
      "Docker is only required for optional services (SearXNG, Kokoro TTS)",
    ],
  },
  {
    id: "request-flow",
    number: "02",
    title: "Request Flow — Chat Completion",
    description:
      "The main user-facing flow when sending a chat message, including web search, RAG, memory, and summarization with SSE streaming.",
    diagram: `sequenceDiagram
    participant U as Browser
    participant W as Next.js :3000
    participant G as Gateway :8000
    participant DB as SQLite
    participant S as SearXNG :8888
    participant RAG as RAG Pipeline
    participant MEM as Memory Service
    participant LLM as Inference Tier

    U->>W: Type message, click Send
    W->>W: Get JWT from localStorage
    W->>G: POST /chat/stream {message, mode, session_id, images[]}<br/>Authorization: Bearer JWT

    G->>G: Decode JWT, extract user_id
    G->>DB: GET or CREATE chat_session
    DB-->>G: session_id

    G->>DB: INSERT chat_message (role=user) + store images
    G->>DB: SELECT last messages for context

    par Context Enrichment
        G->>S: Intent classification → search if needed
        S-->>G: Web results + snippets
    and
        G->>RAG: Hybrid search (sqlite-vec + FTS5 → RRF → rerank)
        RAG-->>G: Relevant document chunks
    and
        G->>MEM: Retrieve relevant user memories
        MEM-->>G: Top 5 memories (by similarity)
    and
        G->>DB: GET session_documents (attached files)
        DB-->>G: Document content
    end

    G->>G: Build system prompt with evidence summary<br/>(web sources + RAG chunks + memories + attached docs)

    G->>LLM: POST /v1/chat/completions<br/>{model, messages[], stream:true,<br/>enable_thinking, thinking_budget, images[]}

    loop SSE Streaming
        LLM-->>G: data: {delta.content, delta.reasoning_content}
        G-->>W: data: {delta.content, delta.reasoning_content}
        W-->>U: Render markdown + KaTeX incrementally
    end

    LLM-->>G: data: [DONE]
    G->>G: Strip think tags, extract reasoning_content
    G->>DB: INSERT chat_message (role=assistant,<br/>content, reasoning_content, mode_used)

    par Background Tasks
        G->>MEM: Extract memories (every 6 messages)
    and
        G->>G: Summarize conversation (if 16+ unsummarized)
    end

    G-->>W: data: [DONE]
    W->>W: Parse think tags, show reasoning toggle
    W-->>U: Final rendered response with source citations`,
    details: [
      "Parallel context enrichment: web search, RAG retrieval, and memory recall happen simultaneously",
      "SSE streaming delivers tokens incrementally for real-time rendering",
      "Background tasks (memory extraction, summarization) run after each response",
      "JWT authentication on every request with user-scoped data isolation",
      "Evidence from web, RAG, and memory is injected into the system prompt",
    ],
  },
  {
    id: "auth-flow",
    number: "03",
    title: "Authentication Flow",
    description:
      "Gateway-managed authentication with JWT tokens. Supports single-user (password-only) and multi-user (email + password) modes.",
    diagram: `sequenceDiagram
    participant U as Browser
    participant W as Next.js :3000
    participant G as Gateway :8000
    participant DB as SQLite

    U->>W: Navigate to /login
    W->>G: GET /auth/mode
    G-->>W: {mode: "single"|"multi", setup_complete}

    alt Single-User Mode
        U->>W: Enter password only
        W->>G: POST /auth/login-simple {password}
        G->>DB: Verify password (bcrypt)
        G-->>W: JWT access_token
    else Multi-User Mode
        U->>W: Enter email + password
        W->>G: POST /auth/login {email, password}
        G->>DB: Lookup user, verify password (bcrypt)
        G-->>W: JWT access_token
    end

    W->>W: Store JWT in localStorage (molebie_token)

    U->>W: Navigate to /chat
    W->>W: Read JWT from localStorage
    W->>G: GET /chat/sessions<br/>Authorization: Bearer JWT
    G->>G: Decode JWT (HS256)<br/>Extract sub (user_id), email
    G->>G: Attach user_id to request context
    G-->>W: 200 OK + session list`,
    details: [
      "Gateway-managed auth — no external auth provider (Supabase removed)",
      "JWTs signed with HS256 using a configurable secret",
      "Gateway decodes JWT locally (no external round-trip)",
      "Single-user mode: password-only login, default user ID 00000000-0000-0000-0000-000000000001",
      "Multi-user mode: email + password registration and login",
      "Token expiry: 7 days, 401 triggers automatic logout + redirect",
      "All database queries filter by user_id for data isolation",
      "User registration via POST /auth/register (multi-user mode only)",
    ],
  },
  {
    id: "inference-routing",
    number: "04",
    title: "Inference Mode Routing",
    description:
      "Three thinking modes with automatic fallback. Supports MLX, Ollama, vLLM, llama.cpp, and OpenAI-compatible backends.",
    diagram: `flowchart TD
    Req["Incoming Chat Request"]
    Backend{"Backend type?"}
    Mode{"mode parameter?"}

    Req --> Backend
    Backend -->|"MLX"| MLX["API prefix: empty string\\nmlx_vlm.server / mlx_lm.server"]
    Backend -->|"Ollama / vLLM / llama.cpp"| OAI["API prefix: /v1\\nOpenAI-compatible endpoint"]
    Backend -->|"OpenAI API"| Cloud["HTTPS + Bearer token\\nAPI prefix: /v1"]

    MLX --> Mode
    OAI --> Mode
    Cloud --> Mode

    Mode -->|"instant"| Instant["Instant Tier\\n:8081\\nFast, no CoT"]
    Mode -->|"thinking"| Thinking["Thinking Tier\\n:8080\\nbudget: 2048 tokens"]
    Mode -->|"thinking_harder"| Harder["Thinking Tier\\n:8080\\nbudget: 8192 tokens\\nmax_tokens: 28672"]

    Thinking -->|"fails?"| Fallback{"Fallback enabled?"}
    Harder -->|"fails?"| Fallback
    Fallback -->|"yes"| Instant
    Fallback -->|"no"| Error["Return Error"]

    Instant --> Resp["Return Response"]
    Thinking --> Resp
    Harder --> Resp`,
    details: [
      "THINKING_DAILY_REQUEST_LIMIT caps heavy inference per user per day (default: 100)",
      "THINKING_MAX_CONCURRENT limits parallel thinking requests (default: 2)",
      "Fallback to instant tier is configurable",
      "Cold-start timeout: 60s (configurable)",
      "Supported backends: MLX (Apple Silicon), Ollama, vLLM, llama.cpp, OpenAI API",
    ],
  },
  {
    id: "web-search",
    number: "05",
    title: "Web Search Pipeline",
    description:
      "LLM-powered intent classification triggers self-hosted SearXNG search with full content extraction, deduplication, and trust scoring.",
    diagram: `flowchart TD
    Msg["User Message"]
    Classify{"LLM Intent Classification\\n(needs web search?)"}

    Msg --> Classify
    Classify -->|"no"| Skip["Skip search"]
    Classify -->|"yes"| Query["Generate search query"]
    Query --> SearX["SearXNG :8888\\n(self-hosted metasearch)"]
    SearX --> Results["Top results\\n(title, URL, snippet)"]
    Results --> Fetch["Fetch full content\\n(top pages via trafilatura)"]
    Fetch --> Dedup["Duplicate detection\\n(Jaccard similarity)"]
    Dedup --> Trust["Source trust classification\\n(official, reference, forum, news, web)"]
    Trust --> Inject["Inject as evidence\\ninto system prompt"]
    Inject --> Citations["Source citations\\nrendered in UI"]`,
    details: [
      "Powered by SearXNG — self-hosted, privacy-respecting, no API keys needed",
      "LLM intent classification decides whether a query needs web results",
      "Fetches full page content for top results via trafilatura (up to 2000 chars each)",
      "Source trust classification: official, reference, forum, news, web",
      "Duplicate detection via Jaccard similarity on word sets",
      "Smart search triggers: temporal keywords, news, weather, commerce, explicit intent",
    ],
  },
  {
    id: "rag-pipeline",
    number: "06",
    title: "RAG Pipeline",
    description:
      "Hybrid vector + BM25 retrieval with cross-encoder reranking. Documents are chunked, embedded, and indexed for accurate retrieval.",
    diagram: `flowchart TD
    Upload["User uploads PDF/DOCX/TXT/MD"]
    Extract["DocumentProcessor\\nextract text"]
    Chunk["Split into chunks\\n(1024 chars, 128 overlap)\\nMarkdown-aware splitting"]
    Embed["Generate embeddings\\n(sentence-transformers)"]
    FTS["Generate FTS5 tokens\\n(full-text search)"]
    Context["Contextual retrieval\\n(LLM-generated prefixes)"]
    Store["Store in document_chunks\\n+ document_chunks_vec\\n+ document_chunks_fts"]

    Upload --> Extract --> Chunk --> Embed --> Store
    Chunk --> FTS --> Store
    Chunk --> Context --> Store

    Query["User asks a question"]
    Rewrite["LLM query rewriting\\n(contextual rewrite)"]
    VecSearch["Vector similarity search\\n(sqlite-vec)"]
    TextSearch["BM25 full-text search\\n(FTS5)"]
    RRF["Reciprocal Rank Fusion\\n(weight: 0.7 vector / 0.3 text)"]
    Rerank["Cross-encoder reranking\\n(ms-marco-MiniLM-L6-v2)"]
    TopK["Top 5 chunks to system prompt\\n(max 12000 chars)"]

    Query --> Rewrite
    Rewrite --> VecSearch
    Rewrite --> TextSearch
    VecSearch --> RRF
    TextSearch --> RRF
    RRF --> Rerank --> TopK`,
    details: [
      "Hybrid search: vector similarity (sqlite-vec) + BM25 full-text (FTS5) fused via RRF",
      "Cross-encoder reranking for final relevance scoring (ms-marco-MiniLM-L6-v2)",
      "Contextual retrieval: LLM generates context prefixes for each chunk (+35-49% retrieval quality)",
      "LLM query rewriting to improve retrieval",
      "Session document attachments: files can be attached to specific sessions and injected directly into the system prompt",
      "Embedding model: configurable (default: Orange/orange-nomic-v1.5-1536, 1536-dim)",
      "RAG metrics: performance logging with quality tracking via rag_query_metrics table",
      "Match count: 20 candidates, threshold: 0.3, max context: 12000 chars",
    ],
  },
  {
    id: "voice-pipeline",
    number: "07",
    title: "Voice Pipeline",
    description:
      "Full voice conversation with speech-to-text via Whisper and streaming text-to-speech via Kokoro. Two voice modes: STT-only and Chat mode with auto-send.",
    diagram: `sequenceDiagram
    participant U as Browser
    participant W as Next.js :3000
    participant G as Gateway :8000
    participant STT as Whisper (faster-whisper)
    participant TTS as Kokoro TTS :8880
    participant LLM as Inference Tier

    Note over U,W: Voice Conversation Mode
    U->>W: Press mic button (STT or Chat mode)
    W->>W: Record audio (Web Audio API)<br/>+ silence detection (auto-stop)
    W->>G: POST /chat/transcribe (audio file)
    G->>STT: Transcribe audio
    STT-->>G: Transcribed text
    G-->>W: {text}

    W->>G: POST /chat/stream {message: transcribed text}
    G->>LLM: Generate response (streaming)
    LLM-->>G: Response text
    G-->>W: SSE response

    W->>G: POST /chat/tts {text, voice, speed}
    G->>TTS: Synthesize speech
    TTS-->>G: Audio (WAV)
    G-->>W: Audio response
    W->>U: Play audio response<br/>(streaming TTS — sentences play as they arrive)
    W->>W: Auto-restart microphone for next turn`,
    details: [
      "STT: faster-whisper (local Whisper inference, 'tiny' model ~75MB, CTranslate2 backend) via POST /chat/transcribe",
      "TTS: Kokoro FastAPI (Docker, CPU) with 12 voice options (British/American, male/female)",
      "Two voice modes: STT-only mode (transcribe without auto-send) and Chat mode (auto-send + streaming TTS response)",
      "Silence detection: audio threshold-based auto-stop recording",
      "Stop commands: 'stop', 'goodbye', 'bye', 'that's all', etc.",
      "Streaming TTS: sentences play as the LLM generates them (continuous audio)",
      "Voice settings: configurable voice, speed (0.5x-2.0x), auto-read toggle",
      "Speaker verification (optional): MFCC-based voice embeddings, 3-sample enrollment via /chat/voice-enroll",
    ],
  },
  {
    id: "database-schema",
    number: "08",
    title: "Database Schema",
    description:
      "SQLite database with WAL mode, sqlite-vec for vector search, and FTS5 for full-text search. All data stored locally with user isolation.",
    diagram: `erDiagram
    users {
        text id PK
        text email
        text password_hash
        text name
        text created_at
        text updated_at
    }

    chat_sessions {
        text id PK
        text user_id FK
        text title
        integer is_archived
        integer is_pinned
        text summary
        text created_at
        text updated_at
    }

    chat_messages {
        text id PK
        text session_id FK
        text user_id FK
        text role
        text content
        text reasoning_content
        text mode_used
        integer tokens_used
        text created_at
    }

    message_images {
        text id PK
        text message_id FK
        text user_id FK
        text storage_path
        text filename
        text mime_type
        integer file_size
        text created_at
    }

    documents {
        text id PK
        text user_id FK
        text filename
        text storage_path
        text file_type
        integer file_size
        text status
        text created_at
        text processed_at
    }

    document_chunks {
        text id PK
        text document_id FK
        text user_id FK
        text content
        text content_contextualized
        integer chunk_index
        text metadata
        text created_at
    }

    session_documents {
        text id PK
        text session_id FK
        text user_id FK
        text filename
        text content
        integer file_size
        text created_at
    }

    user_memories {
        text id PK
        text user_id FK
        text content
        text category
        text source_session_id
        integer access_count
        text last_accessed_at
        text created_at
        text updated_at
    }

    rag_query_metrics {
        text id PK
        text user_id FK
        text query_text
        integer num_candidates
        integer unique_documents
        real top_similarity
        real avg_similarity
        real top_rrf_score
        real top_rerank_score
        real score_spread
        integer hybrid_enabled
        integer reranker_enabled
        real t_embed_ms
        real t_search_ms
        real t_rerank_ms
        real t_total_ms
        text created_at
    }

    message_sources {
        text id PK
        text message_id FK
        text url
        text title
        text created_at
    }

    users ||--o{ chat_sessions : "owns"
    chat_sessions ||--o{ chat_messages : "contains"
    users ||--o{ chat_messages : "authored by"
    chat_messages ||--o{ message_images : "has attachments"
    users ||--o{ message_images : "owns"
    users ||--o{ documents : "uploads"
    documents ||--o{ document_chunks : "split into"
    users ||--o{ document_chunks : "owns"
    chat_sessions ||--o{ session_documents : "has attached"
    users ||--o{ session_documents : "owns"
    users ||--o{ user_memories : "has memories"
    chat_messages ||--o{ message_sources : "has sources"`,
    details: [
      "SQLite with WAL mode enabled for concurrent reads",
      "Foreign key constraints enforced for referential integrity",
      "User data isolation enforced at query level (every query filters by user_id)",
      "sqlite-vec virtual tables (document_chunks_vec, user_memories_vec) for vector similarity search",
      "FTS5 virtual table (document_chunks_fts) for BM25 full-text search",
      "RRF hybrid search combining vector + BM25 results",
      "mode_used supports: instant, thinking, thinking_harder",
      "message_sources stores web search source URLs/titles per assistant message",
      "user_memories stores cross-session facts with categories: preference, background, project, instruction",
      "user_memories has access tracking (count + last_accessed_at) for relevance decay",
      "rag_query_metrics tracks RAG search performance with detailed timing breakdown",
      "Schema auto-initialized on first gateway start via init_database()",
    ],
  },
  {
    id: "api-routes",
    number: "09",
    title: "Gateway API Routes",
    description:
      "Complete REST API surface of the FastAPI gateway. All routes require JWT authentication except /auth endpoints.",
    diagram: `flowchart LR
    subgraph auth ["/auth"]
        A1["GET /mode"]
        A2["POST /register"]
        A3["POST /login"]
        A4["POST /login-simple"]
        A5["GET /me"]
    end

    subgraph health ["/health"]
        H1["GET /"]
        H2["GET /auth"]
        H3["GET /inference"]
        H4["GET /deep"]
    end

    subgraph chat ["/chat"]
        C1["POST / (full response)"]
        C2["POST /stream (SSE)"]
        C3["GET /sessions"]
        C4["POST /sessions"]
        C5["GET /sessions/:id/messages"]
        C6["PATCH /sessions/:id"]
        C7["PATCH /sessions/:id/pin"]
        C8["DELETE /sessions/:id"]
        C9["GET /image/:image_id"]
        C10["GET /sessions/:id/images"]
        C11["POST /transcribe (STT)"]
        C12["POST /tts"]
        C13["POST /voice-enroll"]
        C14["GET /voice-profile"]
        C15["DELETE /voice-profile"]
    end

    subgraph docs ["/documents"]
        D1["POST /upload"]
        D2["GET / (list)"]
        D3["DELETE /:id"]
        D4["POST /reindex"]
        D5["POST /sessions/:id/attach"]
        D6["GET /sessions/:id/attachments"]
        D7["DELETE /sessions/:id/attachments/:id"]
        D8["POST /evaluate"]
    end`,
    details: [
      "/auth — Authentication endpoints (login, register, mode detection)",
      "/health — Health checks for gateway, auth validation, inference status, and deep diagnostics",
      "/chat — Core chat operations: messaging, streaming, sessions, voice, TTS, images, voice profiles",
      "/documents — Document upload, listing, deletion, reindexing, session attachment, and RAG evaluation",
      "All /chat and /documents routes require JWT Bearer token",
      "POST /chat/stream is the primary endpoint — returns SSE events",
    ],
  },
  {
    id: "deployment",
    number: "10",
    title: "Deployment Topology",
    description:
      "Flexible deployment across one or more machines. The CLI installer lets users choose how to distribute services. Machines connect via Tailscale VPN or LAN.",
    diagram: `graph LR
    subgraph tailnet [Tailscale VPN Mesh / LAN]
        subgraph server ["This Machine (App Server)"]
            next["Next.js :3000"]
            fastapi["FastAPI :8000"]
            sqlite["SQLite DB"]
            searx["SearXNG :8888"]
            kokoro["Kokoro TTS :8880"]
        end
        subgraph gpu ["Remote LLM Server"]
            thinking["Thinking LLM :8080"]
            instant["Instant LLM :8081"]
        end
    end

    next --- fastapi
    fastapi --- sqlite
    fastapi --- searx
    fastapi --- kokoro
    fastapi ---|"Tailscale/LAN"| thinking
    fastapi ---|"Tailscale/LAN"| instant`,
    details: [
      "All-in-one: Everything on localhost — the default, zero configuration",
      "Frontend + API: Webapp + Gateway on this machine, LLM on a remote GPU machine",
      "LLM server: This machine only runs inference — app + API run elsewhere",
      "Custom: Any combination of services per machine (via CLI 'Custom' option)",
      "Machines connect via Tailscale VPN or LAN — IPs configured during setup",
      "Optional services (SearXNG, Kokoro TTS) always co-located with Gateway",
      "Auto-pull daemon: macOS LaunchAgent polls git and auto-updates on new commits",
    ],
  },
  {
    id: "frontend",
    number: "11",
    title: "Frontend Page Structure",
    description:
      "Next.js 16 App Router with React 19. Dark glass UI theme with responsive mobile design, voice mode, document panel, and rich markdown rendering.",
    diagram: `flowchart TD
    Root["/ (root page.tsx)"]
    Root -->|"authenticated?"| Chat["/chat\\nMain Chat UI"]
    Root -->|"not authenticated"| Login["/login\\nSign In / Sign Up"]

    Login --> AuthMode{"Auth mode?"}
    AuthMode -->|"single"| SingleAuth["Password-only login"]
    AuthMode -->|"multi"| MultiAuth["Email + password\\n(login / register toggle)"]

    Chat --> Sidebar["Session Sidebar\\n(list, search, rename, pin, delete)"]
    Chat --> ChatArea["Chat Area\\n(messages, streaming, images)"]
    Chat --> ModeSelect["Mode Selector\\n(instant / thinking / thinking_harder)"]
    Chat --> VoiceMode["Voice Conversation Mode\\n(STT mode + Chat mode with streaming TTS)"]
    Chat --> DocPanel["Document Panel\\n(upload, attach, RAG brain)"]

    ChatArea --> Markdown["react-markdown\\n+ syntax highlighting\\n+ KaTeX math"]
    ChatArea --> ThinkBlock["Collapsible Reasoning\\n(think tag parser)"]
    ChatArea --> Sources["Web Search Citations\\n(source links)"]
    ChatArea --> ImageView["Image Attachments\\n(paste/drag-drop/upload)"]
    ChatArea --> Export["Export as Markdown"]
    ChatArea --> Regen["Regenerate Last Response"]`,
    details: [
      "Frontend stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Geist Mono font, dark glass UI theme with green accents",
      "Voice conversation mode with STT-only and Chat (auto-send + streaming TTS) modes",
      "Document upload/attachment for RAG and per-session context",
      "Image upload via paste, drag-and-drop, or file picker (stored locally)",
      "Web search source citations with clickable links",
      "KaTeX math rendering and syntax-highlighted code blocks",
      "Session pinning/favoriting and search (when 5+ sessions)",
      "Export conversations as Markdown",
      "Regenerate last assistant response",
      "Responsive mobile design with drawer sidebar",
    ],
  },
  {
    id: "cli-tool",
    number: "12",
    title: "CLI Tool — molebie-ai",
    description:
      "Python CLI built with Typer + Rich. Handles installation, configuration, service management, model downloads, and diagnostics.",
    diagram: `flowchart TD
    Install["molebie-ai install"]
    Run["molebie-ai run"]
    Doctor["molebie-ai doctor"]
    Status["molebie-ai status"]
    Config["molebie-ai config show/set/list-backends"]
    Feature["molebie-ai feature list/add/remove"]
    Model["molebie-ai model download/remove/start/stop/list"]

    Install --> Wizard["8-step interactive setup wizard"]
    Run --> Start["Start locally-configured services\\n+ health-check remote services\\n(--service, --no-inference)"]
    Doctor --> Diagnose["Check environment health\\n(--fix, --deep)"]
    Status --> Show["Show config + service health"]
    Model --> ModelMgmt["Download/remove/start/stop LLM models"]`,
    details: [
      "Framework: Python + Typer + Rich",
      "Config storage: .molebie/config.json (version 3, auto-migrates from v2)",
      "8-step install wizard: system check → deployment layout → inference backend → model profile → features → review → install → complete",
      "Deployment presets: All-in-one, Frontend + API, LLM server, Custom",
      "Auto-generates .env.local from CLI config (including random JWT secret)",
      "Smart install: only installs dependencies for services running on this machine",
      "Service manager: starts/stops only locally-configured services, health-checks remote ones",
      "Feature management: enable/disable voice, search, RAG services",
      "Model management: download, remove, start, and stop LLM models per backend",
      "Doctor: diagnose and optionally fix setup issues (--fix, --deep flags)",
    ],
  },
  {
    id: "memory-summarization",
    number: "13",
    title: "Memory & Summarization",
    description:
      "Cross-session memory extracts and stores user facts/preferences. Rolling conversation summarization manages the context window.",
    diagram: `flowchart TD
    subgraph memory [Cross-Session Memory]
        Msg6["Every 6 messages"]
        Extract["LLM extracts structured facts"]
        Categorize["Categorize:\\npreference / background /\\nproject / instruction"]
        Dedup["Deduplicate via cosine similarity\\n(threshold: 0.9)"]
        StoreM["Store in user_memories\\n+ user_memories_vec"]
        Retrieve["Retrieve top 5 memories\\n(similarity > 0.5)\\nfor system prompt"]
    end

    subgraph summary [Conversation Summarization]
        Trigger["16+ unsummarized messages"]
        Summarize["LLM generates rolling summary\\n(max 300 tokens)"]
        StoreS["Store in chat_sessions.summary"]
        Inject["Inject summary into context\\n(keeps last 10 messages raw)"]
    end

    Msg6 --> Extract --> Categorize --> Dedup --> StoreM
    StoreM -.->|"on next query"| Retrieve
    Trigger --> Summarize --> StoreS --> Inject`,
    details: [
      "Cross-session memory: extracts and stores user facts/preferences across conversations",
      "Categories: preference, background, project, instruction",
      "Deduplication via cosine similarity (threshold: 0.9)",
      "Retrieval: top 5 memories by vector similarity (threshold: 0.5)",
      "Auto-extraction every 6 messages (configurable)",
      "Rolling conversation summaries triggered at 16+ unsummarized messages",
      "Keeps last 10 messages raw (not summarized)",
      "Max 200 memories per user with access tracking for relevance decay",
    ],
  },
  {
    id: "install-wizard",
    number: "14",
    title: "Install Wizard — Full Flow",
    description:
      "The molebie-ai install command runs an 8-step interactive setup wizard. Step 2 determines which services run on this machine vs. remotely, adapting all subsequent steps.",
    diagram: `flowchart TD
    S1["Step 1: System Check\\nCheck RAM, disk, Apple Silicon"]
    S2{"Step 2: Deployment Layout"}

    S1 --> S2
    S2 -->|"All-in-one"| P1["Everything local\\nNo follow-up questions"]
    S2 -->|"Frontend + API"| P2["Gateway + Webapp here\\nAsk: LLM host? (1 Q)"]
    S2 -->|"LLM Server"| P3["Inference only\\nNo follow-up questions"]
    S2 -->|"Custom"| P4["Pick per service Y/n\\n+ host prompts for remotes"]

    P1 --> Config["Config result:\\nrun_inference / run_gateway / run_webapp\\n+ remote host addresses"]
    P2 --> Config
    P3 --> Config
    P4 --> Config

    Config --> S3["Step 3: Inference Backend\\nMLX / Ollama / OpenAI-compatible\\n(auto-select if inference is remote)"]
    S3 --> S4["Step 4: Model Profile\\nlight / balanced / custom\\n(skipped if OpenAI-compatible)"]
    S4 --> S5["Step 5: Optional Features\\nSearch [Y/n] · RAG [Y/n] · Voice\\n(skipped if gateway is remote)"]
    S5 --> S6["Step 6: Review\\nShow all settings in table\\nProceed? [Y/n]"]
    S6 --> S7["Step 7: Installing\\nPrereqs → .env.local → Gateway deps\\n→ Webapp deps → Backend → Embedding → Features"]
    S7 --> S8["Step 8: Complete\\nSummary table\\nStart Molebie AI now? [Y/n]"]`,
    details: [
      "Step 2 presets: All-in-one (everything local, no Qs), Frontend + API (ask LLM host), LLM Server (inference only), Custom (per-service Y/n)",
      "Config result determines: run_inference, run_gateway, run_webapp (true/false) + remote host addresses",
      "Step 3 auto-selects OpenAI-compatible if inference is remote; otherwise detects best local backend (MLX/Ollama)",
      "Step 7 smart install: only installs dependencies for services running on this machine",
      "Service dependency chain: Browser → Webapp (:3000) → Gateway (:8000) → LLM Server (:8080/:8081)",
      "Gateway needs LLM Server address (if remote); Webapp needs Gateway address (if remote); LLM Server needs nothing",
      "Config schema v3: setup_type, run_inference, run_gateway, run_webapp, inference_backend, model_profile, thinking_model, instant_model, search_enabled, rag_enabled, voice_enabled",
      "Config auto-migrates from v2 to v3 on first run",
    ],
  },
];

export const SERVICE_TABLE = [
  { service: "Web App", port: "3000", framework: "Next.js 16", purpose: "Chat UI, auth, voice, documents, images" },
  { service: "Gateway", port: "8000", framework: "FastAPI", purpose: "Auth, routing, DB, inference proxy, RAG, web search, TTS, memory, summarization, SSE streaming" },
  { service: "SQLite DB", port: "—", framework: "sqlite-vec + FTS5", purpose: "Local database with vector + full-text search" },
  { service: "Thinking LLM", port: "8080", framework: "MLX / Ollama / vLLM / OpenAI", purpose: "Deep reasoning with chain-of-thought" },
  { service: "Instant LLM", port: "8081", framework: "MLX / Ollama / vLLM / OpenAI", purpose: "Fast responses, no CoT" },
  { service: "SearXNG", port: "8888", framework: "Docker", purpose: "Self-hosted web search (no API keys)" },
  { service: "Kokoro TTS", port: "8880", framework: "Docker (FastAPI)", purpose: "Text-to-speech (12 voices, CPU)" },
  { service: "Tailscale", port: "—", framework: "VPN mesh", purpose: "Connects server + GPU node (optional)" },
  { service: "CLI", port: "—", framework: "Python (Typer)", purpose: "Setup wizard, service management, model management, diagnostics" },
];
