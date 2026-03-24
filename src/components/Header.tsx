"use client";

import Link from "next/link";
import {
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { useTheme } from "@/lib/theme";
import { useSyncUserToDatabase } from "@/lib/useSyncUserToDatabase";
import { useState, useEffect } from "react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync user to database when they log in
  useSyncUserToDatabase();

  useEffect(() => {
    if (user?.id) {
      checkAdminStatus();
    } else {
      setLoading(false);
      setIsAdmin(false);
    }
  }, [user?.id]);

  async function checkAdminStatus() {
    try {
      const res = await fetch("/api/admin", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-base md:text-lg tracking-widest font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300"
        >
          KP
        </Link>

        {/* Navigation Links & Auth */}
        <div className="flex gap-4 md:gap-8 items-center text-xs md:text-sm">
          {/* Home Link */}
          <Link
            href="/"
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 font-medium tracking-wide uppercase hidden sm:block"
          >
            HOME
          </Link>

          {/* Blog Link */}
          <Link
            href="/blog"
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 font-medium tracking-wide uppercase hidden sm:block"
          >
            BLOG
          </Link>

          {/* Dashboard - Admin Only */}
          {!loading && isAdmin && (
            <Link
              href="/dashboard"
              className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300 font-medium tracking-wide uppercase hidden md:block"
            >
              DASHBOARD
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 text-lg"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton>
              <button className="px-4 md:px-6 py-2 bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 font-medium tracking-wide text-xs uppercase transition-all duration-300 hover:opacity-80 rounded">
                SIGN IN
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3 md:gap-4 pl-3 md:pl-4 border-l border-slate-200 dark:border-slate-800">
              {user && (
                <div className="text-right hidden md:block">
                  <p className="text-xs font-light text-slate-700 dark:text-slate-300">
                    Welcome back
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {user.firstName || user.username || "User"}
                  </p>
                </div>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-slate-200 dark:border-slate-700",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
