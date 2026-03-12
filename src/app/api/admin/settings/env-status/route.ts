import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    ADMIN_EMAILS: !!process.env.ADMIN_EMAILS,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_SERVICE_ACCOUNT_KEY: !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
    GOOGLE_SEARCH_CONSOLE_SITE: !!process.env.GOOGLE_SEARCH_CONSOLE_SITE,
    PAGESPEED_API_KEY: !!process.env.PAGESPEED_API_KEY,
    INDEXNOW_API_KEY: !!process.env.INDEXNOW_API_KEY,
  });
}
