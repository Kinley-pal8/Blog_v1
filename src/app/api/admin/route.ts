import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }

  const adminStatus = await isAdmin();
  return NextResponse.json({ isAdmin: adminStatus }, { status: 200 });
}
