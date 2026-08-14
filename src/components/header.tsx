import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { NavLinks } from "@/components/nav-links";
import { ProfileMenu } from "@/components/profile-menu";
import { DEMO_USER } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface shadow-xs">
      {/* Top BBC Style Branding Header */}
      <div className="bg-brand text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            {/* Iconic BBC 3-Box Branding Logo */}
            <div className="flex items-center gap-1">
              <span className="flex h-7 w-7 items-center justify-center bg-white text-base font-black tracking-tighter text-black">
                B
              </span>
              <span className="flex h-7 w-7 items-center justify-center bg-white text-base font-black tracking-tighter text-black">
                B
              </span>
              <span className="flex h-7 w-7 items-center justify-center bg-white text-base font-black tracking-tighter text-black">
                C
              </span>
            </div>
            <span className="text-xl font-black tracking-wider text-white uppercase">
              NEWS
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <form
              action="/search"
              method="get"
              className="relative hidden w-64 md:block"
            >
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/70" />
              <input
                type="search"
                name="q"
                placeholder="Search BBC News…"
                className="w-full rounded bg-white/15 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-white/70 focus:bg-white focus:text-black focus:outline-none focus:placeholder:text-gray-500"
              />
            </form>
            <ProfileMenu user={DEMO_USER} />
          </div>
        </div>
      </div>

      {/* BBC Editorial Category Navigation Bar */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
