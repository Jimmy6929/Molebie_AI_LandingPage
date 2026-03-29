import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Molebie AI — Self-Hosted AI Assistant",
  description:
    "Private AI with voice, vision, RAG, and web search. Runs locally. Your data stays yours.",
  openGraph: {
    title: "Molebie AI",
    description:
      "Self-hosted AI assistant with voice conversation, vision, document memory, and web search.",
    url: "https://molebie.ai",
    siteName: "Molebie AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Molebie AI — Self-Hosted AI Assistant",
    description: "Private AI with voice, vision, RAG, and web search.",
  },
  metadataBase: new URL("https://molebie.ai"),
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Molebie AI",
              description:
                "Self-hosted AI assistant with voice, vision, RAG, and web search",
              url: "https://molebie.ai",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "macOS, Linux, Windows (WSL2)",
              license: "https://opensource.org/licenses/MIT",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        {/* Global grid overlay — visible across all pages */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,204,0,0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,204,0,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </body>
    </html>
  );
}
