import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE() {
  try {
    const { error } = await supabaseAdmin
      .from("posts")
      .delete()
      .eq("slug", "nosql-databases-unit-i");

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, message: "Post removed" });
  } catch (error) {
    return Response.json({ error: "Failed to delete" }, { status: 500 });
  }
}
