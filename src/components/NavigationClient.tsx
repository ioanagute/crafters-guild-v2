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
    <nav className="sticky top-0 z-50 border-b border-gold-600/15 bg-iron-900/82 shadow-[0_22px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="page-shell">
        <div className="flex min-h-24 items-center justify-between gap-4 py-4 font-serif xl:grid xl:grid-cols-[auto_1fr_auto] xl:items-center xl:gap-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3 xl:justify-self-start xl:pr-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-600/40 bg-leather-800/55 shadow-[0_10px_22px_rgba(0,0,0,0.2)]">
              <Shield className="h-6 w-6 text-gold-500 group-hover:animate-flicker" />
            </span>
            <span className="min-w-0 py-1">
              <span className="eyebrow hidden text-[0.58rem] leading-[1.4] sm:block">Guild Ledger</span>
              <span className="block truncate pr-1 pb-1 text-base leading-[1.2] font-bold tracking-[0.15em] text-gold-accent sm:text-xl lg:text-2xl">
                The Artisans&apos; Guild
              </span>
            </span>
          </Link>

          <div className="hidden min-w-0 items-center justify-center xl:flex xl:justify-self-center">
            <div className="rounded-full border border-gold-600/12 bg-iron-800/72 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="flex items-center gap-2 text-[0.78rem] uppercase leading-none tracking-[0.22em] text-parchment-200">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`group relative inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full border px-4 py-3 text-center leading-none transition xl:min-w-[9rem] 2xl:min-w-[10.25rem] ${
                        active
                          ? "border-gold-500/50 bg-leather-800/90 text-gold-300 shadow-[0_12px_24px_rgba(0,0,0,0.24)]"
                          : "border-transparent text-parchment-300 hover:border-gold-600/25 hover:bg-iron-700/70 hover:text-gold-300"
                      }`}
                    >
                      {active && (
                        <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-gold-400 blur-[2px] opacity-60" />
                      )}
                      <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${active ? "text-gold-400" : "text-parchment-400 opacity-70 group-hover:opacity-100"}`} />
                      <span className="relative">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden items-center justify-end gap-3 xl:flex xl:justify-self-end xl:pl-4">
            {isAuthenticated ? (
              <Link
                href="/profile"
                aria-current={isActive(pathname, "/profile") ? "page" : undefined}
                className={`inline-flex min-h-12 min-w-[8.75rem] items-center justify-center gap-2 rounded-full border px-5 py-3 text-center text-sm uppercase leading-none tracking-[0.18em] transition ${
                  isActive(pathname, "/profile")
                    ? "border-gold-500/60 bg-leather-700 text-gold-200"
                    : "border-gold-600/70 bg-leather-800 text-parchment-100 hover:bg-leather-700 hover:text-gold-200"
                }`}
              >
                <UserCircle className="h-4 w-4" />
                My Heraldry
              </Link>
            ) : (
              <Link
                href="/login"
                aria-current={isActive(pathname, "/login") ? "page" : undefined}
                className={`group relative inline-flex min-h-12 min-w-[8.75rem] items-center justify-center overflow-hidden rounded-full border px-5 py-3 text-center text-sm uppercase leading-none tracking-[0.18em] transition ${
                  isActive(pathname, "/login")
                    ? "border-gold-500/60 bg-leather-700 text-gold-200"
                    : "border-gold-600/70 bg-leather-800 text-parchment-100 hover:bg-leather-700 hover:text-gold-200"
                }`}
              >
                <div className="absolute inset-x-0 inset-y-0 h-full w-12 -translate-x-full rotate-25 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-sheen" />
                <span className="relative">Enter</span>
              </Link>
            )}
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="ml-2 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-iron-700 bg-iron-800 text-parchment-100 shadow-[0_10px_22px_rgba(0,0,0,0.2)] xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-navigation" className="border-t border-gold-600/12 bg-iron-900/96 px-4 py-4 xl:hidden">
          <div className="page-shell">
            <div className="mb-3 rounded-[1rem] border border-iron-700/70 bg-iron-800/85 px-4 py-3">
              <p className="eyebrow mb-2 text-[0.58rem]">Current Hall</p>
              <p className="font-serif text-lg text-parchment-100">
                {pathname === "/" ? "Realm Overview" : navItems.find((item) => isActive(pathname, item.href))?.label ?? (isActive(pathname, "/profile") ? "My Heraldry" : isActive(pathname, "/login") ? "Entrance" : "Guild Route")}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-[1rem] border px-4 py-3 font-serif tracking-[0.18em] transition ${
                      active
                        ? "border-gold-600/70 bg-leather-800/90 text-gold-300"
                        : "border-iron-700 bg-iron-800 text-parchment-100 hover:border-gold-600/40 hover:bg-iron-700/60"
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
                className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-[1rem] border border-gold-600 bg-leather-800 px-4 py-3 font-serif tracking-[0.18em] text-gold-300"
              >
                <UserCircle className="h-4 w-4" />
                {isAuthenticated ? "My Heraldry" : "Enter"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
