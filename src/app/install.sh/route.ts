import { NextResponse } from "next/server";

const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/Jimmy6929/Molebie_AI/main/install.sh";

export async function GET() {
  try {
    const res = await fetch(GITHUB_RAW_URL, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch install script", {
        status: 502,
      });
    }

    const script = await res.text();

    return new NextResponse(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300, s-maxage=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch install script", {
      status: 502,
    });
  }
}
