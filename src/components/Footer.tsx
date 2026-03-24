"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-8">
        <div className="flex gap-6 text-sm font-medium">
          <Link
            href="https://github.com/Kinley-pal8"
            target="_blank"
            className="text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300"
          >
            GITHUB
          </Link>
          <Link
            href="https://www.linkedin.com/in/kinley-palden-645b11333/"
            target="_blank"
            className="text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-300"
          >
            LINKEDIN
          </Link>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-500 font-light">
          © 2026 KP's Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
