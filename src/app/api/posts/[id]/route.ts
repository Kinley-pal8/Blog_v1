import { NextResponse, NextRequest } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updatePost, deletePost } from "@/lib/blog-data";

type RouteParams = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updatedPost = await updatePost(id, body);

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Post not found or failed to update" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams },
) {
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
