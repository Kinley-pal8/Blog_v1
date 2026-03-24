import { NextResponse, NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const userData = {
      clerk_id: user.id,
      email: user.primaryEmailAddress.emailAddress,
      first_name: user.firstName || "",
      last_name: user.lastName || "",
      full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "",
      profile_image_url: user.imageUrl || "",
      updated_at: new Date().toISOString(),
    };

    // Insert or update user in Supabase
    const { data, error } = await supabaseAdmin
      .from("users")
      .upsert([userData], { onConflict: "clerk_id" })
      .select()
      .single();

    if (error) {
      console.error("Error syncing user to Supabase:", error);
      return NextResponse.json(
        { error: "Failed to sync user" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "User synced successfully",
        user: data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const fetchAll = searchParams.get("all") === "true";

    if (fetchAll) {
      // Fetch all users (admin only) - verify admin status
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (adminError) {
        console.error("Error fetching all users:", adminError);
        return NextResponse.json(
          { error: "Failed to fetch users" },
          { status: 500 },
        );
      }

      return NextResponse.json({ users: adminData || [] }, { status: 200 });
    }

    // Fetch current user only
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: "Failed to fetch user" },
        { status: 500 },
      );
    }

    return NextResponse.json({ user: data || null }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
