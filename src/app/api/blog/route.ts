import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { getAllPosts, createPost } from "@/lib/blog";
import type { BlogPostCreate } from "@/types/blog";

/** GET /api/blog — list all posts (admin only) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

/** POST /api/blog — create a new post */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = (await req.json()) as BlogPostCreate;

  // Basic validation
  if (!data.title || !data.slug || !data.body) {
    return NextResponse.json({ error: "title, slug, and body are required" }, { status: 400 });
  }

  const post = await createPost(data);
  return NextResponse.json(post, { status: 201 });
}
