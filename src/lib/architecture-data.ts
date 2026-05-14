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
      "Bird's-eye view of Molebie AI's six service layers: Frontend (Webapp + CLI), Gateway (FastAPI control plane), Inference tiers, Data layer (SQLite + sqlite-vec + FTS5), optional Docker sidecars (SearXNG + Kokoro), and an offline Training pipeline. Flexible single- or multi-machine deployment with the gateway as the central orchestrator.",
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

    subgraph cliMonitor ["CLI & Observability"]
        CLI["molebie-ai CLI\\n(Typer + Rich)"]
        Monitor["molebie-ai monitor\\n9-panel TUI\\npolls /metrics/live"]
    end

    subgraph llmServices ["LLM Server (GPU / Apple Silicon)"]
        ThinkingLLM["Inference — Thinking Tier\\nQwen 3.5 9B\\n(MLX / Ollama / vLLM)\\n:8080"]
        InstantLLM["Inference — Instant Tier\\nQwen 3.5 4B\\n(MLX / Ollama / vLLM)\\n:8081"]
    end

    subgraph training ["Offline Training (sidecar)"]
        TrainPipe["LoRA + ORPO\\neval gates"]
    end

    User -->|"HTTPS :3000"| WebApp
    WebApp -->|"REST + JWT\\n:8000"| Gateway
    Gateway -->|"aiosqlite"| SQLiteDB
    Gateway -->|"File I/O"| LocalStorage
    Gateway -->|"HTTP /v1/chat/completions\\nvia Tailscale/LAN :8080"| ThinkingLLM
    Gateway -->|"HTTP /v1/chat/completions\\nvia Tailscale/LAN :8081"| InstantLLM
    Gateway -->|"HTTP :8888"| SearXNG
    Gateway -->|"HTTP :8880"| KokoroTTS
    Monitor -.->|"GET /metrics/live (loopback)"| Gateway
    CLI -.->|"install / run / doctor"| Gateway
    TrainPipe -.->|"adapter weights"| ThinkingLLM`,
    details: [
      "Six service layers: Frontend, Gateway, Inference, Data, Optional sidecars, Offline training",
      "Flexible deployment: services can all run on one machine or be distributed freely across machines",
      "Core services: Webapp (Next.js), Gateway (FastAPI + SQLite), LLM Server (MLX/Ollama/vLLM/llama.cpp)",
      "Default LLMs: Qwen 3.5 9B Thinking + Qwen 3.5 4B Instant, swappable via molebie-ai model",
      "Optional Docker services (SearXNG, Kokoro TTS) co-located with Gateway",
      "No Supabase dependency — all data stored locally in SQLite with sqlite-vec + FTS5",
      "All inter-service communication is HTTP; no message queues or gRPC",
      "Gateway is the central orchestrator — routes to inference, RAG, verification, web search, TTS, memory, summarization, and database",
      "molebie-ai CLI manages setup, configuration, model lifecycle, and the live monitor TUI",
      "Live metrics are loopback-only (127.0.0.1) — never exposed externally",
      "Background probes (system_probe, backend_probe, storage_probe) feed live state into MetricsRegistry",
    ],
  },
  {
    id: "request-flow",
    number: "02",
    title: "Request Flow — Chat Completion",
    description:
      "The main user-facing flow when sending a chat message — JWT auth, parallel context enrichment (web, RAG, memory), SSE streaming, optional verification gates, and background memory/summarization tasks.",
    diagram: `sequenceDiagram
    participant U as Browser
    participant W as Next.js :3000
    participant G as Gateway :8000
    participant DB as SQLite
    participant S as SearXNG :8888
    participant RAG as RAG Pipeline
    participant MEM as Memory Service
    participant LLM as Inference Tier
    participant V as Verification Gates

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
        G->>RAG: Hybrid search (sqlite-vec + FTS5 → RRF → rerank → U-shape)
        RAG-->>G: Relevant chunks with [S#] labels
    and
        G->>MEM: Retrieve relevant user memories
        MEM-->>G: Top 5 memories (by similarity)
    and
        G->>DB: GET session_documents (attached files)
        DB-->>G: Document content
    end

    G->>G: Build system prompt with evidence summary

    G->>LLM: POST /v1/chat/completions<br/>{model, messages[], stream:true,<br/>enable_thinking, thinking_budget, images[]}

    loop SSE Streaming
        LLM-->>G: data: {delta.content, delta.reasoning_content}
        G-->>W: data: {delta.content} (tag-straddle defense)
        W-->>U: Render markdown + KaTeX incrementally
    end

    LLM-->>G: data: [DONE]
    G->>G: Strip think tags, extract reasoning_content

    opt Verification Gates (opt-in)
        G->>V: Citation validation + Grounding Judge (if RAG used)
        G->>V: CoVe / SelfCheckGPT (if enabled)
        V-->>G: Response with [?] markers on uncertain claims
    end

    G->>DB: INSERT chat_message (role=assistant, content, reasoning_content, mode_used)

    par Background Tasks
        G->>MEM: Extract memories (every 6 messages)
    and
        G->>G: Summarize conversation (if 16+ unsummarized)
    end

    G-->>W: data: [DONE]
    W->>W: Parse think tags, show reasoning toggle
    W-->>U: Final rendered response with citations`,
    details: [
      "Parallel context enrichment: web search, RAG, memory, and session documents all run simultaneously",
      "SSE streaming delivers tokens incrementally; tag-straddle defense ensures think-tag chunks never leak",
      "Verification gates are opt-in: Grounding Judge, CoVe, and SelfCheckGPT add [?] markers without rewriting",
      "Background tasks (memory extraction, summarization) run after each response",
      "JWT authentication on every request with user-scoped data isolation",
      "Evidence from web, RAG, memory, and attached documents is injected into the system prompt as labelled sources",
      "Gateway bootstraps via create_app() with a FastAPI lifespan that preloads inference, embedding, and reranker models — first request isn't a cold start",
      "CORS middleware allows RFC1918 + Tailscale CGNAT (100.64.0.0/10) — reachable on the tailnet without being public",
      "sse_split.split_oversized_sse_delta() splits oversized SSE chunks while preserving <think> tag boundaries (tag-straddle defense)",
      "_strip_think_in_messages strips reasoning_content from history before re-feeding it to the model",
      "INFERENCE_THINKING_AUTO_DISABLE_FOR_RAG auto-downgrades Thinking → Instant when RAG context is already rich",
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
      "Gateway-managed auth — no external auth provider",
      "JWTs signed with HS256 using a configurable secret (auto-generated by the install wizard)",
      "Gateway decodes JWT locally — no external round-trip",
      "Single-user mode: password-only login, default user ID 00000000-0000-0000-0000-000000000001",
      "Multi-user mode: email + password registration and login with full row-level isolation",
      "Token expiry: 7 days; 401 triggers automatic logout + redirect",
      "Every database query filters by user_id — isolation enforced at the query layer",
      "User registration via POST /auth/register (multi-user mode only)",
    ],
  },
  {
    id: "inference-routing",
    number: "04",
    title: "Inference Mode Routing",
    description:
      "Three thinking modes with automatic fallback. Backend abstraction spans MLX (text + vision), Ollama, vLLM, llama.cpp, and OpenAI-compatible providers.",
    diagram: `flowchart TD
    Req["Incoming Chat Request"]
    Backend{"Backend type?"}
    Mode{"mode parameter?"}

    Req --> Backend
    Backend -->|"MLX (text)"| MLXLM["mlx_lm.server\\nQwen 3.5 4B / 9B\\nAPI prefix: empty"]
    Backend -->|"MLX (vision)"| MLXVLM["mlx_vlm.server\\nQwen 3.5-VL\\nAPI prefix: empty"]
    Backend -->|"Ollama / vLLM / llama.cpp"| OAI["OpenAI-compatible\\nAPI prefix: /v1"]
    Backend -->|"OpenAI API (cloud)"| Cloud["HTTPS + Bearer token\\nAPI prefix: /v1"]

    MLXLM --> Mode
    MLXVLM --> Mode
    OAI --> Mode
    Cloud --> Mode

    Mode -->|"instant"| Instant["Instant Tier\\nQwen 3.5 4B\\n:8081\\nFast, no CoT"]
    Mode -->|"thinking"| Thinking["Thinking Tier\\nQwen 3.5 9B\\n:8080\\nbudget: 2048 tokens"]
    Mode -->|"thinking_harder"| Harder["Thinking Tier\\nQwen 3.5 9B\\n:8080\\nbudget: 8192 tokens\\nmax_tokens: 28672"]

    Thinking -->|"fails?"| Fallback{"Fallback enabled?"}
    Harder -->|"fails?"| Fallback
    Fallback -->|"yes"| Instant
    Fallback -->|"no"| Error["Return Error"]

    Instant --> Resp["Return Response"]
    Thinking --> Resp
    Harder --> Resp`,
    details: [
      "Default models: Qwen 3.5 4B (Instant) and Qwen 3.5 9B (Thinking), swappable via molebie-ai model",
      "MLX has two server variants: mlx_lm (text) and mlx_vlm (vision-language)",
      "Ollama / vLLM / llama.cpp all expose an OpenAI-compatible /v1 surface",
      "THINKING_DAILY_REQUEST_LIMIT caps heavy inference per user per day (default: 100)",
      "THINKING_MAX_CONCURRENT limits parallel thinking requests (default: 2)",
      "Auto-fallback from Thinking → Instant on cold-start failure or timeout",
      "Cold-start timeout: 60s (configurable)",
      "_build_payload() assembles the OpenAI-compatible request body: temperature, top_p, top_k, presence/repetition penalty, thinking_budget",
      "_routing_mode picks the tier; INFERENCE_THINKING_AUTO_DISABLE_FOR_RAG flips Thinking → Instant when RAG context is rich",
      "Thinking-Harder explicit ceilings: max_tokens=28672, thinking_budget=8192 (configurable)",
    ],
  },
  {
    id: "web-search",
    number: "05",
    title: "Web Search Pipeline",
    description:
      "LLM-powered intent classification triggers self-hosted SearXNG search with full content extraction via trafilatura, deduplication, and trust scoring.",
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
    Trust --> Inject["Inject as evidence\\nwith [S#] labels"]
    Inject --> Citations["Source citations\\nrendered in UI"]`,
    details: [
      "Powered by SearXNG — self-hosted, privacy-respecting, no API keys",
      "LLM intent classification decides whether a query needs web results",
      "Fetches full page content for top results via trafilatura (up to 2000 chars each)",
      "Source trust classification: official, reference, forum, news, web",
      "Duplicate detection via Jaccard similarity on word sets",
      "Smart search triggers: temporal keywords, news, weather, commerce, explicit intent",
      "Sources persisted in message_sources for later citation rendering",
    ],
  },
  {
    id: "rag-pipeline",
    number: "06",
    title: "RAG Pipeline",
    description:
      "Five-stage retrieval — rewrite → embed → hybrid search (vector + BM25) → RRF fusion → rerank → U-shape reorder. Backed by Qwen3-Embedding-0.6B and Anthropic-style contextual retrieval (+35–49% quality).",
    diagram: `flowchart TD
    Upload["User uploads PDF/DOCX/TXT/MD"]
    Extract["DocumentProcessor\\nextract text"]
    Chunk["Split into chunks\\n(512 chars, 64 overlap)\\nMarkdown-aware splitting"]
    Embed["Generate embeddings\\nQwen3-Embedding-0.6B"]
    FTS["Generate FTS5 tokens"]
    Context["Contextual retrieval\\n(LLM-generated prefixes)"]
    Store["Store in document_chunks\\n+ document_chunks_vec (sqlite-vec)\\n+ document_chunks_fts (FTS5)"]

    Upload --> Extract --> Chunk --> Embed --> Store
    Chunk --> FTS --> Store
    Chunk --> Context --> Store

    Query["User asks a question"]
    Rewrite["LLM query rewriting\\n(optional contextual rewrite)"]
    VecSearch["Vector similarity\\n(sqlite-vec)"]
    TextSearch["BM25 full-text\\n(FTS5)"]
    RRF["Reciprocal Rank Fusion\\n+ threshold filter (0.3)"]
    Rerank["Cross-encoder rerank\\nQwen3-Reranker-0.6B"]
    Reorder["U-shape reorder\\n(lost-in-the-middle fix,\\nLiu 2023)"]
    Format["Format with [S#] labels\\nmax 12000 chars"]

    Query --> Rewrite
    Rewrite --> VecSearch
    Rewrite --> TextSearch
    VecSearch --> RRF
    TextSearch --> RRF
    RRF --> Rerank --> Reorder --> Format`,
    details: [
      "Five-stage retrieval: rewrite → embed → hybrid search → RRF fusion → rerank → U-shape reorder",
      "Hybrid: parallel vector (sqlite-vec) + BM25 (FTS5) fused via Reciprocal Rank Fusion",
      "Reranker: Qwen3-Reranker-0.6B (default); falls back to ms-marco-MiniLM-L6-v2 cross-encoder",
      "Contextual retrieval (Anthropic technique): +35–49% retrieval quality lift over plain vector RAG",
      "U-shape reorder addresses 'lost in the middle' (Liu 2023): most relevant chunks at start and end",
      "Defaults: 512-char chunks, 64-char overlap, 30 candidates, 0.3 threshold, 12000 max context chars",
      "Embedding: Qwen3-Embedding-0.6B (1024-dim) — auto-downloaded via molebie-ai model",
      "Session document attachments inject directly into the system prompt (bypass RAG)",
      "Per-query metrics persisted to rag_query_metrics for quality monitoring",
      "Entry point: retrieve_context(user_id, query, limit, threshold, conversation_context) — short-circuits via user_has_documents check first",
      "LLM query rewriting has a 3s hard timeout — falls back to the original query if it stalls",
      "Config vars: rag_vector_weight=0.7, rag_text_weight=0.3, rag_match_threshold=0.3, rag_max_context_chars=12000",
      "compute_retrieval_confidence labels each query NONE / LOW / MODERATE / HIGH; _confidence_directive appends a posture instruction (no NO-REFUSE anti-pattern)",
      "Routing mode (lookup vs generative): explicit lookup patterns override the model's default behaviour",
      "Contextual prefix budget: max 150 tokens per chunk",
      "format_context() emits [S#]-labelled chunks so citation validation downstream can match them",
    ],
  },
  {
    id: "verification",
    number: "07",
    title: "Verification Pipeline",
    description:
      "A stack of cheap-to-expensive filters that catch hallucinations. Each layer is idempotent and annotates with [?] markers — never silently rewrites. Most layers default off; opt in per conversation when correctness matters.",
    diagram: `flowchart TD
    LLM["LLM Response"]
    Consistency["Self-Consistency Vote\\n(if verifiable query —\\nresample N times,\\nmajority vote)"]
    Citation["Citation Validation\\n(extract [S#], match against\\nRAG chunks; strip orphans)"]
    JudgeCheck{"RAG used + has claims?"}
    Grounding["Grounding Judge\\nDeBERTa-v3-MNLI\\nor reranker-backed claim score"]
    CoVeCheck{"RAG used + long response?"}
    Decompose["Chain-of-Verification (CoVe)\\nDecompose into atomic claims,\\nverify each in isolation"]
    SCCheck{"No RAG context?"}
    Resample["SelfCheckGPT\\nResample at high temp,\\nNLI / token overlap"]
    Done["Annotated Response\\n[?] markers on\\nlow-confidence claims"]

    LLM --> Consistency
    Consistency --> Citation
    Citation --> JudgeCheck
    JudgeCheck -->|"yes"| Grounding
    JudgeCheck -->|"no"| CoVeCheck
    Grounding --> CoVeCheck
    CoVeCheck -->|"yes"| Decompose
    CoVeCheck -->|"no"| SCCheck
    Decompose --> SCCheck
    SCCheck -->|"yes"| Resample
    SCCheck -->|"no"| Done
    Resample --> Done`,
    details: [
      "Ordered cheap → expensive: Self-Consistency → Citation → Grounding Judge → CoVe → SelfCheckGPT",
      "Self-Consistency: re-sample N times for verifiable queries (math, factual) and take majority vote",
      "Citation validation: every [S#] in the response must point to a real RAG chunk; orphans stripped",
      "Grounding Judge: scores each claim against RAG chunks via DeBERTa-v3-MNLI entailment or reranker-backed similarity",
      "Chain-of-Verification (CoVe): decomposes long answers into atomic claims and verifies each in isolation against the same context",
      "SelfCheckGPT: when no RAG context exists, resamples at high temperature and checks for consistency via NLI or token overlap",
      "Each layer is idempotent — annotates with [?] markers, never silently rewrites the response",
      "Most layers default off — opt in per conversation when correctness matters more than speed",
      "Per-layer gates: should_judge, should_verify (CoVe), should_selfcheck — each returns a bool from response + context state",
      "Claim extraction (j_extract): rule-based — numbers, URLs, dates, proper-noun pairs",
      "Claim routing (j_route): match cited [S#] first → token-overlap → fallback to first chunk",
      "Judge config: judge_min_response_chars=200, judge_threshold=0.5",
      "CoVe: decompose via cove_decompose.txt prompt; falls back to rule-based v_decompose_rule if the LLM call fails. cove_max_claims=8, cove_verifier_temperature=0.0",
      "SelfCheck filters trivial claims (s_factual): keeps numbers, dates, URLs, proper-noun pairs. selfcheck_samples=3 at temperature=0.7",
      "SelfCheck backends: DeBERTa-v3-MNLI (s_nli, threshold=0.5) with token-overlap fallback (s_fb)",
    ],
  },
  {
    id: "voice-pipeline",
    number: "08",
    title: "Voice Pipeline",
    description:
      "Full voice conversation with speech-to-text via faster-whisper and streaming text-to-speech via Kokoro. Two voice modes: STT-only and Chat mode with auto-send and continuous-audio playback.",
    diagram: `sequenceDiagram
    participant U as Browser
    participant W as Next.js :3000
    participant G as Gateway :8000
    participant STT as faster-whisper
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
      "STT: faster-whisper (CTranslate2-backed local Whisper, 'tiny' model ~75MB) via POST /chat/transcribe",
      "TTS: Kokoro FastAPI (Docker, CPU) with 12 voice options (British/American, male/female)",
      "Two voice modes: STT-only (transcribe without auto-send) and Chat mode (auto-send + streaming TTS response)",
      "Silence detection: audio threshold-based auto-stop recording",
      "Stop commands: 'stop', 'goodbye', 'bye', 'that's all', etc.",
      "Streaming TTS: sentences play as the LLM generates them (continuous audio)",
      "Voice settings: configurable voice, speed (0.5x–2.0x), auto-read toggle",
      "Speaker verification (optional): MFCC-based voice embeddings, 3-sample enrollment via /chat/voice-enroll",
    ],
  },
  {
    id: "database-schema",
    number: "09",
    title: "Database Schema",
    description:
      "SQLite with WAL mode, sqlite-vec for vector search, and FTS5 for full-text search. Three virtual tables sit alongside the base schema; every query filters by user_id for row-level isolation.",
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

    document_chunks_vec {
        integer rowid PK
        blob embedding
    }

    document_chunks_fts {
        integer rowid PK
        text content_fts
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

    user_memories_vec {
        integer rowid PK
        blob embedding
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
    document_chunks ||--|| document_chunks_vec : "vector index"
    document_chunks ||--|| document_chunks_fts : "fts index"
    chat_sessions ||--o{ session_documents : "has attached"
    users ||--o{ session_documents : "owns"
    users ||--o{ user_memories : "has memories"
    user_memories ||--|| user_memories_vec : "vector index"
    chat_messages ||--o{ message_sources : "has sources"`,
    details: [
      "SQLite with WAL mode enabled for concurrent reads",
      "Foreign-key constraints enforced for referential integrity",
      "User data isolation enforced at query level — every query filters by user_id",
      "Three virtual tables: document_chunks_vec (sqlite-vec), document_chunks_fts (FTS5), user_memories_vec (sqlite-vec)",
      "RRF hybrid search combines vector + BM25 results across the virtual tables",
      "mode_used values: instant, thinking, thinking_harder",
      "message_sources persists web search URLs/titles per assistant message",
      "user_memories stores cross-session facts with categories: preference, background, project, instruction",
      "user_memories tracks access_count + last_accessed_at for relevance decay",
      "rag_query_metrics captures per-query timing and quality signals for monitoring",
      "Schema auto-initialised on first gateway start via init_database()",
      "Backup is a single file copy — data/molebie.db",
      "Connection setup via get_connection(data_dir): WAL journal mode, foreign_keys=ON, busy_timeout=5000, synchronous=NORMAL",
      "_schema_version table tracks migrations — the schema auto-upgrades on gateway start",
      "FTS5 sync via SQL triggers — document_chunks_fts stays in lockstep with document_chunks (INSERT/UPDATE/DELETE)",
      "User isolation pattern: every read/write filters by user_id — enforced across the ~40 DatabaseService methods",
      "Vector embeddings: 1024-dim float32 (Qwen3-Embedding-0.6B)",
    ],
  },
  {
    id: "api-routes",
    number: "10",
    title: "Gateway API Routes",
    description:
      "Complete REST surface of the FastAPI gateway, grouped into five route modules. All routes require JWT auth except /auth endpoints, and every request is timed by ObservabilityMiddleware.",
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
    end

    subgraph metrics ["/metrics (loopback only)"]
        M1["GET /live"]
        M2["GET /summary"]
        M3["GET /subsystems"]
    end`,
    details: [
      "Five route groups: /auth, /health, /chat, /documents, /metrics",
      "All /chat and /documents routes require a JWT Bearer token",
      "/metrics is loopback-only (127.0.0.1) — only molebie-ai monitor talks to it",
      "ObservabilityMiddleware records latency per route (http.{METHOD}.{path}) into a bounded ring buffer",
      "FastAPI lifespan preloads models so the first request isn't a cold start",
      "POST /chat/stream is the primary endpoint — returns SSE events with tag-straddle defense",
      "/health includes a 'deep' diagnostics endpoint used by molebie-ai doctor",
      "Path normalization (mw_norm): UUID / hex / numeric segments → :id, e.g. http.GET.chat.sessions.:id.messages",
      "Middleware skip rules (mw_skip): /metrics/live and /health are not timed (avoid self-amplifying noise)",
      "Loopback security: /metrics/* refuses any remote address that isn't 127.0.0.1 — prevents data exfiltration",
    ],
  },
  {
    id: "deployment",
    number: "11",
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
    number: "12",
    title: "Frontend Page Structure",
    description:
      "Next.js 16 App Router with React 19. Dark glass UI theme, responsive mobile design, voice mode, document panel, and rich markdown rendering. The /chat page is the ~1424-LOC main UI; gateway.ts is a ~631-LOC typed API client with an SSE parser and optimistic UI.",
    diagram: `flowchart TD
    Root["/ (root page.tsx)"]
    Root -->|"authenticated?"| Chat["/chat\\nMain Chat UI (~1424 LOC)"]
    Root -->|"not authenticated"| Login["/login\\nSign In / Sign Up"]

    Login --> AuthMode{"Auth mode?"}
    AuthMode -->|"single"| SingleAuth["Password-only login"]
    AuthMode -->|"multi"| MultiAuth["Email + password\\n(login / register toggle)"]

    Chat --> Sidebar["Session Sidebar\\n(list, search, rename, pin, delete)"]
    Chat --> ChatArea["Chat Area\\n(messages, streaming, images)"]
    Chat --> ModeSelect["Mode Selector\\n(instant / thinking / thinking_harder)"]
    Chat --> VoiceMode["Voice Conversation Mode\\n(STT mode + Chat mode with streaming TTS)"]
    Chat --> DocPanel["Document Panel\\n(upload, attach, RAG brain)"]

    ChatArea --> Gateway["gateway.ts API client (~631 LOC)\\n+ SSE parser\\n+ optimistic UI"]
    ChatArea --> Markdown["react-markdown\\n+ syntax highlighting\\n+ KaTeX math"]
    ChatArea --> ThinkBlock["Collapsible Reasoning\\n(think tag parser)"]
    ChatArea --> Sources["Web Search Citations\\n(source links)"]
    ChatArea --> ImageView["Image Attachments\\n(paste/drag-drop/upload)"]
    ChatArea --> Typewriter["useTypewriter hook\\n(char-by-char reveal)"]
    ChatArea --> Export["Export as Markdown"]
    ChatArea --> Regen["Regenerate Last Response"]`,
    details: [
      "Frontend stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, dark glass UI with green accents",
      "/chat page is the main UI (~1424 LOC); auth is gated at the root",
      "gateway.ts (~631 LOC) is a typed API client with SSE parser and optimistic UI",
      "useTypewriter hook reveals streamed tokens character-by-character",
      "Voice conversation mode: STT-only and Chat (auto-send + streaming TTS) modes",
      "Document upload / attachment for RAG and per-session context",
      "Image upload via paste, drag-and-drop, or file picker (stored locally)",
      "Web search source citations with clickable links",
      "KaTeX math rendering and syntax-highlighted code blocks",
      "Session pinning / favouriting and search (when 5+ sessions)",
      "Export conversations as Markdown; regenerate last assistant response",
      "Responsive mobile design with drawer sidebar",
    ],
  },
  {
    id: "cli-tool",
    number: "13",
    title: "CLI Tool — molebie-ai",
    description:
      "Python CLI built with Typer + Rich. Handles installation, configuration, service management, model downloads, diagnostics, and the live monitor TUI.",
    diagram: `flowchart TD
    Install["molebie-ai install"]
    Run["molebie-ai run"]
    Monitor["molebie-ai monitor"]
    Doctor["molebie-ai doctor"]
    Status["molebie-ai status"]
    Config["molebie-ai config show/set/list-backends"]
    Feature["molebie-ai feature list/add/remove"]
    Model["molebie-ai model download/remove/start/stop/list"]

    Install --> Wizard["8-step interactive setup wizard"]
    Run --> Start["Start locally-configured services\\n+ health-check remote services\\n(--service, --no-inference)"]
    Monitor --> Panels["9-panel TUI dashboard\\n(Rich library)\\npolls /metrics/live @ 2Hz"]
    Doctor --> Diagnose["Check environment health\\n(--fix, --deep)"]
    Status --> Show["Show config + service health"]
    Model --> ModelMgmt["Download/remove/start/stop LLM models"]`,
    details: [
      "Framework: Python + Typer + Rich",
      "Config storage: .molebie/config.json (version 3, auto-migrates from v2)",
      "molebie-ai monitor: 9-panel terminal TUI polling /metrics/live at 2Hz over loopback",
      "8-step install wizard: system check → deployment layout → inference backend → model profile → features → review → install → complete",
      "Deployment presets: All-in-one, Frontend + API, LLM server, Custom",
      "Auto-generates .env.local from CLI config (including random JWT secret)",
      "Smart install: only installs dependencies for services running on this machine",
      "Service manager: starts/stops only locally-configured services, health-checks remote ones",
      "Feature management: enable/disable voice, search, RAG services",
      "Model management: download, remove, start, and stop LLM models per backend",
      "Doctor: diagnose and optionally fix setup issues (--fix, --deep flags)",
      "9 monitor panels (named): inference, system, request, activity, quality, subsystems, models, pipeline, in-flight",
      "Polling cadence: 2 Hz (every 500ms) over loopback only",
      "MetricsRegistry: bounded ring buffer (~2 MB worst case) — per-request records, per-tier counters, pipeline events, task counters, model state",
      "subsystem_timer() context manager wraps named ops (rag.embed, rag.search, judge.run, …) and records latency to the registry",
      "CLI helper modules: prerequisite_checker, system_info, network_info, backend_setup, feature_setup, service_manager, env_generator, deep_checker, config_manager",
    ],
  },
  {
    id: "memory-summarization",
    number: "14",
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
      "Config vars: memory_extract_interval=6, memory_dedup_threshold=0.9, memory_top_k=5, memory_retrieval_threshold=0.5, memory_max_per_user=200",
      "Summarizer configs: summary_trigger_threshold=16, summary_recent_messages=10, summary_max_input_chars=8000",
      "Memory extraction runs on the Instant tier (memory_llm_mode=instant) to keep cost low",
    ],
  },
  {
    id: "training-eval",
    number: "15",
    title: "Training & Eval Pipeline",
    description:
      "Offline LoRA + ORPO fine-tuning with a 75% replay manifest and five automated quality gates. Adapters that regress on any gate are auto-discarded — production traffic never sees an untested adapter.",
    diagram: `flowchart TD
    Probe["probe.py\\n75-question probe set\\n5 categories"]
    Baseline["Run baseline\\n(post-tune harness)"]
    Label["label.py\\nfabrication / abstention\\nheuristics + canonical rewrite"]
    Build["build_dataset.py\\nSFT pairs + ORPO triples\\n+ 75% replay manifest"]
    HW{"Hardware?"}

    Probe --> Baseline --> Label --> Build --> HW

    HW -->|"Apple Silicon"| MLX["train_mlx.sh\\nLoRA r=16"]
    HW -->|"CUDA GPU"| Unsloth["train_unsloth.sh\\nLoRA r=16"]

    MLX --> ORPO["ORPO training\\npreference loss over SFT"]
    Unsloth --> ORPO

    ORPO --> Post["Run post-tune\\n(same harness as baseline)"]
    Post --> Eval["eval_lora.py\\ndiff vs baseline"]

    Eval --> Gates["5 Quality Gates\\nTruthfulQA ≤2pp drop\\nFaithfulness ≥0.85\\nRefusal ≥0.7\\nper-category ≤2pp\\noverall ≤2pp"]

    Gates --> Decision{"All gates pass?"}
    Decision -->|"yes"| Keep["KEEP adapter\\n(promote)"]
    Decision -->|"no"| Discard["DISCARD adapter\\n(regression detected)"]`,
    details: [
      "Offline pipeline — production traffic only sees adapters that pass every gate",
      "Probe set: 75 questions covering 5 categories (factual, reasoning, refusal, code, multi-turn)",
      "Golden set: 50 curated queries × 5 categories used for the gate eval",
      "label.py heuristics: fabrication detector (groundedness vs context), abstention detector (refusal quality), canonical rewrite",
      "Dataset mix: SFT pairs (input → preferred output) + ORPO triples (input, chosen, rejected) + 75% replay manifest",
      "75% replay prevents catastrophic forgetting — the LoRA shouldn't unlearn what the base model already knows",
      "SFT: LoRA r=16 — tiny adapter weights, base model untouched",
      "ORPO: preference loss over the SFT pass — sharpens behaviour without a separate reward model",
      "Five gates: TruthfulQA ≤2pp drop, Faithfulness ≥0.85, Refusal ≥0.7, per-category ≤2pp, overall ≤2pp",
      "DISCARD on regression — auto-rejects adapters that regress on any gate",
      "Probe set: 75 questions × 15 categories (fake APIs, fake papers, well-known facts, tool-use, obscure facts, …)",
      "p_baseline captured with all Phase-3 verification layers OFF — gates measure the raw model, not the safety net",
      "Two labeling heuristics: l_heur1 (fabrication detection — groundedness vs context) and l_heur2 (abstention detection — refusal quality)",
      "Canonical abstain rewrite: \"I don't have that in your notes. Want me to web search?\"",
      "75% replay manifest: ≥75% reasoning-heavy content from prior runs to prevent catastrophic forgetting",
      "hyperparams.yaml: LoRA r=16, alpha=32, lr=2e-4, target_modules=q/k/v/o — never 4-bit QLoRA on Qwen3.5",
      "Golden set composition: rag_grounded×15 · adversarial×15 · must_abstain×10 · tool_call×8 · rag_grounded_negative×2 (50 total)",
      "Five named gates: el_g1 TruthfulQA ≤2pp drop · el_g2 Faithfulness ≥0.85 · el_g3 Refusal ≥0.7 · el_g4 per-category ≤2pp · el_g5 overall ≤2pp",
    ],
  },
  {
    id: "install-wizard",
    number: "16",
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
  { service: "SQLite DB", port: "—", framework: "sqlite-vec + FTS5", purpose: "Local database with vector + full-text search; 3 virtual tables for hybrid retrieval" },
  { service: "Thinking LLM", port: "8080", framework: "MLX / Ollama / vLLM / llama.cpp", purpose: "Qwen 3.5 9B — deep reasoning with chain-of-thought" },
  { service: "Instant LLM", port: "8081", framework: "MLX / Ollama / vLLM / llama.cpp", purpose: "Qwen 3.5 4B — fast responses, no CoT" },
  { service: "SearXNG", port: "8888", framework: "Docker", purpose: "Self-hosted web search (no API keys)" },
  { service: "Kokoro TTS", port: "8880", framework: "Docker (FastAPI)", purpose: "Text-to-speech (12 voices, CPU)" },
  { service: "Tailscale", port: "—", framework: "VPN mesh", purpose: "Connects server + GPU node (optional)" },
  { service: "CLI", port: "—", framework: "Python (Typer)", purpose: "Setup wizard, service management, model management, diagnostics" },
  { service: "Live Monitor", port: "—", framework: "Python (Rich TUI)", purpose: "9-panel dashboard polling /metrics/live at 2Hz over loopback" },
];
