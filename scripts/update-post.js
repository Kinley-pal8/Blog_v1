const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ntprtcmkkwejpsxvdyne.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cHJ0Y21ra3dlanBzeHZkeW5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE5ODcwNSwiZXhwIjoyMDg5Nzc0NzA1fQ.htS30zJL_I2eEnuFUXHci-1D-IG5TWvoJbvUzYZ7WfY";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updatePost() {
  try {
    // Read the updated blog content
    const blogContent = fs.readFileSync(
      "/home/kp/Desktop/blog/blog.md",
      "utf-8",
    );

    console.log("📖 Fetching NoSQL posts from Supabase...");

    // Find all posts that might be the NoSQL guide
    const { data: posts, error: fetchError } = await supabaseAdmin
      .from("posts")
      .select("id, title, slug, published")
      .ilike("title", "%NoSQL%");

    if (fetchError) {
      console.error("❌ Error fetching posts:", fetchError);
      process.exit(1);
    }

    if (!posts || posts.length === 0) {
      console.log("❌ No NoSQL posts found. Creating new post...");

      // Create a new post
      const { data: newPost, error: createError } = await supabaseAdmin
        .from("posts")
        .insert({
          title: "Beyond SQL — A Complete Guide to NoSQL Databases",
          slug: "beyond-sql-complete-guide-nosql",
          excerpt:
            "DBS201 · Unit I Study Blog - A comprehensive guide to NoSQL databases, their characteristics, types, and applications.",
          content: blogContent,
          cover_image_url: "",
          cover_image_alt: "",
          tags: ["nosql", "database", "dbs201"],
          published: true,
          author_name: "Study Material",
          author_email: "admin@blog.com",
        })
        .select()
        .single();

      if (createError) {
        console.error("❌ Error creating post:", createError);
        process.exit(1);
      }

      console.log("✅ Post created successfully!");
      console.log("📝 Post ID:", newPost.id);
      console.log("📝 Post Title:", newPost.title);
      console.log("📝 Post Slug:", newPost.slug);
      process.exit(0);
    }

    // Update existing post
    const postToUpdate = posts[0];
    console.log(
      `📝 Found post: "${postToUpdate.title}" (${postToUpdate.slug})`,
    );

    const { data: updatedPost, error: updateError } = await supabaseAdmin
      .from("posts")
      .update({
        content: blogContent,
        cover_image_url:
          "https://blog.purestorage.com/wp-content/uploads/2023/08/shutterstock_467410664-1.jpg",
        cover_image_alt: "NoSQL Database Types Overview",
        updated_at: new Date().toISOString(),
      })
      .eq("id", postToUpdate.id)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Error updating post:", updateError);
      process.exit(1);
    }

    console.log("✅ Post updated successfully!");
    console.log("📝 Post ID:", updatedPost.id);
    console.log("📝 Post Title:", updatedPost.title);
    console.log("📝 Updated At:", updatedPost.updated_at);
    console.log("📊 Content Length:", updatedPost.content.length, "characters");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updatePost();
