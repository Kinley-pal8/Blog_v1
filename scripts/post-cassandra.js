const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://ntprtcmkkwejpsxvdyne.supabase.co";
const supabaseServiceKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50cHJ0Y21ra3dlanBzeHZkeW5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDE5ODcwNSwiZXhwIjoyMDg5Nzc0NzA1fQ.htS30zJL_I2eEnuFUXHci-1D-IG5TWvoJbvUzYZ7WfY";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function postCassandra() {
  try {
    const content = fs.readFileSync(
      "/home/kp/Desktop/Y 3 S 6/DBS302/blog/cassandra.md",
      "utf-8",
    );

    console.log("Checking if Cassandra post already exists...");

    const { data: existing } = await supabaseAdmin
      .from("posts")
      .select("id, title, slug")
      .eq("slug", "apache-cassandra-masterless-distributed-database")
      .single();

    if (existing) {
      console.log(`Post already exists: "${existing.title}". Updating content...`);

      const { data: updated, error } = await supabaseAdmin
        .from("posts")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) { console.error("Error updating post:", error); process.exit(1); }

      console.log("Post updated successfully!");
      console.log("Content length:", updated.content.length, "characters");
      return;
    }

    console.log("Creating new Cassandra post...");

    const { data: newPost, error } = await supabaseAdmin
      .from("posts")
      .insert({
        title: "Apache Cassandra: The Masterless Distributed Database",
        slug: "apache-cassandra-masterless-distributed-database",
        excerpt:
          "A deep dive into Apache Cassandra - from the LSM tree write path and query-first data modeling to tunable consistency, the masterless ring, compaction strategies, and the new features in Cassandra 5.0 including Storage-Attached Indexes and vector search.",
        content,
        cover_image_url:
          "https://user-images.githubusercontent.com/45159366/137402442-01feaec5-a468-4951-a523-8b8662748929.png",
        cover_image_alt: "Apache Cassandra - The Masterless Distributed Database",
        tags: ["Cassandra", "NoSQL", "Database", "Distributed Systems", "DBS302"],
        published: true,
        author_name: "KP",
        author_email: "02230287.cst@rub.edu.bt",
      })
      .select()
      .single();

    if (error) { console.error("Error creating post:", error); process.exit(1); }

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

postCassandra();
