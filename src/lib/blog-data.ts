import { supabase, supabaseAdmin } from "./supabase";

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  cover_image_url: string;
  cover_image_alt: string;
  tags: string[];
  published: boolean;
  author_email?: string;
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

// Get all published posts (public query)
export async function getPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
}

// Get single post by slug (public)
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

// Get all posts including drafts (admin only)
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }

  return data || [];
}

// Create new post (admin only)
export async function createPost(
  post: Omit<Post, "id" | "created_at" | "updated_at">,
): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .insert([post])
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return null;
  }

  return data;
}

// Update post (admin only)
export async function updatePost(
  id: string,
  updates: Partial<Omit<Post, "id" | "created_at">>,
): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating post:", error);
    return null;
  }

  return data;
}

// Delete post (admin only)
export async function deletePost(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return false;
  }

  return true;
}

// Get blog stats
export async function getBlogStats(): Promise<{
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalTags: number;
}> {
  const { data, error } = await supabaseAdmin
    .from("posts")
    .select("published, tags");

  if (error) {
    console.error("Error fetching stats:", error);
    return { totalPosts: 0, publishedPosts: 0, draftPosts: 0, totalTags: 0 };
  }

  const posts = data || [];
  const publishedPosts = posts.filter((p) => p.published).length;
  const draftPosts = posts.length - publishedPosts;
  const allTags = new Set<string>();

  posts.forEach((p) => {
    if (Array.isArray(p.tags)) {
      p.tags.forEach((tag) => allTags.add(tag));
    }
  });

  return {
    totalPosts: posts.length,
    publishedPosts,
    draftPosts,
    totalTags: allTags.size,
  };
}
// User Management Functions

// Get user by clerk_id
export async function getUserByClerkId(clerkId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
    return null;
  }

  return data || null;
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user:", error);
    return null;
  }

  return data || null;
}

// Sync user to database (create or update)
export async function syncUserToDatabase(userData: {
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  profile_image_url?: string;
}): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      [
        {
          ...userData,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "clerk_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("Error syncing user:", error);
    return null;
  }

  return data;
}

// Get all users
export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data || [];
}
