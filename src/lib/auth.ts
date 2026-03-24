import { auth, currentUser } from "@clerk/nextjs/server";

const ADMIN_EMAIL = "02230287.cst@rub.edu.bt";

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) return false;

  try {
    const user = await currentUser();
    const adminUserId = process.env.ADMIN_USER_ID;

    // Check by email
    if (user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL) {
      return true;
    }

    // Check by Clerk user ID (optional shortcut)
    if (adminUserId && userId === adminUserId) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}
