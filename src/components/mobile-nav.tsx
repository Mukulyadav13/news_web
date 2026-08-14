"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  NewspaperIcon,
  SearchIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon, match: (p: string) => p === "/" },
  { href: "/news", label: "News", icon: NewspaperIcon, match: (p: string) => p.startsWith("/news") },
  {
    href: "/community",
    label: "Community",
    icon: UsersIcon,
    match: (p: string) => p.startsWith("/community") || p.startsWith("/colleges"),
  },
  { href: "/search", label: "Search", icon: SearchIcon, match: (p: string) => p.startsWith("/search") },
  { href: "/profile", label: "Profile", icon: UserIcon, match: (p: string) => p.startsWith("/profile") },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line-strong bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150",
                active ? "text-brand" : "text-ink-faint hover:text-ink-soft",
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "scale-110 transition-transform duration-200")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
