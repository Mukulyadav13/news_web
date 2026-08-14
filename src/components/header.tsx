import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProfileMenu } from "@/components/profile-menu";
import { DEMO_USER } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Branding Logo */}
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-sm font-black tracking-tighter text-white">
              G
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-sm font-black tracking-tighter text-white">
              E
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-sm font-black tracking-tighter text-white">
              N
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded bg-brand text-sm font-black tracking-tighter text-white">
              Z
            </span>
          </div>
          <span className="text-lg font-black tracking-wider text-ink uppercase">
            NEWS
          </span>
        </Link>

        {/* Search & Profile Controls on Right */}
        <div className="flex items-center gap-3">
          <form
            action="/search"
            method="get"
            className="relative hidden w-56 sm:block md:w-72"
          >
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
            <input
              type="search"
              name="q"
              placeholder="Search GENZ News…"
              className="w-full rounded-full border border-line bg-muted py-1.5 pl-9 pr-4 text-xs text-ink placeholder:text-ink-faint focus:border-brand/40 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand/10"
            />
          </form>

          <ProfileMenu user={DEMO_USER} />
        </div>
      </div>
    </header>
  );
}
