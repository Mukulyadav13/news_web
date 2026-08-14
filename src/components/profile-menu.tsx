"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/avatar";
import {
  BellIcon,
  BookmarkIcon,
  FileTextIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { href: "/profile", label: "My Profile", icon: UserIcon },
  { href: "/profile?tab=posts", label: "My Posts", icon: FileTextIcon },
  { href: "/profile?tab=bookmarks", label: "Bookmarks", icon: BookmarkIcon },
  { href: "/profile?tab=following", label: "Following", icon: UsersIcon },
  { href: "/profile?tab=notifications", label: "Notifications", icon: BellIcon },
  { href: "/profile?tab=settings", label: "Settings", icon: SettingsIcon },
];

export function ProfileMenu({
  user,
}: {
  user: { name: string; username: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const [signedOut, setSignedOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const name = user?.name ?? "Guest";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full p-1 transition-transform duration-200 hover:scale-105 focus-ring"
      >
        <Avatar name={name} size="sm" />
        <span className="hidden text-sm font-semibold text-ink lg:block">{name.split(" ")[0]}</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-60 origin-top-right animate-[menuIn_160ms_ease-out] overflow-hidden rounded-2xl border border-line bg-surface py-1.5 shadow-xl shadow-slate-900/10">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold text-ink">{name}</p>
            <p className="truncate text-xs text-ink-faint">@{user?.username ?? "guest"}</p>
          </div>
          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-muted hover:text-ink"
              >
                <item.icon className="h-4 w-4 text-ink-faint" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-3">
            <span className="flex items-center gap-3 text-sm font-medium text-ink-soft">
              <MoonIcon className="h-4 w-4 text-ink-faint" />
              Dark mode
            </span>
            <ThemeSwitch />
          </div>
          <div className="border-t border-line">
            <button
              type="button"
              onClick={() => setSignedOut(true)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-brand transition-colors duration-150 hover:bg-brand-soft"
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </button>
            {signedOut ? (
              <p className="px-4 pb-2.5 text-xs text-ink-faint">
                Demo mode — you are always signed in as {name}.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
