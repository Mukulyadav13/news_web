import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line-strong bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark className="h-7 w-7 text-brand" />
              <span className="text-lg font-extrabold tracking-tight text-ink">
                {SITE_NAME}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              {SITE_TAGLINE}
            </p>
            <p className="mt-4 max-w-sm text-xs text-ink-faint">
              Official news is published by our editorial team. Community stories are
              shared by people like you and reviewed before publication.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-ink-soft transition-colors hover:text-ink">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-ink-soft transition-colors hover:text-ink">
                  News
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-ink-soft transition-colors hover:text-ink">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-ink-soft transition-colors hover:text-ink">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink">Community</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/community/new" className="text-ink-soft transition-colors hover:text-ink">
                  Share your story
                </Link>
              </li>
              <li>
                <Link href="/community?sort=trending" className="text-ink-soft transition-colors hover:text-ink">
                  Trending stories
                </Link>
              </li>
              <li>
                <Link href="/community?sort=most-viewed" className="text-ink-soft transition-colors hover:text-ink">
                  Most viewed
                </Link>
              </li>
              <li>
                <Link href="/profile?tab=bookmarks" className="text-ink-soft transition-colors hover:text-ink">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
          <p>Sample data shown for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
