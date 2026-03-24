"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

interface SidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  onClose = () => {},
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 w-full px-4 md:px-6 lg:px-12 py-3 md:py-4 bg-white dark:bg-slate-950 border-b border-slate-300 dark:border-slate-700 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-slate-900 dark:text-slate-50 hover:opacity-70 transition-opacity"
            title="Home"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2v20"></path>
              <path d="M2 12h20"></path>
              <path d="M4.93 4.93l10.6 10.6"></path>
              <path d="M4.93 19.07l10.6-10.6"></path>
              <path d="M19.07 4.93l-10.6 10.6"></path>
              <path d="M19.07 19.07l-10.6-10.6"></path>
            </svg>
          </Link>
        </div>

        {/* Middle - Nav Links */}
        <nav className="flex items-center gap-4 md:gap-8">
          <Link
            href="/"
            className={`text-xs md:text-sm tracking-widest uppercase transition-all duration-300 ${
              isActive("/")
                ? "font-semibold text-slate-900 dark:text-slate-50"
                : "font-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`text-xs md:text-sm tracking-widest uppercase transition-all duration-300 ${
              isActive("/blog")
                ? "font-semibold text-slate-900 dark:text-slate-50"
                : "font-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Blog
          </Link>
        </nav>

        {/* Right - Icons, Auth, and Theme */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Social Icons - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/kinley-palden-645b11333/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-slate-900 dark:text-slate-50 hover:opacity-60 transition-opacity"
              title="LinkedIn"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            <a
              href="https://github.com/Kinley-pal8"
              rel="noopener noreferrer"
              target="_blank"
              className="text-slate-900 dark:text-slate-50 hover:opacity-60 transition-opacity"
              title="GitHub"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a
              href="mailto:02230287.cst@rub.edu.bt"
              className="text-slate-900 dark:text-slate-50 hover:opacity-60 transition-opacity"
              title="Email"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </a>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-slate-900 dark:text-slate-50 hover:opacity-60 transition-opacity p-1"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton>
              <button className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-900 dark:bg-slate-50 text-slate-50 dark:text-slate-900 font-semibold tracking-widest text-xs uppercase transition-all duration-300 hover:shadow-lg rounded border border-slate-900 dark:border-slate-50">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`text-xs md:text-sm tracking-widest uppercase transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "font-semibold text-slate-900 dark:text-slate-50"
                    : "font-light text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
