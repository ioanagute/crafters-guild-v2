'use client';

import Link from "next/link";
import { Menu, Shield, Swords, Scroll, Users, UserCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/marketplace", label: "Marketplace", icon: Scroll },
  { href: "/guilds", label: "Guilds", icon: Users },
  { href: "/tavern", label: "The Tavern", icon: Swords },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavigationClient({ isAuthenticated }: { isAuthenticated: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [open, pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      if (wasOpenRef.current) {
        toggleRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 border-b-4 border-iron-800 bg-iron-900/95 shadow-2xl backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 font-serif">
        <Link href="/" className="flex items-center gap-3 group">
          <Shield className="h-8 w-8 text-gold-500 group-hover:animate-flicker" />
          <span className="text-xl font-bold tracking-wider text-gold-accent sm:text-2xl">
            The Artisans&apos; Guild
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm uppercase tracking-widest text-parchment-200 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 transition-colors ${active ? "text-gold-400" : "hover:text-gold-400"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <Link
              href="/profile"
              aria-current={isActive(pathname, "/profile") ? "page" : undefined}
              className={`inline-flex items-center gap-2 border-2 px-6 py-2 transition-colors ${
                isActive(pathname, "/profile")
                  ? "border-gold-500 bg-leather-700 text-gold-300"
                  : "border-gold-600 bg-leather-800 text-parchment-200 hover:bg-leather-700"
              }`}
            >
              <UserCircle className="h-4 w-4" />
              My Heraldry
            </Link>
          ) : (
            <Link
              href="/login"
              aria-current={isActive(pathname, "/login") ? "page" : undefined}
              className={`border-2 px-6 py-2 transition-colors ${
                isActive(pathname, "/login")
                  ? "border-gold-500 bg-leather-700 text-gold-300"
                  : "border-gold-600 bg-leather-800 text-parchment-200 hover:bg-leather-700"
              }`}
            >
              Enter
            </Link>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center border border-iron-700 bg-iron-800 text-parchment-200 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-iron-700 bg-iron-900 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 border px-4 py-3 font-serif tracking-wider transition ${
                    active
                      ? "border-gold-600 bg-leather-800/80 text-gold-400"
                      : "border-iron-700 bg-iron-800 text-parchment-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              href={isAuthenticated ? "/profile" : "/login"}
              aria-current={isAuthenticated ? (isActive(pathname, "/profile") ? "page" : undefined) : (isActive(pathname, "/login") ? "page" : undefined)}
              className="mt-2 flex items-center justify-center gap-2 border-2 border-gold-600 bg-leather-800 px-4 py-3 font-serif tracking-wider text-gold-400"
            >
              <UserCircle className="h-4 w-4" />
              {isAuthenticated ? "My Heraldry" : "Enter"}
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
