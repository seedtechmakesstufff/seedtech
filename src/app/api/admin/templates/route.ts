import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { listTemplates, getTemplate, applyTemplateVars } from "@/lib/templates";

/**
 * GET /api/admin/templates — List available site templates.
 * GET /api/admin/templates?slug=msp&region=NJ — Preview a template with variables applied.
 */
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  // If slug provided, return full template preview
  if (slug) {
    const template = getTemplate(slug);
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    const region = searchParams.get("region") || "";
    const applied = applyTemplateVars(template, { region });
    return NextResponse.json({ template: applied });
  }

  // Otherwise list all templates
  return NextResponse.json({ templates: listTemplates() });
}
