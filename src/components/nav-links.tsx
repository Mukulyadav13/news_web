"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/news", label: "News", match: (p: string) => p.startsWith("/news") },
  {
    href: "/community",
    label: "Community",
    match: (p: string) => p.startsWith("/community") || p.startsWith("/colleges"),
  },
  { href: "/search", label: "Search", match: (p: string) => p.startsWith("/search") },
];

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const active = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200",
              active ? "text-ink" : "text-ink-soft hover:text-ink",
            )}
          >
            {item.label}
            <span
              className={cn(
                "absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-brand transition-all duration-200",
                active ? "opacity-100" : "opacity-0",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
