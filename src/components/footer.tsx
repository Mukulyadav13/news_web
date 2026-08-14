import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface text-ink">
      {/* Top BBC Style Red Accent Strip */}
      <div className="h-1 w-full bg-brand" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Logo & About Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="flex h-6 w-6 items-center justify-center bg-brand text-xs font-black text-white">
                  B
                </span>
                <span className="flex h-6 w-6 items-center justify-center bg-brand text-xs font-black text-white">
                  B
                </span>
                <span className="flex h-6 w-6 items-center justify-center bg-brand text-xs font-black text-white">
                  C
                </span>
              </div>
              <span className="text-lg font-black tracking-wider text-ink uppercase">
                NEWS
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-ink-soft max-w-sm">
              BBC News delivers trusted international and national breaking headlines, in-depth analysis, world business, science, technology, and community dispatches.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-brand">
              News Categories
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-ink-soft">
              <li>
                <Link href="/news?scope=international" className="hover:text-brand hover:underline">
                  World News
                </Link>
              </li>
              <li>
                <Link href="/news?scope=national" className="hover:text-brand hover:underline">
                  National News
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand hover:underline">
                  Business & Markets
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand hover:underline">
                  Innovation & Science
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-brand hover:underline">
                  Climate & Earth
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Hub Addon Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-community">
              Community Hub
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-ink-soft">
              <li>
                <Link href="/community" className="hover:text-community hover:underline">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-community hover:underline">
                  Campus & Colleges
                </Link>
              </li>
              <li>
                <Link href="/community/new" className="hover:text-community hover:underline">
                  Share Your Story
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-community hover:underline">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Integrity Column */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-ink">
              BBC Standards
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              BBC News is committed to impartiality, accuracy, and independent editorial standards across global reporting.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} BBC News Inspired Media. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:underline">Terms of Use</Link>
            <Link href="/" className="hover:underline">Privacy Policy</Link>
            <Link href="/" className="hover:underline">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
