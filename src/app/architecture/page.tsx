import type { Metadata } from "next";
import { ArchitecturePage } from "@/components/architecture-page";

export const metadata: Metadata = {
  title: "Architecture — Molebie AI",
  description:
    "Complete system architecture of Molebie AI: infrastructure diagrams, request flows, RAG pipeline, voice pipeline, database schema, and deployment topology.",
  openGraph: {
    title: "Molebie AI — Architecture",
    description:
      "13 detailed architecture diagrams covering every layer of the self-hosted AI assistant.",
    url: "https://molebieai.com/architecture",
    siteName: "Molebie AI",
    type: "website",
  },
};

export default function Page() {
  return <ArchitecturePage />;
}
