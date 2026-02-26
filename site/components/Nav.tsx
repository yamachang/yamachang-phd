"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

const links = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
];

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[var(--color-bg)]/80 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-xl font-semibold text-[var(--color-heading)] hover:text-[var(--color-accent)] transition-colors"
        >
          Yama Chang
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors relative py-1 ${
                pathname === link.href
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-body)] hover:text-[var(--color-heading)]"
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)] rounded-full transition-transform duration-300 ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0"
                }`}
                style={{ transformOrigin: "left" }}
              />
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <MobileMenu links={links} />
        </div>
      </nav>
    </header>
  );
}
