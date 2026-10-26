"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/looks", label: "Looks" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Only render portal after hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Focus trap and restore focus on close
  useEffect(() => {
    if (!isOpen) {
      // Restore focus to trigger button when menu closes
      triggerRef.current?.focus();
      return;
    }

    const menu = menuRef.current;
    if (!menu) return;

    const focusables = Array.from(
      menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    
    // Focus the first link (or close button) when opened
    focusables[0]?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Handle close on navigation (only works if clicking a link doesn't unmount instantly)
  const handleNavClick = () => {
    setIsOpen(false);
  };

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed inset-0 z-50 flex flex-col bg-mn-canvas animate-menu w-full h-full"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Top Bar */}
      <div className="flex h-16 items-center justify-between px-5 sm:px-8 border-b border-mn-border">
        <Link
          href="/"
          onClick={handleNavClick}
          className="font-display text-xl tracking-tight"
        >
          MoonzNails
        </Link>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-5 py-12 sm:px-8">
        <nav aria-label="Mobile primary">
          <ul className="flex flex-col gap-8">
            {nav.map((item, i) => (
              <li key={item.href} className="animate-menu-link" style={{ animationDelay: `${i * 50}ms` }}>
                <Link
                  href={item.href}
                  className="block font-display text-4xl text-mn-ink hover:text-mn-rose-deep transition-colors"
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="lg:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mn-rose-ink focus-visible:ring-offset-2 focus-visible:ring-offset-mn-canvas"
        onClick={() => setIsOpen(true)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {mounted && isOpen && createPortal(menuContent, document.body)}
    </>
  );
}