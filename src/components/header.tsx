import Link from "next/link";
import { LogoMark, SearchIcon } from "@/components/icons";
import { NavLinks } from "@/components/nav-links";
import { ProfileMenu } from "@/components/profile-menu";
import { DEMO_USER, SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark className="h-8 w-8 text-brand" />
          <span className="text-lg font-extrabold tracking-tight text-ink">
            {SITE_NAME}
          </span>
        </Link>

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <form
          action="/search"
          method="get"
          className="relative ml-auto hidden w-full max-w-xs md:block"
        >
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            name="q"
            placeholder="Search news, people, colleges…"
            className="w-full rounded-full border border-line-strong bg-muted py-2 pl-9 pr-4 text-sm text-ink placeholder:text-ink-faint transition-all duration-200 focus:border-brand/40 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
        </form>

        <div className="ml-auto md:ml-0">
          <ProfileMenu user={DEMO_USER} />
        </div>
      </div>
    </header>
  );
}
