import { NextResponse, NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  getPublishedPosts,
  getAllPosts,
  createPost,
  getBlogStats,
} from "@/lib/blog-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminQuery = searchParams.get("admin") === "true";

  if (adminQuery) {
    const adminStatus = await isAdmin();
    if (!adminStatus) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Return all posts including drafts + stats
    const posts = await getAllPosts();
    const stats = await getBlogStats();
    return NextResponse.json({ posts, stats }, { status: 200 });
  }

  // Return only published posts (public)
  const posts = await getPublishedPosts();
  return NextResponse.json(posts, { status: 200 });
}

export async function POST(request: NextRequest) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 },
      );
    }

    const newPost = await createPost({
      title: body.title,
      excerpt: body.excerpt || "",
      slug: body.slug,
      content: body.content,
      cover_image_url: body.cover_image_url || "",
      cover_image_alt: body.cover_image_alt || "",
      tags: body.tags || [],
      published: body.published || false,
    });

    if (!newPost) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 },
      );
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
