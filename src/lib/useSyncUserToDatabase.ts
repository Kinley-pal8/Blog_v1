import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useSyncUserToDatabase() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Sync user to Supabase when they log in
    async function syncUser() {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Failed to sync user to database");
        } else {
          const data = await response.json();
          console.log("✓ User synced to database:", data.user);
        }
      } catch (error) {
        console.error("Error syncing user:", error);
      }
    }

    syncUser();
  }, [user?.id, isLoaded]);
}
