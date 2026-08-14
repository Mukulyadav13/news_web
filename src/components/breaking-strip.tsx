import Link from "next/link";
import type { NewsArticle } from "@/lib/types";

export function BreakingStrip({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="border-b border-brand/20 bg-brand text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <span className="flex shrink-0 items-center gap-1.5 rounded bg-surface/15 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-surface opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-surface" />
          </span>
          Breaking
        </span>
        <div className="no-scrollbar flex items-center gap-6 overflow-x-auto whitespace-nowrap">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/news/${a.slug}`}
              className="text-sm font-medium text-white/95 transition-opacity duration-200 hover:text-white"
            >
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
