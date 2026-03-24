"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";

export function MobileMenuToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Visible on small screens only */}
      <button
        onClick={toggleMenu}
        className="fixed top-2 left-2 md:top-4 md:left-4 lg:hidden z-40 p-2 bg-white dark:bg-slate-950 rounded shadow-md border border-slate-200 dark:border-slate-800 hover:opacity-80 transition-all"
        aria-label="Toggle menu"
        title="Toggle menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-slate-900 dark:text-slate-50"
        >
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>

      {/* Overlay - Visible when menu is open on small screens */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={closeMenu}
          aria-label="Close menu"
        />
      )}

      {/* Mobile Sidebar - Slides in from left */}
      <div
        className={`fixed left-0 top-0 h-screen w-72 transform transition-transform duration-300 ease-in-out lg:hidden z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={closeMenu} isMobile={true} />
      </div>

      {/* Desktop Sidebar - Always visible */}
      <div className="hidden lg:block">
        <Sidebar onClose={() => {}} isMobile={false} />
      </div>
    </>
  );
}
