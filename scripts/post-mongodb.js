const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ntprtcmkkwejpsxvdyne.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cHJ0Y21ra3dlanBzeHZkeW5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE5ODcwNSwiZXhwIjoyMDg5Nzc0NzA1fQ.htS30zJL_I2eEnuFUXHci-1D-IG5TWvoJbvUzYZ7WfY";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function postMongoDB() {
  try {
    const content = fs.readFileSync(
      "/home/kp/Desktop/Y 3 S 6/DBS302/blog/mongodb.md",
      "utf-8",
    );

    console.log("Checking if MongoDB post already exists...");

    const { data: existing } = await supabaseAdmin
      .from("posts")
      .select("id, title, slug")
      .eq("slug", "mongodb-document-oriented-database")
      .single();

    if (existing) {
      console.log(`Post already exists: "${existing.title}" (${existing.slug}). Updating content...`);

      const { data: updated, error } = await supabaseAdmin
        .from("posts")
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating post:", error);
        process.exit(1);
      }

      console.log("Post updated successfully!");
      console.log("ID:", updated.id);
      console.log("Title:", updated.title);
      console.log("Content length:", updated.content.length, "characters");
      return;
    }

    console.log("Creating new MongoDB post...");

    const { data: newPost, error } = await supabaseAdmin
      .from("posts")
      .insert({
        title: "MongoDB: The Document-Oriented Database",
        slug: "mongodb-document-oriented-database",
        excerpt:
          "A deep dive into MongoDB — from BSON internals and flexible document modeling to indexing strategies, aggregation pipelines, sharding, and ACID transactions. Everything you need to understand how MongoDB works and when to use it.",
        content,
        cover_image_url:
          "https://webimages.mongodb.com/_com_assets/cms/kuzt9r42or1fxvlq2-Meta_Generic.png",
        cover_image_alt: "MongoDB — The Document-Oriented Database",
        tags: ["MongoDB", "NoSQL", "Database", "Architecture", "DBS302"],
        published: true,
        author_name: "KP",
        author_email: "02230287.cst@rub.edu.bt",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      process.exit(1);
    }

    console.log("Post created successfully!");
    console.log("ID:", newPost.id);
    console.log("Title:", newPost.title);
    console.log("Slug:", newPost.slug);
    console.log("Content length:", newPost.content.length, "characters");
    console.log("Tags:", newPost.tags.join(", "));
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

postMongoDB();
