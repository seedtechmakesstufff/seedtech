/**
 * POST /api/admin/email/test-connection
 * Sends a live ping to Resend to verify the API key works.
 * Optionally verifies the sending domain is in good standing.
 */
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: false,
      message: "RESEND_API_KEY is not set in your environment.",
    });
  }

  try {
    // Hit Resend /domains to verify the key works and see domain status
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({ ok: false, message: "API key is invalid or has insufficient permissions." });
    }

    if (!res.ok) {
      return NextResponse.json({ ok: false, message: `Resend returned ${res.status}` });
    }

    const data = await res.json();
    const domains: { name: string; status: string }[] = data?.data ?? [];

    const verifiedDomains = domains.filter((d) => d.status === "verified").map((d) => d.name);
    const pendingDomains  = domains.filter((d) => d.status !== "verified").map((d) => d.name);

    return NextResponse.json({
      ok: true,
      keyMasked: `${apiKey.slice(0, 7)}…${apiKey.slice(-4)}`,
      verifiedDomains,
      pendingDomains,
      domainCount: domains.length,
      message:
        verifiedDomains.length > 0
          ? `Connected. ${verifiedDomains.length} verified domain(s): ${verifiedDomains.join(", ")}`
          : domains.length === 0
          ? "Connected — no domains added yet."
          : `Connected — domain(s) pending verification: ${pendingDomains.join(", ")}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      message: `Connection error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}
